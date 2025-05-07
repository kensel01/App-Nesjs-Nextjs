# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependencias y configurar
COPY package.json package-lock.json next.config.js tsconfig.json ./
RUN npm ci

# Copiar código fuente y construir
COPY public ./public
COPY src ./src
RUN npm run build

# Stage 2: runtime
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Instalar solo dependencias de producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --omit=dev

# Copiar build y estáticos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Ejecutar con usuario no root
USER node

# Puerto del panel
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start"] 