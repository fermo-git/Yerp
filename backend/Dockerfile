# ---- Dependencias (incluye Prisma CLI para generar el cliente) ----
# node:20-bullseye-slim (Debian 11): trae libssl1.1, que es el binario que
# usa Prisma 5.22. En bookworm/alpine Prisma no detecta libssl y el schema
# engine falla con "Error load".
FROM node:20-bullseye-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate

# ---- Imagen de producción ----
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Cliente Prisma generado + CLI (para `prisma migrate deploy` en el entrypoint)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma

COPY prisma ./prisma
COPY server.js ./
COPY lib ./lib
COPY routes ./routes
COPY services ./services
COPY scripts ./scripts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]