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
} 