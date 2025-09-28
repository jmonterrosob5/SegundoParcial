
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Registrar cliente
app.post('/clientes/registrar', async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const result = await pool.query('INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *', [nombre, email, telefono]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login cliente
app.post('/clientes/login', async (req, res) => {
  const { email, telefono } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1 AND telefono = $2', [email, telefono]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Crear orden
app.post('/ordenes', async (req, res) => {
  const { cliente_id, platillo_nombre, notes, estado } = req.body;
  try {
    const result = await pool.query('INSERT INTO ordenes (cliente_id, platillo_nombre, notes, estado) VALUES ($1, $2, $3, $4) RETURNING *', [cliente_id, platillo_nombre, notes, estado]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar ordenes
app.get('/ordenes/listar', async (req, res) => {
  const { cliente_id } = req.query;
  try {
    const result = await pool.query('SELECT * FROM ordenes WHERE cliente_id = $1', [cliente_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar estado
app.put('/ordenes/:id/estado', async (req, res) => {
  const { id } = req.params;
  try {
    const orden = await pool.query('SELECT estado FROM ordenes WHERE id = $1', [id]);
    if (orden.rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada' });

    let nuevoEstado = 'pending';
    if (orden.rows[0].estado === 'pending') nuevoEstado = 'preparing';
    else if (orden.rows[0].estado === 'preparing') nuevoEstado = 'delivered';

    const result = await pool.query('UPDATE ordenes SET estado = $1 WHERE id = $2 RETURNING *', [nuevoEstado, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
