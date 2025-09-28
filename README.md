
# Restaurante Órdenes

Aplicación web para gestionar órdenes de clientes en un restaurante.

## Tecnologías
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Frontend: HTML, CSS, JavaScript

## Instrucciones

1. Crear base de datos en PostgreSQL usando `database/schema.sql`.
2. Configurar variables de entorno en Render:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
3. Desplegar backend en Render.
4. Subir carpeta `frontend` como contenido estático o servir desde Express.
5. Acceder a la aplicación vía el enlace público de Render.

## Endpoints

- `POST /clientes/registrar`
- `POST /clientes/login`
- `POST /ordenes`
- `GET /ordenes/listar?cliente_id=ID`
- `PUT /ordenes/:id/estado`
