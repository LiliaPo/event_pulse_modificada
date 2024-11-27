const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Endpoints de autenticación
app.post('/api/register', async (req, res) => {
    try {
        const { username, nombre, email, password } = req.body;
        console.log('Intento de registro:', { email, nombre, username });
        
        // Verificar si el usuario ya existe
        const userExists = await pool.query(
            'SELECT * FROM eventUsers WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email o username ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        const newUser = await pool.query(
            'INSERT INTO eventUsers (username, nombre, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, nombre, email',
            [username, nombre, email, hashedPassword]
        );

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Buscar usuario
        const user = await pool.query(
            'SELECT * FROM eventUsers WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Enviar datos del usuario (excepto la contraseña)
        const { password: _, ...userData } = user.rows[0];
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 