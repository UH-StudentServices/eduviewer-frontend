#!/usr/bin/env bash

DOCKER_TAG=$1
REGISTRY_USER=$2
REGISTRY_TOKEN=$3
REGISTRY_URL=$4

echo Running docker-compose with tag $DOCKER_TAG

docker login -u="$REGISTRY_USER" -p="$REGISTRY_TOKEN" $REGISTRY_URL

docker-compose pull && docker-compose stop && docker-compose up -d
