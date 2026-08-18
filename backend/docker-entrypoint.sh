#!/bin/sh
set -e

# Aplica migraciones pendientes de forma idempotente (prisma migrate deploy
# es no interactivo y seguro de re-correr). Reintenta en caso de que la BD
# aún no esté lista al arrancar el contenedor.
attempt=0
until node ./node_modules/prisma/build/index.js migrate deploy; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 5 ]; then
    echo "No se pudieron aplicar las migraciones tras $attempt intentos" >&2
    exit 1
  fi
  echo "Base de datos no disponible, reintento $attempt/5 en 5s..."
  sleep 5
done

exec node server.js