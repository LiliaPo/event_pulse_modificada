import pool from '../config/database.js';
import { TypedRequest, TypedResponse } from '../types/types.js';

export const getAllUsers = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const getUserProfile = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const userId = req.user?.id;
        const result = await pool.query(
            'SELECT id, email, nombre, username, telefono, whatsapp, instagram FROM usuarios WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

export const updateProfile = async (req: TypedRequest, res: TypedResponse ) => {
    try {
        const userId = req.user?.id;
        const { nombre, email, telefono, whatsapp, instagram } = req.body;

        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = $1, email = $2, telefono = $3, 
                 whatsapp = $4, instagram = $5
             WHERE id = $6 
             RETURNING id, email, nombre, username, telefono, whatsapp, instagram`,
            [nombre, email, telefono, whatsapp, instagram, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
}; 