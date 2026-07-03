// Importamos Express para crear el router de libros
import express from "express";
// Importamos el modelo Book para interactuar con la colección de libros en MongoDB
import Book from '../models/book.models.js'

// Creamos un router de Express para agrupar las rutas relacionadas con libros
const router = express.Router();

// Ruta GET: obtiene todos los libros registrados en la base de datos
router.get('/', async (req, res) => {
    try {
        // Buscamos todos los documentos de la colección Book
        const books = await Book.find();
        console.log("GET ALL BOOKS", books);

        // Si no hay libros, devolvemos 204 No Content
        if (books.length === 0) {
            return res.status(204).json({ message: 'No hay libros registrados' });
        }

        // Devolvemos el array de libros en formato JSON
        res.json(books);
    } catch (error) {
        // Si ocurre un error en la consulta, devolvemos 500
        res.status(500).json({ message: error.message });
    }
})

// Middleware: valida el ID recibido en la URL y carga el libro en res.book
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    // Verificamos que el ID tenga formato de ObjectId de MongoDB (24 caracteres hexadecimales)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "ID no valido"
        })
    }

    try {
        // Buscamos el libro por su ID
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: "El libro no fue encontrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    // Guardamos el libro encontrado en la respuesta para usarlo en el siguiente middleware/controlador
    res.book = book;
    next();
}

// Ruta POST: crea un nuevo libro con los datos enviados en el cuerpo de la petición
router.post('/', async(req, res) => {
    const { title, author, genre, pub_date } = req?.body

    // Validamos que todos los campos obligatorios estén presentes
    if (!title || !author || !genre || !pub_date) {
        return res.status(400).json({
            message: "Alguno de los campos no fue enviado. Todos los campos son obligatorios"
        })
    }

    // Creamos una nueva instancia de Book con los datos recibidos
    const book = new Book({
        title,
        author,
        genre,
        pub_date
    })

    try {
        // Guardamos el libro en la base de datos
        const savedBook = await book.save();
        console.log(savedBook);
        // Devolvemos el libro creado con estado 201 Created
        res.status(201).json(savedBook);
    } catch (error) {
        // Si falla la validación del esquema u otro error, devolvemos 400
        res.status(400).json({ message: error.message });
    }
})

// Ruta GET: obtiene un libro por su ID, usando el middleware getBook para validar y cargarlo
router.get('/:id', getBook, async (req, res) => {
    // Devolvemos el libro ya cargado por el middleware
    res.json(res.book);
});

// Ruta PUT: actualiza un libro existente por ID, también protegida por getBook
router.put("/:id", getBook, async (req, res) => {
    try {
        // Obtenemos el libro previamente cargado por el middleware
        const book = res.book;
        // Extraemos los campos enviados en el body
        const { title, author, genre, pub_date } = req.body;
        // Actualizamos solo los campos enviados; si no vienen, mantenemos los valores actuales
        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.pub_date = pub_date || book.pub_date;

        // Guardamos los cambios en la base de datos
        const updatedBook = await book.save();
        // Devolvemos el libro actualizado con estado 202 Accepted
        res.status(202).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

// Ruta DELETE: elimina un libro por ID, usando el middleware getBook para validar su existencia
router.delete('/:id', getBook, async (req, res) => {
    try {
        const ereasedBook = res.book;
        // Eliminamos el libro de la base de datos usando su _id
        await res.book.deleteOne({_id : ereasedBook._id});
        // Confirmamos la eliminación con un mensaje descriptivo
        res.status(203).json({ message: `Libro ${ereasedBook.title} fue eliminado exitosamente` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Exportamos el router para ser usado en app.js bajo el prefijo /books
export { router };