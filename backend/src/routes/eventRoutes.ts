import express from 'express';
import type { RequestHandler } from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getEventById } from '../controllers/eventController.js';

const router = express.Router();

// Quita authenticateToken temporalmente para pruebas
router.get('/', getAllEvents as RequestHandler);
router.get('/:id', getEventById as RequestHandler);
router.post('/', createEvent as RequestHandler);
router.put('/:id', updateEvent as RequestHandler);
router.delete('/:id', deleteEvent as RequestHandler);

export default router; 