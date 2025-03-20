FROM node:22-slim AS build

# Crear directorio de trabajo
WORKDIR /app

# Copiar y instalar dependencias
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build --prod

FROM nginx:alpine
# Copiar un archivo de configuración de Nginx personalizado si es necesario
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto en el que se sirve la aplicación
EXPOSE 80
COPY --from=build /app/dist /usr/share/nginx/html

# ejemplo para build y ejecutar
# docker build -t economicas/test/paginaeco:latest .
# docker run -p 80:80 --name economicas/paginaeco economicas/test/paginaeco:latest