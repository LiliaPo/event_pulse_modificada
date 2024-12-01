import { Request, Response } from 'express';
import { Event } from '../models/Event.js';
import pool from '../config/database.js';

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData = {
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            fecha: req.body.fecha,
            localizacion: req.body.localizacion,
            organizador: req.body.organizador,
            precio: parseFloat(req.body.precio) || 0,
            url: req.body.url,
            imagen: req.body.imagen,
            subcategoria: req.body.subcategoria,
            direccion: req.body.direccion,
            descripcion: req.body.descripcion,
            lat: undefined,
            lng: undefined
        };

        console.log('Datos recibidos:', eventData); // Para debug

        const newEvent = await Event.create(eventData);
        res.status(201).json(newEvent);
    } catch (error: any) {
        console.error('Error detallado:', error);
        res.status(500).json({ message: 'Error al crear el evento', error: error.message });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM eventos ORDER BY fecha DESC');
        console.log('Eventos obtenidos:', result.rows); // Para debug
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const eventData = {
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            fecha: req.body.fecha,
            localizacion: req.body.localizacion,
            direccion: req.body.direccion,
            organizador: req.body.organizador,
            precio: parseFloat(req.body.precio) || 0,
            url: req.body.url
        };

        const updated = await Event.update(id, eventData);
        if (!updated) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(updated);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error al actualizar el evento' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Event.delete(id);
        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        
        res.json(event);
    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error al obtener el evento' });
    }
}; 