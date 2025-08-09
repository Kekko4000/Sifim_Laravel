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

# --- Node.js (18 LTS compatibile con Vite) ---
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
 && apt-get update && apt-get install -y nodejs \
 && node -v && npm -v \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia file PHP e JS
COPY . .

# Rimuovi eventuale .env locale
RUN rm -f .env

# --- PHP deps ---
RUN composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

# --- JS deps + build ---
RUN if [ -f package.json ]; then \
      if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi && \
      npm run build; \
    fi

# --- Porta esposta da Render ---
EXPOSE 10000

# --- Avvio ---
CMD sh -lc '\
  if [ -z "$APP_KEY" ]; then php artisan key:generate --force; fi && \
  php artisan config:clear && \
  php artisan migrate --force && \
  php artisan storage:link || true && \
  php -S 0.0.0.0:$PORT -t public \
'
