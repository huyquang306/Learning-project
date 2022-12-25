FROM php:7.4-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl

# Install nodejs
RUN apt-get install -y \
    nodejs \
    npm

RUN apt-get install -y \
    libzip-dev \
    zip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip exif pcntl
RUN docker-php-ext-configure gd \
    && docker-php-ext-install -j$(nproc) gd

RUN apt-get update && apt-get install -y imagemagick libmagickwand-dev \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www

USER $user
