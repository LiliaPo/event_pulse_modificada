import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAdmin, getAllUsers as express.RequestHandler);
router.get('/:id', authenticateAdmin, getUserById as express.RequestHandler);
router.put('/:id', authenticateAdmin, updateUser as express.RequestHandler);
router.delete('/:id', authenticateAdmin, deleteUser as express.RequestHandler);

export default router; 
