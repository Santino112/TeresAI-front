# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Runtime stage - Caddy para servir la app
FROM caddy:2-alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copiar build output
COPY --from=build /app/dist /srv

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Exponer puerto
EXPOSE 8080

# Comando para iniciar Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
