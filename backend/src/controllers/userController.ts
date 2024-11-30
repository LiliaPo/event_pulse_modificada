import { Request, Response } from 'express';
import pool from '../config/database.js';
import { TypedRequest, TypedResponse } from '../types/types.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        console.log('Obteniendo usuarios...');
        const result = await pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
        console.log('Usuarios encontrados:', result.rows);
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

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, email, nombre, username, telefono, whatsapp, instagram, rol FROM usuarios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, email, username, telefono, whatsapp, instagram, rol } = req.body;

        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = $1, email = $2, username = $3, 
                 telefono = $4, whatsapp = $5, instagram = $6, 
                 rol = $7, updated_at = CURRENT_TIMESTAMP
             WHERE id = $8 
             RETURNING id, email, nombre, username, telefono, whatsapp, instagram, rol`,
            [nombre, email, username, telefono, whatsapp, instagram, rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
}; 