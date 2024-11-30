import express, { RequestHandler } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers as RequestHandler);
router.get('/:id', authenticateToken, getUserById as RequestHandler);
router.put('/:id', authenticateToken, updateUser as RequestHandler);
router.delete('/:id', authenticateToken, deleteUser as RequestHandler);

export default router; 
