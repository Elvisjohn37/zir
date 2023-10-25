#!/bin/bash

# recache config 
echo -e "\033[1;35m Caching config... \033[0m"
php artisan config:clear && php artisan config:cache
echo -e "\033[1;35m Done config cache! \033[0m"

# RUN webserver
echo -e "\033[1;35m App start \033[0m" 
/entrypoint supervisord