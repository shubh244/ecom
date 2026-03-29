FROM php:8.2-cli

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
  && docker-php-ext-install zip pdo_mysql pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application code first, because Composer's post-autoload-dump step
# runs `php artisan package:discover` which requires `artisan` to exist.
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Ensure Laravel cache/storage directories are writable
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# Run database migrations + seed dummy data on container start (important
# for free tiers where we may not have an interactive shell). Then start
# the API server.
CMD ["sh", "-c", "php artisan migrate --force && php artisan db:seed --force && (php artisan storage:link || true) && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]

