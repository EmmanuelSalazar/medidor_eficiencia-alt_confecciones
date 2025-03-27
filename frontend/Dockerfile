# Fase 1: Construcción del frontend
FROM node:20 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
COPY .env .env 
RUN npm run build

# Fase 2: Servir el frontend con Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80