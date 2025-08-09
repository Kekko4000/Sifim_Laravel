# PHP CLI (useremo il server integrato su $PORT)
FROM php:8.2-cli-bullseye

# --- System deps (aggiungo anche build tools per node-gyp) ---
RUN apt-get update && apt-get install -y \
    git unzip curl ca-certificates \
    libpq-dev libzip-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libicu-dev libonig-dev \
    build-essential python3 \
 && rm -rf /var/lib/apt/lists/*

# --- PHP extensions ---
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql zip gd intl bcmath pcntl opcache

# --- Composer ---
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --- Node.js (18 LTS è il più compatibile con molti progetti Vite attuali) ---
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
 && apt-get update && apt-get install -y nodejs \
 && node -v && npm -v \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# NON portare l'.env locale dentro l'immagine
COPY . .
RUN rm -f .env

# --- PHP deps ---
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

# --- JS deps + build (solo se esiste package.json e lo script build) ---
# 1) se c'è package-lock usa npm ci, altrimenti npm i
RUN if [ -f package.json ]; then \
      if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm i --no-audit --no-fund; fi && \
      # controlla che esista lo script "build" in package.json
      node -e "const p=require('./package.json'); if(!p.scripts||!p.scripts.build){process.exit(42)}" \
      && npm run build || echo 'Nessuno script build: salto'; \
    fi

# Render esporrà questa porta via $PORT
EXPOSE 10000

# Avvio: key, cache, migrate, storage link, serve
CMD sh -lc '\
  if [ -z "$APP_KEY" ]; then php artisan key:generate --force; fi && \
  php artisan config:clear && \
  php artisan migrate --force && \
  php artisan storage:link || true && \
  php -S 0.0.0.0:$PORT -t public \
'
