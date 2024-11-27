import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import crypto from 'crypto';

const router = express.Router();

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});

// Ruta de login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login usuario:', { email });

        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura',
            { expiresIn: '24h' }
        );

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
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de registro
router.post('/register', async (req, res) => {
    try {
        const { email, password, nombre, username } = req.body;
        console.log('Intento de registro:', { email, nombre, username });

        const userExists = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email o username ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();

        const result = await pool.query(`
            INSERT INTO usuarios (id, email, password, nombre, username, rol)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, nombre, username, rol
        `, [userId, email, hashedPassword, nombre, username, 'usuario']);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Ruta de login del administrador
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intento de login admin:', { email });

        if (email === 'admin@admin.com' && password === 'admin123') {
            const token = jwt.sign(
                { id: 'admin', email, role: 'admin' },
                process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura',
                { expiresIn: '24h' }
            );
            return res.json({
                message: 'Login exitoso',
                token,
                admin: { id: 'admin', email }
            });
        }

        res.status(401).json({ message: 'Credenciales inválidas' });
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router; 