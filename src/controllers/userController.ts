import { Request, Response } from 'express';
import { UserModel, User } from '../models/userModel';

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const userData: Omit<User, 'id'> = req.body;
            const user = await UserModel.createUser(userData);
            res.status(201).json({ 
                success: true, 
                user,
                redirectUrl: '/EventPulse/index.html'
            });
        } catch (error) {
            res.status(500).json({ error: `Error al registrar usuario: ${error}` });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.validateLogin(email, password);
            
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            
            res.json({ 
                success: true, 
                user,
                redirectUrl: '/EventPulse/index.html'
            });
        } catch (error) {
            res.status(500).json({ error: `Error en el login: ${error}` });
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await UserModel.getUserById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: `Error al obtener perfil: ${error}` });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await UserModel.updateUserProfile(userId, userData);
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: `Error al actualizar perfil: ${error}` });
        }
    }
} 