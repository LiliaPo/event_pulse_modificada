import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';

const router = express.Router();

// Registro
router.post('/register', async function(req, res) {
    try {
        const { email, password, nombre, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query(
            'INSERT INTO usuarios (email, password, nombre, username) VALUES ($1, $2, $3, $4)',
            [email, hashedPassword, nombre, username]
        );

        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro' });
    }
});

// Login
router.post('/login', function(req, res) {
    const { email, password } = req.body;
    
    pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const user = result.rows[0];
            bcrypt.compare(password, user.password)
                .then(validPassword => {
                    if (!validPassword) {
                        return res.status(401).json({ message: 'Credenciales inválidas' });
                    }
                    res.json({ success: true });
                });
        })
        .catch(error => {
            res.status(500).json({ message: 'Error en el login' });
        });
});

export default router; 