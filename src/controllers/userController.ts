import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
    try {
        // Aquí irá la lógica para obtener usuarios
        res.json({ message: 'Lista de usuarios' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        // Aquí irá la lógica para crear usuarios
        const { name, email } = req.body;
        res.status(201).json({ message: 'Usuario creado', user: { name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario' });
    }
}; 