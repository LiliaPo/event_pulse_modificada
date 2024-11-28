import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;
        if (!users?.length) {
            return res.status(404).json({ error: 'No hay usuarios registrados' });
        }
        res.json(users);
    } catch {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const { password: _, ...userInfo } = user;
        res.json(userInfo);
    } catch {
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (!checkUser.rows[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { email, nombre, username } = req.body;
        const result = await pool.query(
            'UPDATE users SET email = $1, nombre = $2, username = $3 WHERE id = $4 RETURNING *',
            [email, nombre, username, id]
        );

        const { password: _, ...userInfo } = result.rows[0];
        res.json(userInfo);
    } catch {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (!checkUser.rows[0]) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}; 