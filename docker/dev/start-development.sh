#!/bin/bash

if [ "$APP_IS_MOBILE" == "true" ]; then

    rm -rf /opt/docker/etc/supervisor.d/supervisor-npm.conf

else
    # composer install if /vendor is not yet existing
    [ ! -d "./vendor" ] && \
    echo -e "\033[1;35m Installing Zircon PS Composer package... \033[0m" && \
    composer install

    # npm install if /node_modules is not yet existing
    [ ! -d "./node_modules" ] && \
    echo -e "\033[1;35m Installing Zircon PS NPM package... \033[0m" && \
    npm ci --verbose

    if [ "$(stat -c "%U" ./)" != "sail" ]; then
        echo -e "\033[1;35m Applying user:group permission to project folder... \033[0m" 
        
        if [ "$WWWUSER" -ne 0 ]; then
            echo -e "Assigning sail as WWWUSER UID..." 
            usermod -u $WWWUSER sail
        fi
    fi

    echo -e "Changing project folder owner to sail..." 
    chown sail:sail -R /var/www/html
fi


if [ $# -gt 0 ]; then
  exec gosu $WWWUSER "$@"
else 
  echo -e "\033[1;35m App start \033[0m" 
  /entrypoint supervisord
fi