import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import crypto from 'crypto';
const { Pool } = pkg;
const router = express.Router();
// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'eventpulse',
    password: process.env.DB_PASSWORD || 'Ferranito14',
    port: parseInt(process.env.DB_PORT || '5432')
});
// Login de usuarios
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login:', { email });
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, 'tu_clave_secreta_muy_segura', { expiresIn: '24h' });
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                username: user.username,
                rol: user.rol
            }
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
// Registro de usuarios - RUTA CORREGIDA
router.post('/register', async (req, res) => {
    try {
        const { email, password, nombre, username } = req.body;
        console.log('Datos de registro recibidos:', { email, nombre, username });
        // Verificar si el usuario ya existe
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR username = $2', [email, username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email o username ya está registrado' });
        }
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();
        // Insertar nuevo usuario
        const result = await pool.query(`
            INSERT INTO usuarios (id, email, password, nombre, username, rol)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, nombre, username, rol
        `, [
            userId,
            email,
            hashedPassword,
            nombre,
            username,
            'usuario'
        ]);
        console.log('Usuario registrado:', result.rows[0]);
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});
// Obtener todos los usuarios
router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});
export default router;
