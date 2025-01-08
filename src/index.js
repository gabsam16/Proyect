import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import axios from 'axios';

import { Chiste } from './chiste.js'; // Importar el modelo

const app = express();
dotenv.config();

const port = 3005;
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// Configuración de Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Chistes',
        version: '1.0.0',
        description: 'Una API para obtener y crear chistes',
    },
    servers: [
        {
            url: 'http://localhost:3005',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./index.js'], // Ruta a los archivos donde se encuentran los comentarios de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

// Servir la documentación Swagger en el endpoint '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const conncectDB = () => {
    const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_PORT,
        MONGO_DB,
        MONGO_HOSTNAME
    } = process.env;

    const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

    mongoose.connect(url).then(function() {
        console.log('Conexión a Mongo exitosa');
    })
    .catch(function(err) {
        console.log(err);
    });
};

app.listen(port, function() {
    conncectDB();
    console.log('API corriendo en: http://localhost:3005');
});

/**
 * @swagger
 * /chiste:
 *   get:
 *     summary: Obtiene un chiste
 *     description: Devuelve un chiste de tipo Chuck Norris, Dad o propio.
 *     parameters:
 *       - in: query
 *         name: tipo
 *         required: true
 *         description: Tipo de chiste (Chuck, Dad, Propio)
 *         schema:
 *           type: string
 *           enum: [Chuck, Dad, Propio]
 *     responses:
 *       200:
 *         description: Chiste obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chiste:
 *                   type: string
 *                   example: "Esto es un chiste de Chuck Norris."
 *       400:
 *         description: Error, parámetro no válido.
 *       404:
 *         description: No se encontraron chistes propios.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /chiste:
 *   post:
 *     summary: Crea un nuevo chiste
 *     description: Permite crear un chiste propio y almacenarlo en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *                 example: "Un chiste nuevo"
 *               autor:
 *                 type: string
 *                 example: "Autor del chiste"
 *               puntaje:
 *                 type: integer
 *                 example: 5
 *               categoria:
 *                 type: string
 *                 example: "General"
 *     responses:
 *       201:
 *         description: Chiste creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f5f1b2c001f1d3b42"
 *       400:
 *         description: Error al crear el chiste.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Endpoint raíz
 *     description: Endpoint de prueba para verificar si el servidor está activo.
 *     responses:
 *       200:
 *         description: Respuesta exitosa.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Mi primer chiste PAOLA, GABRIEL Y ZARA"
 */
app.get('/', (req, res) => {
    console.log('Mi primer endpoint');
    res.status(200).send('Mi primer chiste PAOLA, GABRIEL Y ZARA');
});

// Endpoint para obtener un chiste
app.get('/chiste', async (req, res) => {
    const tipo = req.query.tipo;
    let chiste;

    try {
        if (tipo === 'Chuck') {
            const response = await axios.get('https://api.chucknorris.io/jokes/random');
            chiste = response.data.value;
        } else if (tipo === 'Dad') {
            const response = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' } });
            chiste = response.data.joke;
        } else if (tipo === 'Propio') {
            const chistes = await Chiste.find();
            if (chistes.length === 0) {
                return res.status(404).send('Aun no hay chistes, cree uno!');
            }
            chiste = chistes[Math.floor(Math.random() * chistes.length)].texto;
        } else {
            return res.status(400).send('Error: parámetro no válido.');
        }

        res.status(200).json({ chiste });
    } catch (error) {
        res.status(500).send('Error al obtener el chiste.');
    }
});

// Endpoint para crear un nuevo chiste
app.post('/chiste', async (req, res) => {
    const { texto, autor, puntaje, categoria } = req.body;

    const newChiste = new Chiste({ texto, autor, puntaje, categoria });

    try {
        await newChiste.save();
        res.status(201).json({ id: newChiste._id });
    } catch (error) {
        res.status(400).send('Error al crear el chiste.');
    }
});

// Endpoint para actualizar un chiste
/**
 * @swagger
 * /chiste/{id}:
 *   put:
 *     summary: Actualiza un chiste existente
 *     description: Permite actualizar cualquier campo de un chiste existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del chiste a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *                 example: "Nuevo texto del chiste"
 *               autor:
 *                 type: string
 *                 example: "Nuevo autor"
 *               puntaje:
 *                 type: integer
 *                 example: 10
 *               categoria:
 *                 type: string
 *                 example: "Nuevo tipo"
 *     responses:
 *       200:
 *         description: Chiste actualizado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       404:
 *         description: Chiste no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.put('/chiste/:id', async (req, res) => {
    const { id } = req.params;
    const { texto, autor, puntaje, categoria } = req.body;

    try {
        const chiste = await Chiste.findById(id);
        if (!chiste) {
            return res.status(404).send('Chiste no encontrado');
        }

        // Actualizar solo los campos proporcionados
        if (texto) chiste.texto = texto;
        if (autor) chiste.autor = autor;
        if (puntaje) chiste.puntaje = puntaje;
        if (categoria) chiste.categoria = categoria;

        await chiste.save();
        res.status(200).json({ message: 'Chiste actualizado correctamente' });
    } catch (error) {
        res.status(500).send('Error al actualizar el chiste');
    }
});

// Endpoint para eliminar un chiste por su ID
/**
 * @swagger
 * /chiste/{id}:
 *   delete:
 *     summary: Elimina un chiste
 *     description: Elimina un chiste de la base de datos usando su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del chiste a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chiste eliminado exitosamente
 *       404:
 *         description: Chiste no encontrado
 *       500:
 *         description: Error interno del servidor
 */
app.delete('/chiste/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const chiste = await Chiste.findByIdAndDelete(id);
        if (!chiste) {
            return res.status(404).send('Chiste no encontrado');
        }

        res.status(200).json({ message: 'Chiste eliminado correctamente' });
    } catch (error) {
        res.status(500).send('Error al eliminar el chiste');
    }
});
