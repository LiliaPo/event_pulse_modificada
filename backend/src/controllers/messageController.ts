import { Request, Response } from 'express';
import pool from '../config/database.js';

export const getEventMessages = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;
        const result = await pool.query(
            `SELECT m.*, u.nombre as nombreUsuario 
             FROM mensajes_foro m 
             JOIN usuarios u ON m.usuario_id = u.id 
             WHERE m.evento_id = $1 
             ORDER BY m.fecha ASC`,
            [eventoId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: 'Error al obtener mensajes' });
    }
};

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { eventoId } = req.params;
        const { contenido } = req.body;
        const userId = req.user?.id;

        const result = await pool.query(
            `INSERT INTO mensajes_foro (evento_id, usuario_id, contenido) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [eventoId, userId, contenido]
        );

        // Obtener el nombre del usuario para la respuesta
        const userResult = await pool.query(
            'SELECT nombre FROM usuarios WHERE id = $1',
            [userId]
        );

        const mensaje = {
            ...result.rows[0],
            nombreUsuario: userResult.rows[0].nombre
        };

        res.status(201).json(mensaje);
    } catch (error) {
        console.error('Error al crear mensaje:', error);
        res.status(500).json({ message: 'Error al crear mensaje' });
    }
}; 