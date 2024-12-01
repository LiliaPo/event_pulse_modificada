import { Request, Response } from 'express';
import pool from '../config/database.js';

export const createEvent = async (req: Request, res: Response) => {
    try {
        console.log('Inicio de createEvent');
        const {
            nombre,
            categoria,
            fecha,
            localizacion,
            direccion,
            descripcion,
            telefono_contacto,
            organizador,
            precio
        } = req.body;

        console.log('Datos recibidos:', req.body);

        // Validar campos requeridos
        if (!nombre || !categoria || !fecha || !localizacion) {
            return res.status(400).json({ 
                message: 'Faltan campos requeridos',
                required: ['nombre', 'categoria', 'fecha', 'localizacion']
            });
        }

        // Crear la consulta SQL
        const query = `
            INSERT INTO eventos (
                nombre, 
                categoria, 
                fecha, 
                localizacion, 
                direccion,
                descripcion,
                telefono_contacto,
                organizador, 
                precio,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ) RETURNING *;
        `;

        // Preparar los valores
        const values = [
            nombre,
            categoria,
            new Date(fecha),
            localizacion,
            direccion || null,
            descripcion || null,
            telefono_contacto || null,
            organizador || null,
            precio || 0
        ];

        console.log('Query:', query);
        console.log('Values:', values);

        // Ejecutar la consulta
        const result = await pool.query(query, values);

        if (!result.rows[0]) {
            throw new Error('No se pudo crear el evento');
        }

        console.log('Evento creado:', result.rows[0]);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error completo:', error);
        return res.status(500).json({ 
            message: 'Error al crear el evento',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        console.log('Recibida petición GET /api/events');
        const result = await pool.query(`
            SELECT * FROM eventos 
            ORDER BY fecha DESC
        `);
        
        console.log('Eventos obtenidos de la BD:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Actualizando evento con ID:', id);
        console.log('Datos recibidos:', req.body);

        const {
            nombre,
            categoria,
            fecha,
            localizacion,
            direccion,
            descripcion,
            telefono_contacto,
            organizador,
            precio
        } = req.body;

        // Validar campos requeridos
        if (!nombre || !categoria || !fecha || !localizacion) {
            return res.status(400).json({ 
                message: 'Faltan campos requeridos',
                required: ['nombre', 'categoria', 'fecha', 'localizacion']
            });
        }

        // Verificar si el evento existe
        const checkEvent = await pool.query(
            'SELECT * FROM eventos WHERE id = $1',
            [id]
        );

        if (checkEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        const result = await pool.query(
            `UPDATE eventos 
             SET nombre = $1,
                 categoria = $2,
                 fecha = $3,
                 localizacion = $4,
                 direccion = $5,
                 descripcion = $6,
                 telefono_contacto = $7,
                 organizador = $8,
                 precio = $9,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $10 
             RETURNING *`,
            [
                nombre,
                categoria,
                new Date(fecha),
                localizacion,
                direccion || null,
                descripcion || null,
                telefono_contacto || null,
                organizador || null,
                parseFloat(precio) || 0,
                id
            ]
        );

        console.log('Evento actualizado:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ 
            message: 'Error al actualizar el evento',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM eventos WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM eventos WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error al obtener el evento' });
    }
};

export const testEndpoint = async (req: Request, res: Response) => {
    res.json({ message: 'El endpoint funciona' });
}; 