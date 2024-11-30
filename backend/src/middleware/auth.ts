import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role?: string;
            }
        }
    }
}

export const authenticateToken = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'saul quique lilia');
        req.user = decoded as { id: string; email: string; role?: string };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
}; 