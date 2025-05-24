# Instrucciones de Despliegue

Este documento contiene todas las instrucciones para desplegar correctamente la aplicación en un servidor Ubuntu con Apache.

## Requisitos Previos

- Ubuntu Server 20.04 o superior
- Docker y Docker Compose instalados
- Apache2
- Certificado SSL para tu dominio

## Modificaciones Realizadas

Se han realizado las siguientes mejoras en el código:

1. **Frontend**:
   - Eliminada la directiva `use client` innecesaria del layout principal
   - Actualizada la configuración de CSP en el middleware
   - Optimizado el Dockerfile
   - Mejorada la configuración de Next.js
   - Añadido un Error Boundary

2. **Backend**:
   - Configuración CORS más segura y específica
   - Desactivado `synchronize: true` en producción
   - Mejorada la gestión de conexiones a la base de datos

## Instrucciones de Despliegue Manual

Si prefieres no usar el script automatizado, sigue estos pasos:

### 1. Configuración de Apache

```bash
# Instalar Apache si no está instalado
sudo apt update
sudo apt install apache2

# Habilitar módulos necesarios
sudo a2enmod proxy proxy_http proxy_wstunnel headers ssl rewrite

# Copiar el archivo de configuración 
sudo cp frontend/apache-nextjs.conf /etc/apache2/sites-available/nextjs-app.conf

# Editar el archivo para configurar tu dominio y rutas SSL
sudo nano /etc/apache2/sites-available/nextjs-app.conf

# Habilitar el sitio
sudo a2ensite nextjs-app.conf
sudo a2dissite 000-default.conf

# Reiniciar Apache
sudo systemctl restart apache2
```

### 2. Despliegue del Frontend

```bash
cd frontend

# Construir la imagen Docker
docker build -t frontend:latest --build-arg NEXT_PUBLIC_API_URL="https://api.tu-dominio.com" .

# Ejecutar el contenedor
docker run -d -p 3000:3000 --name frontend --restart unless-stopped frontend:latest
```

### 3. Despliegue del Backend

```bash
cd backend

# Crear archivo .env con las variables de entorno
cat > .env << EOF
NODE_ENV=production
PORT=8000
ALLOWED_ORIGINS=tu-dominio.com,https://tu-dominio.com
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=usuario_db
POSTGRES_PASSWORD=contraseña_segura
POSTGRES_DB=nombre_db
POSTGRES_SSL=false
JWT_SECRET=un_secreto_muy_seguro
EOF

# Iniciar los contenedores
docker-compose up -d
```

## Uso del Script Automático

Para usar el script de despliegue automatizado:

1. Asegúrate de que el script tiene permisos de ejecución:
   ```bash
   chmod +x deploy.sh
   ```

2. Ejecuta el script:
   ```bash
   ./deploy.sh
   ```

3. Sigue las instrucciones interactivas que te pedirán:
   - Tu nombre de dominio
   - Rutas a los certificados SSL
   - URL de la API
   - Credenciales de PostgreSQL

## Resolución de Problemas

Si los estilos CSS no se cargan correctamente:

1. Verifica que Apache esté configurado correctamente como proxy
2. Revisa la consola del navegador para ver si hay errores relacionados con CSP
3. Asegúrate de que la configuración CSP en `middleware.ts` sea compatible con tus recursos

Si tienes problemas con la conexión al backend:

1. Verifica que el puerto 8000 esté expuesto y accesible
2. Comprueba los logs del contenedor: `docker logs backend-api`
3. Asegúrate de que la configuración CORS incluya tu dominio en `ALLOWED_ORIGINS`

## Mantenimiento

- Para actualizar el frontend:
  ```bash
  cd frontend
  git pull
  docker build -t frontend:latest .
  docker stop frontend
  docker rm frontend
  docker run -d -p 3000:3000 --name frontend frontend:latest
  ```

- Para actualizar el backend:
  ```bash
  cd backend
  git pull
  docker-compose down
  docker-compose build
  docker-compose up -d
  ``` 