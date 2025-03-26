# Medidor de eficiencia

Este directorio está creado con la finalidad de centralizar y documentar cada cambio que se realice en el proyecto, tanto en el **backend** como en el **frontend**

## Instalacion

### FrontEnd

#### Pre-requisitos

    Para comenzar con el proceso de instalación, deberá tener instalado _Node JS_ y tener instalado el motor de Vite de manera global, en caso de no tener Vite, puedes instalarlo con el comando ```npm install -g vite@latest```

#### Instalar dependencias y correr proyecto
    El frontend está desarrollado sobre React, empaquetado con Vite, para comenzar la instalación, solo es abrir la carpeta del proyecto en la consola del sistema, ya sea desde _CMD_ o _Visual Studio Code_ y ejecutar el comando ```npm install```, luego de cumplir con la instalación de todas las dependencias del proyecto, puedes correr el motor de desarrollo con el comando ```npm run dev```

### BackEnd

#### Pre-requisitos

    Para comenzar con el proceso de instalación, deberá tener instalado un entorno de Apache y MySQL, recomiendo **Wamp Server**, pero hay otras alternartivas como **Xampp** o instalar de forma independiente cada entorno de desarrollo.

#### Instalación 

    Una vez tengas el entorno de desarrollo instalado, suponiendo que instalaste **Wamp Server**, vas a copiar los archivos de la carpeta "_backend_" y los vas a pegar en el directorio de instalación del entorno, por defecto, la direccion de wamp es: ```C://Wamp64/www```,
    una vez instalado el backend, vas a crear una base de datos, ya sea desde ```http://localhost/phpmyadmin``` o directamente desde la consola de MySQL

##### Desde navegador

    Hacerlo en navegador es muy cencillo, solo tienes que crear una nueva base de datos e importar el archivo SQL que se encuentra en la carpeta _backend_ 

##### Desde consola

    Para realizarlo desde la consola, primero deberás ejecutar el comando ```CREATE DATABASE {Nombre de la base de datos}```, luego de haber creado la base de datos, vamos a entrar con el comando ```USE DATABASE {Nombre de la base de datos}```, posteriormente a eso, abriremos el archivo .SQL que encuentras dentro de la carpeta _backend_ y copiarás todos los datos y los pegarás en la consola de *MySQL* y ya tendrías la base de datos lista

## Configuracion

### FrontEnd

    La configuración del frontend se hace desde el archivo .ENV, deberás modificar la variable _VITE_API_URL_ con el link al backend, por defecto es ```http://localhost:80```, luego de conectar el _backend_ con el _frontend_, podrás continuar con la configuración

### BackEnd 

    Para configurar el Backend, debes dirigirte al archivo ```baseDeDatos.php``` y actualizar el servidor de la base de datos, y las credenciales de acceso, por defecto el servidor es _localhost_ y las credenciales son las del usuario _root_, en la base de datos, deberás colocar el nombre que le pusiste en el proceso de instalación de la base de datos

# FIN

    Felicidades, haz aprendido a instalar y configurar este proyecto hecho sobre _React_ y _PHP_