import express, { RequestHandler } from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getEventById } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';
import { getEventMessages, createMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getAllEvents as RequestHandler);
router.get('/:id', getEventById as RequestHandler);
router.post('/', authenticateToken, createEvent as RequestHandler);
router.put('/:id', authenticateToken, updateEvent as RequestHandler);
router.delete('/:id', authenticateToken, deleteEvent as RequestHandler);
router.get('/:eventoId/messages', authenticateToken, getEventMessages);
router.post('/:eventoId/messages', authenticateToken, createMessage);

export default router; 