#!/bin/bash
docker run --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot renew --quiet

# 重载 Nginx
docker exec ziyuanba-nginx nginx -s reload
