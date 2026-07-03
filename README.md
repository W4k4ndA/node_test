# Proyecto Node CRUD

API REST con Node.js, Express y MongoDB para gestionar libros.

## Tecnologías

- Node.js (ES Modules)
- Express 5
- Mongoose
- MongoDB (local o Docker)
- dotenv
- nodemon

## Estructura del proyecto

```
src/
├── app.js
├── models/
│   └── book.models.js
└── routes/
    └── book.routes.js
```

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto segun el formato indicado en .env.template:



## Ejecución local con MongoDB en Docker

```bash
docker-compose up -d
npm run dev
```

La API estará disponible en `http://localhost:4040`

## Endpoints

### Libros

| Method | Endpoint            | Descripción                  |
|--------|---------------------|------------------------------|
| GET    | `/books`            | Obtener todos los libros     |
| POST   | `/books`            | Crear un libro nuevo         |
| GET    | `/books/:id`        | Obtener libro por ID         |
| PUT    | `/books/:id`        | Actualizar libro por ID      |
| DELETE | `/books/:id`        | Eliminar libro por ID        |

### Body para POST

```json
{
    "title": "string",
    "author": "string",
    "genre": "string",
    "pub_date": "ISOString"
}
```

## Notas

- Si `MONGO_URL` incluye el usuario y contraseña, asegurarse de separarlos con `:` y no con `.`. Ejemplo: `mongodb://usuario:contraseña@localhost:27017`
- El campo `id` para las rutas con parámetro debe ser un ObjectId válido de 24 caracteres hexadecimales. (id de mongo)