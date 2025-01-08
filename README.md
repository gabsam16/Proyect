#Proyecto API#

Realizado por Paola Ascanio, Gabriel Da Luz y Zarah

Comandos para ejecutar el proyecto

Ejecutar primero el package.json usando el codigo: npm install (desde la terminal)

Tener instalado MongoDB en el computador

Ademas de tener descargado igualmente e inicializada la aplicacion de docker. Docker desktop

configurar las variables de entorno en nuestra API:

MONGO_USERNAME=admin MONGO_PASSWORD=admin_password MONGO_PORT=27017 MONGO_DB=topicos MONGO_HOSTNAME=mongo

Ejecutar en nuestra terminal: docker-compose -f docker-compose.local.yml up --build
