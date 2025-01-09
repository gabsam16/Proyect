# Proyecto 

API DE CHISTES PARA TÓPICOS ESPECIALES DE PROGRAMACIÓN

# Realizado por Paola Ascanio (paoascanio), Gabriel Da Luz(gabsam16) y Zarah Roa(zarah77)



# Instrucciones para Arrancar y Ejecutar el Proyecto

1. Abrimos nuestro editor de codigo preferido
2. Asegurate de tener instalado Express y cors npm install express, npm install cors
3. Ejecutar primero el package.json usando el codigo: npm install (desde la terminal)
4. Asegurate de Tener instalado MongoDB en el computador  npm install mongoose
5. Ademas de tener descargado igualmente e inicializada la aplicacion de docker Docker desktop 
6. Configurar las variables de entorno en nuestra API: .env 

MONGO_USERNAME=admin
MONGO_PASSWORD=admin_password
MONGO_PORT=27017
MONGO_DB=topicos
MONGO_HOSTNAME=mongo

7. Ejecutar en nuestra terminal: docker-compose -f docker-compose.local.yml up --build

8. Colocamos en el navegador la siguiente ruta:
localhost:3005/


9.Tener descargada la extensión de POSTMAN en VSCode.

#PARA PROBAR EL PRIMER REQUERIMIENTO EN POSTMAN

POST http://localhost:3005/chiste
{
"texto": "¿Qué le dijo un semáforo a otro? No me mires, me estoy cambiando.",
"autor": "Google",
"puntaje": "5",
"categoria": "Chistoso"
}

# PARA PROBAR EL SEGUNDO REQUERIMIENTO EN POSTMAN

GET http://localhost:3005/chiste?tipo=Dad
http://localhost:3005/chiste?tipo=Chuck
http://localhost:3005/chiste?tipo=Propio

# PARA PROBAR EL TERCER REQUERIMIENTO EN POSTMAN

PUT http://localhost:3005/chiste/677f43fed388170cccd97a07

# PARA PROBAR EL CUARTO REQUERIMIENTO EN POSTMAN

DELETE http://localhost:3005/chiste/677f43fed388170cccd97a07


# PARA PROBAR EL QUINTO REQUERIMIENTO EN POSTMAN
GET http://localhost:3005/chiste/(pones aca el id)


# PARA PROBAR EL SEXTO REQUERIMIENTO EN POSTMAN
GET http://localhost:3005/chiste/categoria/Chistoso


# PARA PROBAR EL SEPTIMO REQUERIMIENTO EN POSTMAN
GET http://localhost:3005/chiste/puntaje/10
