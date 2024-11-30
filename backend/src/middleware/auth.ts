import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';

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

interface DecodedToken extends jwt.JwtPayload {
    rol: string;
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

export const authenticateAdmin: RequestHandler = (req, res, next) => {
    console.log('=== Inicio authenticateAdmin ===');
    console.log('Headers completos:', req.headers);
    
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token extraído:', token);
    
    if (!token) {
        console.log('No se proporcionó token');
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'saul quique lilia') as DecodedToken;
        console.log('Token decodificado:', decoded);
        
        if (decoded.rol !== 'admin') {
            console.log('Usuario no es admin:', decoded.rol);
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        
        console.log('Autenticación exitosa');
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}; 