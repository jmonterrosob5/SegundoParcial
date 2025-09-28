
CREATE DATABASE restaurante_ordenes_db;

\c restaurante_ordenes_db;

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    telefono VARCHAR NOT NULL
);

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    platillo_nombre VARCHAR NOT NULL,
    notes TEXT,
    estado VARCHAR,
    creado_time TIMESTAMP DEFAULT NOW()
);
