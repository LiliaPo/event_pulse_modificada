import { Request, Response } from 'express';
import { Evento } from '../models/eventoModel';

export const getAllEventos = async (_req: Request, res: Response) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
};

export const getEventoById = async (req: Request, res: Response) => {
    try {
        const evento = await Evento.findById(req.params.id);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener evento' });
    }
};

export const createEvento = async (req: Request, res: Response) => {
    try {
        const evento = await Evento.create(req.body);
        res.status(201).json(evento);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear evento' });
    }
};

export const updateEvento = async (req: Request, res: Response) => {
    try {
        const evento = await Evento.update(req.params.id, req.body);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(evento);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
};

export const deleteEvento = async (req: Request, res: Response) => {
    try {
        await Evento.delete(req.params.id);
        res.json({ message: 'Evento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
}; 