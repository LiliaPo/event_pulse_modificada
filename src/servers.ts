import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pkg;

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const pool = new Pool({
    user: 'postgres',
    password: 'tu_contraseña',
    host: 'localhost',
    port: 5432,
    database: 'eventpulse'
});

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(rootDir));

// Rutas para las páginas HTML
app.get('/', (_req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/login', (_req, res) => {
    res.sendFile(path.join(rootDir, 'login.html'));
});

app.get('/admin', (_req, res) => {
    res.sendFile(path.join(rootDir, 'admin-dashboard.html'));
});

app.get('/administrador', (_req, res) => {
    res.sendFile(path.join(rootDir, 'administrador.html'));
});

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        
        if (user && password === user.password) {
            res.json({ success: true });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password, nombre, username } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (email, password, nombre, username) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, nombre, username]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro' });
    }
});

// Rutas de eventos
app.get('/api/eventos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM eventos');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

app.post('/api/eventos', async (req, res) => {
    const { nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO eventos (nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear evento' });
    }
});

app.put('/api/eventos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen } = req.body;
    try {
        const result = await pool.query(
            'UPDATE eventos SET nombre = $1, categoria = $2, subcategoria = $3, edad = $4, personas = $5, precio = $6, localizacion = $7, organizador = $8, fecha = $9, imagen = $10 WHERE id = $11 RETURNING *',
            [nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
});

app.delete('/api/eventos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM eventos WHERE id = $1', [req.params.id]);
        res.json({ message: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app; 