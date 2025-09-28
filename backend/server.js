
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

// Ruta para registrar cliente
app.post('/clientes/registrar', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, telefono]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

// Ruta para login de cliente
app.post('/clientes/login', async (req, res) => {
  const { email, telefono } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE email = $1 AND telefono = $2',
      [email, telefono]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

// Ruta para crear orden
app.post('/ordenes/crear', async (req, res) => {
  const { cliente_id, platillo_nombre, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ordenes (cliente_id, platillo_nombre, notes, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [cliente_id, platillo_nombre, notes, 'pendiente']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

// Ruta para obtener órdenes de un cliente
app.get('/ordenes/:cliente_id', async (req, res) => {
  const cliente_id = req.params.cliente_id;
  try {
    const result = await pool.query(
      'SELECT * FROM ordenes WHERE cliente_id = $1 ORDER BY creado_time DESC',
      [cliente_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
