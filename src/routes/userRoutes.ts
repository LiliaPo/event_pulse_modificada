import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Rutas de autenticación
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router; 