#!/bin/sh

docker run -p 80:80 -p 443:443 \
  --rm \
  -v "$(pwd)/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$(pwd)/nginx/ssl:/etc/nginx/ssl:ro" \
  frontend:latest