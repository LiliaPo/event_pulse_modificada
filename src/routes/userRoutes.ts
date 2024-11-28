import { Router } from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/all', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, nombre, username } = req.body;
        
        const result = await pool.query(
            'UPDATE usuarios SET email = $1, nombre = $2, username = $3 WHERE id = $4 RETURNING *',
            [email, nombre, username, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

export default router; 