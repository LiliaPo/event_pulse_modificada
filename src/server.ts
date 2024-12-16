import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import open from 'open';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './config/database.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);


app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@admin.com' && password === 'admin123') {
        const token = jwt.sign(
            { id: 'admin', email },
            'tu_clave_secreta_muy_segura',
            { expiresIn: '24h' }
        );

        return res.json({
            message: 'Login exitoso',
            token,
            admin: { id: 'admin', email }
        });
    }

    return res.status(401).json({ message: 'Credenciales inválidas' });
});


app.get('/api/eventos/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM eventos ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

app.post('/api/eventos', async (req, res) => {
    try {
        const { 
            nombre, 
            categoria, 
            subcategoria,
            fecha, 
            localizacion, 
            direccion,
            organizador,
            precio,
            descripcion,
            url
        } = req.body;

        const result = await pool.query(`
            INSERT INTO eventos (
                id,
                nombre,
                categoria,
                subcategoria,
                fecha,
                localizacion,
                direccion,
                organizador,
                precio,
                descripcion,
                url,
                created_at,
                updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `, [
            crypto.randomUUID(),
            nombre,
            categoria,
            subcategoria || null,
            new Date(fecha),
            localizacion,
            direccion || null,
            organizador,
            precio ? parseFloat(precio) : null,
            descripcion || null,
            url || null
        ]);

        res.status(201).json({
            message: 'Evento creado exitosamente',
            evento: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error al crear evento' });
    }
});


app.use(express.static(path.join(__dirname, '../')));

// Rutas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../registro.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../administrador.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin-dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 