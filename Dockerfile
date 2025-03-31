FROM node:22.14.0-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la aplicación
COPY package.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el código fuente
COPY . .

# Exponer el puerto en el que corre Apollo Server
EXPOSE 4000

# Comando de inicio
CMD ["npm", "run", "start"]
