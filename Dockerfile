# ==============================================================================
# Stage 1: Composer Vendor Builder
# ==============================================================================
FROM composer:2 AS vendor-builder
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev

# ==============================================================================
# Stage 2: Runtime Container (PHP 8.4-FPM + Nginx + Node.js/NPM on Alpine)
# ==============================================================================
FROM php:8.4-fpm-alpine AS runtime

LABEL maintainer="Homesick Sunday Team"
LABEL description="Laravel 12 Production Container with Node.js for ARM64 / Multi-arch"

# Install system dependencies, PostgreSQL runtime libraries, Node.js & NPM
RUN set -xe \
    && apk update \
    && apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        nodejs \
        npm \
        libpq \
        postgresql-client \
        libzip \
        icu-libs \
        freetype \
        libjpeg-turbo \
        libpng \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        postgresql-dev \
        libzip-dev \
        icu-dev \
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        zip \
        bcmath \
        intl \
        opcache \
        pcntl \
        gd \
        exif \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

# Custom PHP configuration
RUN { \
        echo "memory_limit = 256M"; \
        echo "upload_max_filesize = 64M"; \
        echo "post_max_size = 64M"; \
        echo "max_execution_time = 300"; \
        echo "date.timezone = UTC"; \
        echo "opcache.enable = 1"; \
        echo "opcache.enable_cli = 1"; \
        echo "opcache.memory_consumption = 128"; \
        echo "opcache.interned_strings_buffer = 8"; \
        echo "opcache.max_accelerated_files = 10000"; \
        echo "opcache.validate_timestamps = 1"; \
        echo "opcache.save_comments = 1"; \
    } > /usr/local/etc/php/conf.d/custom-production.ini

WORKDIR /var/www/html

# Copy application source code
COPY . /var/www/html

# Copy built vendor from composer stage
COPY --from=vendor-builder /app/vendor /var/www/html/vendor

# Install NPM dependencies inside container (ARM64 compatible)
# Ini memastikan paket node_modules siap sehingga Anda bisa menjalankan `npm run build` kapan saja via docker exec
RUN npm ci --prefer-offline --no-audit || npm install

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Setup Nginx directories and permissions
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /var/lib/nginx/tmp /var/log/nginx /var/run/nginx \
    && chown -R www-data:www-data /var/lib/nginx /var/log/nginx /var/run/nginx \
    && mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
