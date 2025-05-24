#!/bin/bash

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando despliegue de la aplicación ===${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker no está instalado. Por favor, instálalo primero.${NC}"
    exit 1
fi

# Verificar si Apache está instalado
if ! command -v apache2 &> /dev/null; then
    echo -e "${YELLOW}Apache2 no está instalado. ¿Deseas instalarlo? (s/n)${NC}"
    read respuesta
    if [[ "$respuesta" =~ ^[Ss]$ ]]; then
        echo -e "${GREEN}Instalando Apache2...${NC}"
        sudo apt update
        sudo apt install -y apache2
    else
        echo -e "${RED}Apache2 es necesario para el despliegue. Abortando.${NC}"
        exit 1
    fi
fi

# Habilitar módulos de Apache necesarios
echo -e "${GREEN}Habilitando módulos de Apache...${NC}"
sudo a2enmod proxy proxy_http proxy_wstunnel headers ssl rewrite

# Configurar Apache
echo -e "${GREEN}Configurando Apache como reverse proxy...${NC}"
sudo cp frontend/apache-nextjs.conf /etc/apache2/sites-available/nextjs-app.conf

echo -e "${YELLOW}¿Cuál es tu nombre de dominio?${NC}"
read dominio
sudo sed -i "s/tu-dominio.com/$dominio/g" /etc/apache2/sites-available/nextjs-app.conf

echo -e "${YELLOW}¿Ruta al certificado SSL (.pem)?${NC}"
read ruta_cert
sudo sed -i "s|/path/to/cert.pem|$ruta_cert|g" /etc/apache2/sites-available/nextjs-app.conf

echo -e "${YELLOW}¿Ruta a la clave privada SSL (.pem)?${NC}"
read ruta_key
sudo sed -i "s|/path/to/key.pem|$ruta_key|g" /etc/apache2/sites-available/nextjs-app.conf

# Habilitar sitio
sudo a2ensite nextjs-app.conf
sudo a2dissite 000-default.conf

# Reiniciar Apache
echo -e "${GREEN}Reiniciando Apache...${NC}"
sudo systemctl restart apache2

# Variables de entorno para el frontend
echo -e "${YELLOW}¿URL de la API backend (ej: https://api.ejemplo.com)?${NC}"
read api_url

# Construir y desplegar frontend
echo -e "${GREEN}Construyendo Frontend...${NC}"
cd frontend
docker build -t frontend:latest --build-arg NEXT_PUBLIC_API_URL="$api_url" .

echo -e "${GREEN}Deteniendo contenedor frontend anterior si existe...${NC}"
docker stop frontend 2>/dev/null || true
docker rm frontend 2>/dev/null || true

echo -e "${GREEN}Iniciando nuevo contenedor frontend...${NC}"
docker run -d -p 3000:3000 --name frontend --restart unless-stopped frontend:latest
cd ..

# Construir y desplegar backend
echo -e "${GREEN}Construyendo y desplegando Backend...${NC}"
cd backend

echo -e "${YELLOW}¿Datos de conexión a PostgreSQL:${NC}"
echo -e "${YELLOW}Host PostgreSQL:${NC}"
read pg_host

echo -e "${YELLOW}Puerto PostgreSQL:${NC}"
read pg_port

echo -e "${YELLOW}Usuario PostgreSQL:${NC}"
read pg_user

echo -e "${YELLOW}Contraseña PostgreSQL:${NC}"
read -s pg_password
echo ""

echo -e "${YELLOW}Nombre de la base de datos:${NC}"
read pg_db

# Crear .env para el backend
cat > .env << EOF
NODE_ENV=production
PORT=8000
ALLOWED_ORIGINS=$dominio,https://$dominio
POSTGRES_HOST=$pg_host
POSTGRES_PORT=$pg_port
POSTGRES_USER=$pg_user
POSTGRES_PASSWORD=$pg_password
POSTGRES_DB=$pg_db
POSTGRES_SSL=false
JWT_SECRET=$(openssl rand -hex 32)
EOF

docker compose up -d
cd ..

echo -e "${GREEN}=== Despliegue completado exitosamente ===${NC}"
echo -e "${GREEN}Frontend disponible en: https://$dominio${NC}"
echo -e "${GREEN}Backend API disponible en: https://$dominio/api/v1${NC}"
echo -e "${GREEN}Documentación API en: https://$dominio/api/v1/docs${NC}" 