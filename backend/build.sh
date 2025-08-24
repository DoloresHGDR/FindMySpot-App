#!/bin/bash

COMPOSE_FILE="docker/application/docker-compose.yml"

LINE=$(grep -m 1 -E '^\s*image:\s*backend:v[0-9]+\.[0-9]+\.[0-9]+' "$COMPOSE_FILE")

if [ -z "$LINE" ]; then
  echo "No se encontró la línea image en docker-compose.yml"
  exit 1
fi

VERSION=$(echo "$LINE" | sed -E 's/.*backend:v([0-9]+\.[0-9]+\.[0-9]+).*/\1/')

if [ -z "$VERSION" ]; then
  echo "No se pudo extraer la versión de la línea: $LINE"
  exit 1
fi

echo "Versión detectada: v$VERSION"

echo "Ejecutando ./gradlew clean build -x test..."
./gradlew clean build -x test || exit 1

echo "Construyendo la imagen Docker: backend:v$VERSION"
docker build -t backend:v$VERSION . || exit 1

cd docker/application || { echo "No se pudo cambiar a la carpeta docker/application"; exit 1; }

docker-compose --version || { echo "docker-compose no es accesible"; exit 1; }

docker-compose down || true

docker-compose up -d || { echo "Fallo al levantar los contenedores"; exit 1; }

echo "Proceso completado."
