#----------------
# BASE
#----------------
FROM webdevops/php-nginx:8.1-alpine as base

WORKDIR /var/www/html

#define nginx config with root folder
ENV TZ=Asia/Manila PHP_DATE_TIMEZONE=Asia/Manila WEB_DOCUMENT_ROOT=/var/www/html/public FPM_REQUEST_TERMINATE_TIMEOUT=300

# Microsoft SQL Server Prerequisites
RUN apk update && \
    apk add --no-cache gnupg && \
    curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.8.1.1-1_amd64.apk && \
    curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.8.1.1-1_amd64.apk && \
    curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.8.1.1-1_amd64.sig && \
    curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.8.1.1-1_amd64.sig && \
    curl https://packages.microsoft.com/keys/microsoft.asc  | gpg --import - && \
    gpg --verify msodbcsql17_17.8.1.1-1_amd64.sig msodbcsql17_17.8.1.1-1_amd64.apk && \
    gpg --verify mssql-tools_17.8.1.1-1_amd64.sig mssql-tools_17.8.1.1-1_amd64.apk && \
    apk add --allow-untrusted msodbcsql17_17.8.1.1-1_amd64.apk && \
    apk add --allow-untrusted mssql-tools_17.8.1.1-1_amd64.apk && \
    apk update && \
    apk add unixodbc-dev autoconf make g++ && \
    pecl install pdo_sqlsrv sqlsrv  && \
    echo extension=pdo_sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/10_pdo_sqlsrv.ini && \
    echo extension=sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/00_sqlsrv.ini

#define build time ARGS and Environments
ARG ASSET_MANIFEST=assetsmanifest.json
ENV ASSET_MANIFEST=${ASSET_MANIFEST}
ARG ASSET_IS_VERSIONED=true
ENV ASSET_IS_VERSIONED=${ASSET_IS_VERSIONED}
ARG ASSET_PATH=/ps
ENV ASSET_PATH=${ASSET_PATH}
ENV APP_VERSION=4.5.10



#----------------
# NON PRODUCTION DEPENDENCIES
#----------------
FROM base as devdependencies

#Install NODEJS and Other npm tools
RUN apk add --update nodejs npm
#RUN npm install -g jest

#----------------
# DEVELOPMENT
#----------------
FROM devdependencies as development

# Set development env
ENV APP_ENV=local
ENV NODE_ENV=development
ENV CONTAINER_UID=sail

#Sail group and user
ARG WWWGROUP
RUN set -ex && apk --no-cache add sudo
RUN groupadd --force -g $WWWGROUP sail
RUN useradd -ms /bin/bash --no-user-group -g $WWWGROUP -u 1337 sail
RUN chmod g+rwx -R /root
RUN usermod -a -G root sail
RUN userdel nginx
RUN userdel application
RUN sed -i -e "s/nginx;/sail;/" /opt/docker/etc/nginx/nginx.conf

# Copy entrypoint configs
COPY ./docker/dev/supervisor-npm.conf /opt/docker/etc/supervisor.d/
COPY ./docker/dev/start-development.sh /opt/docker/provision/entrypoint/start-development.sh
RUN chmod +x /opt/docker/provision/entrypoint/start-development.sh
ENTRYPOINT [ "/opt/docker/provision/entrypoint/start-development.sh" ]

#----------------
# SETUP
#----------------
FROM devdependencies as setup

# copy only config files needed for npm installation, this will benefit from docker layer caching
COPY package*.json *.config.js ./
RUN npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retry-maxtimeout 100000 && \
    npm config set registry http://nexus01.leekie.com:8081/repository/npm-proxy/ && \
    npm ci

#----------------
# TEST
#----------------
FROM setup as test

# Copy necessary files for unit testing frontend
COPY ./resources/frontend ./resources/frontend
# Frontend unit test
# RUN npm run test

# Copy necessary files for unit testing backend
RUN  mkdir -p /home/nginx/.composer

# Install all composer packages for running test
USER nginx
COPY ./ ./
RUN composer install
USER root

# Backend unit test
# RUN php artisan test --testsuite=Unit 

#----------------
# BUILD
#----------------
FROM devdependencies as build

# Copy setup project files
COPY --from=test /var/www/html/node_modules ./node_modules

# set env variables for build
ENV NODE_ENV=production

# Copy and create necessary files for frontend building
COPY package*.json *.config.js ./
COPY ./resources/frontend ./resources/frontend
COPY ./nodescripts ./nodescripts
# Build frontend
RUN npm run build

# Copy and create necessary files for backend building 
RUN  mkdir -p /home/nginx/.composer
COPY composer.* ./

# Build Backend
# Install necessary composer packages only for production
USER nginx
RUN composer install --no-scripts --no-dev --no-autoloader
USER root

# Copy whole project files, except the one in .dockerignore
COPY ./ ./
RUN composer dump-autoload --no-dev --optimize

#----------------
# PRODUCTION
#----------------
FROM base as production

# set env to production
ENV APP_ENV=production

# Copy needed files from build
COPY --from=build "/var/www/html/public${ASSET_PATH}" "./public${ASSET_PATH}"
COPY --from=build /var/www/html/assetsmanifest.json assetsmanifest.json
COPY --from=build /var/www/html/vendor ./vendor

# Copy whole project files, except the one in .dockerignore
COPY ./ ./
RUN chown -R application:application /var/www/html

# Laravel Cache
RUN php artisan route:clear && php artisan view:clear \
    && php artisan route:cache && php artisan view:cache

EXPOSE 80

# Copy start script
COPY ./docker/start-production.sh /scripts/start-production.sh 
RUN chmod +x /scripts/start-production.sh

# Cleanup
RUN rm -rf ./resources/frontend \
	&& rm -rf ./resources/frontend ./docker

# Start Application
ENTRYPOINT ["/scripts/start-production.sh"]
