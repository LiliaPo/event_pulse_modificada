import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Rutas de autenticación
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rutas de perfil
router.get('/profile/:id', UserController.getProfile);
router.put('/profile/:id', UserController.updateProfile);

export default router; 