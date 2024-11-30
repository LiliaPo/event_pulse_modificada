import pool from '../config/database.js';
import { TypedRequest, TypedResponse } from '../types/types.js';

export const getAllEvents = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const result = await pool.query('SELECT * FROM eventos ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const createEvent = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const { 
            nombre, categoria, subcategoria, edad, 
            personas, precio, localizacion, organizador, 
            fecha, imagen 
        } = req.body;

        const result = await pool.query(
            `INSERT INTO eventos (
                nombre, categoria, subcategoria, edad, 
                personas, precio, localizacion, organizador, 
                fecha, imagen
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`,
            [nombre, categoria, subcategoria, edad, personas, 
             precio, localizacion, organizador, fecha, imagen]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error al crear evento' });
    }
};

export const updateEvent = async (req: TypedRequest, res: TypedResponse) => {
    try {
        const { id } = req.params;
        const { 
            nombre, categoria, subcategoria, edad, 
            personas, precio, localizacion, organizador, 
            fecha, imagen 
        } = req.body;

        const result = await pool.query(
            `UPDATE eventos 
             SET nombre = $1, categoria = $2, subcategoria = $3, 
                 edad = $4, personas = $5, precio = $6, 
                 localizacion = $7, organizador = $8, 
                 fecha = $9, imagen = $10
             WHERE id = $11 
             RETURNING *`,
            [nombre, categoria, subcategoria, edad, personas, 
             precio, localizacion, organizador, fecha, imagen, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
};

export const deleteEvent = async (req: { params: { id: any; }; }, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM eventos WHERE id = $1', [id]);
        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
}; 