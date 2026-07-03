// Importamos Express para crear el servidor web
import express from "express"

// Importamos Mongoose para conectarnos y trabajar con MongoDB
import mongoose from "mongoose"
// Importamos el router de libros desde la carpeta de rutas
import {router as bookRoutes} from "./routes/book.routes.js"

// Importamos body-parser para parsear el cuerpo de las peticiones HTTP (JSON)
import bodyParser, * as parser from 'body-parser'

// Importamos dotenv para cargar variables de entorno desde el archivo .env
import { config } from "dotenv"
config()

// Creamos la aplicación Express
const app = express();
// Middleware que permite a Express leer JSON en el cuerpo de las peticiones
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB usando la URL y el nombre de DB del .env
mongoose.connect(process.env.MONGO_URL, {dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection;

// Registramos las rutas de libros en el prefijo /books
app.use('/books', bookRoutes);

// Puerto desde el .env o 3000 por defecto
const port = process.env.PORT || 3000;

// Iniciamos el servidor HTTP y escuchamos en el puerto definido
app.listen(port, ()=>{
    console.log(`Servidor iniciado en ${port}\nEmpieza a interactuar`);
})