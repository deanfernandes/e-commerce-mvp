#!/bin/sh

docker run -p 8080:8080 --rm --env-file .env ghcr.io/deanfernandes/chat-service-app:latest