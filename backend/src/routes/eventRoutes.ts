import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getEventById } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Wrapper para manejar async/await
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Rutas con el wrapper
router.get('/', asyncHandler(getAllEvents));
router.get('/:id', asyncHandler(getEventById));
router.post('/', authenticateToken, asyncHandler(createEvent));
router.put('/:id', authenticateToken, asyncHandler(updateEvent));
router.delete('/:id', authenticateToken, asyncHandler(deleteEvent));

export default router; 