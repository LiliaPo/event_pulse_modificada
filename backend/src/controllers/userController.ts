import { Request, Response } from 'express';
import pool from '../config/database.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT id, email, nombre, username, rol, telefono, whatsapp, instagram, created_at 
            FROM usuarios 
            WHERE rol != 'admin' 
            ORDER BY created_at DESC
        `);
        
        console.log('Usuarios encontrados:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await pool.query(
            'SELECT id, email, nombre, imagen_perfil FROM usuarios WHERE id = $1',
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

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { nombre, email, imagen } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        console.log('Datos recibidos:', { userId, nombre, email });

        // Primero verificar si el usuario existe
        const userExists = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [userId]
        );

        if (userExists.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Realizar la actualización
        const query = `
            UPDATE usuarios 
            SET nombre = $1, 
                email = $2, 
                imagen_perfil = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING id, email, nombre, imagen_perfil
        `;

        const result = await pool.query(query, [nombre, email, imagen, userId]);

        if (result.rows.length === 0) {
            return res.status(500).json({ message: 'Error al actualizar el perfil' });
        }

        console.log('Perfil actualizado:', result.rows[0]);
        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return res.status(500).json({ 
            message: 'Error al actualizar perfil',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
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