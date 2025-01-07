import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';

import { Chiste } from './chiste.js'; // Importar el modelo

const app = express();
dotenv.config();

const port = 3005;
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

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

// Endpoint raíz
app.get('/', (req, res) => {
    console.log('Mi primer endpoint');
    res.status(200).send('Mi primer chiste');
});