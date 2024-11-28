import { Router } from 'express';
import { Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM eventos ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen } = req.body;
        
        const result = await pool.query(
            'INSERT INTO eventos (nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear evento' });
    }
});

export default router; 