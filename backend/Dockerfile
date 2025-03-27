# Usar una imagen base de PHP con Apache
FROM php:8.2-apache

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos del backend al contenedor
COPY . .

# Instalar extensiones adicionales
RUN docker-php-ext-install mysqli

# Habilitar mod_rewrite para Apache (opcional)
RUN a2enmod rewrite

# Ajustar permisos
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Exponer el puerto 80
EXPOSE 80