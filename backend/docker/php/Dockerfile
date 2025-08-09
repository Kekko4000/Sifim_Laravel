FROM php:8.2-fpm-bullseye

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libpng-dev libonig-dev libicu-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql zip gd intl bcmath pcntl opcache

# (Opzionale) Redis
# RUN pecl install redis && docker-php-ext-enable redis

# Composer (copia dall'immagine ufficiale)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Ottimizza layer Composer
COPY composer.json composer.lock* ./
RUN composer install --no-interaction --no-scripts --no-autoloader

# Codice applicazione
COPY . .

# Installa dipendenze PHP del progetto
RUN composer install --no-interaction

# Permessi (semplice)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

USER www-data

CMD ["php-fpm"]
