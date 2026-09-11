# ==============================================================================
# Stage 1: Frontend Builder (React / Vite Assets)
# ==============================================================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install dependencies (respecting ARM64 platform binaries)
RUN npm ci --prefer-offline --no-audit

# Copy application source needed for Vite build
COPY resources ./resources
COPY public ./public
COPY vite.config.ts tsconfig.json components.json ./
COPY routes ./routes
COPY app ./app

# Build production assets to public/build
RUN npm run build

# ==============================================================================
# Stage 2: Composer Vendor Builder
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
# Stage 3: Production Runtime (PHP 8.4-FPM + Nginx on Alpine)
# ==============================================================================
FROM php:8.4-fpm-alpine AS runtime

LABEL maintainer="Homesick Sunday Team"
LABEL description="Laravel 12 Production Container for ARM64 / Multi-arch"

# Install system dependencies & PostgreSQL runtime libraries
RUN set -xe \
    && apk update \
    && apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
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

# Copy custom PHP configuration
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

# Copy built frontend assets from node stage
COPY --from=frontend-builder /app/public/build /var/www/html/public/build

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
