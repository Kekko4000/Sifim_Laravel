# PHP CLI (non FPM) così usiamo il server integrato
FROM php:8.2-cli-bullseye

# Pacchetti di sistema
RUN apt-get update && apt-get install -y \
    git unzip curl ca-certificates \
    libpq-dev libzip-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libicu-dev libonig-dev \
 && rm -rf /var/lib/apt/lists/*

# Estensioni PHP (pgsql, gd, ecc.)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql zip gd intl bcmath pcntl opcache

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Node.js 20 per build Inertia/Vite
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get update && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia il codice
COPY . .

# Non portarci dietro il .env locale
RUN rm -f .env

# Install dipendenze e build FE (se hai package-lock.json, userà npm ci)
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader
RUN [ -f package-lock.json ] && npm ci || npm i
RUN npm run build

# Render esporrà questa porta via $PORT
EXPOSE 10000

# Avvio: prepara app e avvia server HTTP su $PORT
# - genera APP_KEY se manca
# - pulisce/ricrea cache config
# - esegue migrate
# - crea symlink storage (ignora errore se esiste)
CMD sh -lc '\
  if [ -z "$APP_KEY" ]; then php artisan key:generate --force; fi && \
  php artisan config:clear && \
  php artisan migrate --force && \
  php artisan storage:link || true && \
  php -S 0.0.0.0:$PORT -t public \
'
