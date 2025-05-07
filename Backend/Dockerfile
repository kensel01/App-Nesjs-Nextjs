# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el código fuente y compilar
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Instalar dependencias de producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --omit=dev

# Copiar el build compilado
COPY --from=builder /app/dist ./dist

# Ejecutar con usuario no root
USER node

# Puerto del API
EXPOSE 8000

# Comando por defecto
CMD ["node", "dist/main.js"] 