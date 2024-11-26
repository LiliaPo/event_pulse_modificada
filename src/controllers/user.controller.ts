import { Request, Response } from 'express';
import { userModel } from '../models/user.model';
import { IUser } from '../types/user.types';

export class userController {
    static async register(req: Request, res: Response) {
        try {
            const userData: IUser = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await userModel.findByUsername(userData.username);

            if (existingUser) {
                return res.status(400).json({
                    error: 'El nombre de usuario ya está registrado'
                });
            }

            const newUser = await userModel.create(userData);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const { identifier } = req.params;
            const userFound = await userModel.findByIdentifier(identifier);

            if (!userFound) {
                return res.status(404).json({
                    error: 'Usuario no encontrado'
                });
            }

            // Excluir la contraseña de la respuesta
            const { password, ...userResponse } = userFound;
            res.json(userResponse);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
} 