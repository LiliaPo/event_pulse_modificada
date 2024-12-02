import express, { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, updateProfile } from '../controllers/userController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ruta para actualizar perfil de usuario normal (debe ir antes que las rutas con :id)
router.put('/profile', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
    updateProfile(req, res).catch(next);
});

// Rutas para administrador
router.get('/', authenticateAdmin, (req: Request, res: Response, next: NextFunction) => {
    getAllUsers(req, res).catch(next);
});

router.get('/:id', authenticateAdmin, (req: Request, res: Response, next: NextFunction) => {
    getUserById(req, res).catch(next);
});

router.put('/:id', authenticateAdmin, (req: Request, res: Response, next: NextFunction) => {
    updateUser(req, res).catch(next);
});

router.delete('/:id', authenticateAdmin, (req: Request, res: Response, next: NextFunction) => {
    deleteUser(req, res).catch(next);
});

export default router; 
