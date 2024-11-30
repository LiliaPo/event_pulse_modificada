import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { TypedRequest, TypedResponse, User } from '../types/types.js';

export const login = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const { username, email, password } = req.body;
        
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND username = $2',
            [email, username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            process.env.JWT_SECRET || 'tu_clave_secreta',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const register = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const { email, password, nombre, username } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (email, password, nombre, username) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre',
            [email, hashedPassword, nombre, username]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el registro' });
    }
};

export const adminLogin = async (req: TypedRequest, res: TypedResponse) => {
    const { email, password } = req.body;
    
    if (email === 'admin@admin.com' && password === 'admin123') {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'saul quique lilia',
            { expiresIn: '24h' }
        );
        res.json({ success: true, token });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
}; 