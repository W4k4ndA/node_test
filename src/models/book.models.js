// Importamos Mongoose para definir esquemas y modelos
import mongoose from "mongoose";

// Definimos el esquema de un libro: estructura y validaciones de los campos
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // El título es obligatorio
    },
    author: {
        type: String,
        required: true // El autor es obligatorio
    },
    genre: String, // Género opcional
    pub_date: Date // Fecha de publicación opcional
})

// Exportamos el modelo 'Book' basado en el esquema para usarlo en rutas y controladores
export default mongoose.model('Book', bookSchema)