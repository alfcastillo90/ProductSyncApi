FROM node:22

WORKDIR /usr/src/app

# Copia el archivo de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "start:dev"]
