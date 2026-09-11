#!/usr/bin/env bash
set -e

# ==============================================================================
# Homesick Sunday - Automated Docker Startup & Seeder Script (ARM64 / Multi-Arch)
# ==============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}   Homesick Sunday - Docker Startup & Seeder Script   ${NC}"
echo -e "${CYAN}======================================================${NC}"

# 1. Periksa ketersediaan Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker tidak ditemukan. Silakan install Docker terlebih dahulu.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}[ERROR] Docker Compose plugin ('docker compose') tidak ditemukan.${NC}"
    exit 1
fi

# 2. Periksa file .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}[INFO] File .env tidak ditemukan. Menyalin dari .env.example.docker...${NC}"
    cp .env.example.docker .env
else
    echo -e "${GREEN}[OK] File .env ditemukan.${NC}"
fi

# Pastikan port default terdefinisi jika belum ada di .env
APP_PORT=$(grep "^APP_PORT=" .env | cut -d '=' -f2 || echo "")
if [ -z "$APP_PORT" ]; then
    APP_PORT=1929
fi

DB_PORT_FORWARD=$(grep "^DB_PORT_FORWARD=" .env | cut -d '=' -f2 || echo "")
if [ -z "$DB_PORT_FORWARD" ]; then
    DB_PORT_FORWARD=5429
fi

echo -e "${BLUE}[INFO] Port Aplikasi: ${APP_PORT}${NC}"
echo -e "${BLUE}[INFO] Port Database Host: ${DB_PORT_FORWARD}${NC}"

# 3. Build dan jalankan container (Tanpa kompilasi frontend npm di host)
echo -e "\n${YELLOW}[1/5] Menjalankan container Docker...${NC}"
docker compose up -d --build

# 4. Menunggu PostgreSQL siap
echo -e "\n${YELLOW}[2/5] Menunggu service PostgreSQL siap menerima koneksi...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
UNTIL_HEALTHY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        UNTIL_HEALTHY=true
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "Menunggu database... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

if [ "$UNTIL_HEALTHY" = false ]; then
    echo -e "${RED}[ERROR] Database PostgreSQL gagal siap dalam batas waktu.${NC}"
    docker compose logs db
    exit 1
fi
echo -e "${GREEN}[OK] PostgreSQL siap!${NC}"

# 5. Generate APP_KEY jika belum terisi
echo -e "\n${YELLOW}[3/5] Memeriksa APP_KEY...${NC}"
docker compose exec -T app php -r '
    $env = file_get_contents(".env");
    if (!preg_match("/^APP_KEY=base64:.+$/m", $env)) {
        exit(1);
    }
' || {
    echo -e "${YELLOW}[INFO] Menghasilkan APP_KEY baru...${NC}"
    docker compose exec -T app php artisan key:generate --force
}
echo -e "${GREEN}[OK] APP_KEY siap.${NC}"

# 6. Jalankan Migrasi & Seeder
echo -e "\n${YELLOW}[4/5] Menjalankan Database Migration & Seeder...${NC}"
docker compose exec -T app php artisan migrate --seed --force
echo -e "${GREEN}[OK] Migration dan Seeder selesai dijalankan!${NC}"

# 7. Setup Storage Symlink & Bersihkan Cache
echo -e "\n${YELLOW}[5/5] Menghubungkan storage & optimasi aplikasi...${NC}"
docker compose exec -T app php artisan storage:link || true
docker compose exec -T app php artisan optimize:clear

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}   SELESAI! Container & Database Berhasil Berjalan!   ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo -e "Aplikasi Web: ${CYAN}http://localhost:${APP_PORT}${NC}"
echo -e "PostgreSQL:   ${CYAN}localhost:${DB_PORT_FORWARD}${NC} (Database: dashboard_tempates, User: postgres)"
echo -e "\nAkun Default Seeder:"
echo -e "  - Email:    ${CYAN}test@example.com${NC}"
echo -e "  - Password: ${CYAN}password${NC}"
echo -e "\nKompilasi Frontend (Jalankan manual kapan saja):"
echo -e "  - Build assets:     ${YELLOW}docker compose exec -it app npm run build${NC}"
echo -e "  - Masuk ke shell:   ${YELLOW}docker compose exec -it app sh${NC}"
echo -e "\nPerintah Berguna:"
echo -e "  - Cek log aplikasi: ${YELLOW}docker compose logs -f app${NC}"
echo -e "  - Cek log database: ${YELLOW}docker compose logs -f db${NC}"
echo -e "  - Hentikan docker:  ${YELLOW}docker compose down${NC}"
echo -e "======================================================\n"
