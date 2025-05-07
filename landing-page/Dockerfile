# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependencias y configurar
COPY package.json package-lock.json vite.config.ts ./
RUN npm ci

# Copiar código fuente y construir
COPY public ./public
COPY src ./src
RUN npm run build

# Stage 2: serve static con Apache HTTPD
FROM httpd:2.4-alpine

# Copiar archivos estáticos al directorio por defecto de Apache
COPY --from=builder /app/dist /usr/local/apache2/htdocs/

# Exponer puertos HTTP y HTTPS
EXPOSE 80 443

# Iniciar Apache en primer plano
CMD ["httpd-foreground"] 