import express, { Router, Request, Response, RequestHandler } from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router: Router = express.Router();

const handler = (fn: any): RequestHandler => 
    async (req: Request, res: Response, next) => {
        try {
            await fn(req, res);
        } catch (error) {
            next(error);
        }
    };

router.get('/', handler(getAllEvents));
router.post('/', authenticateToken, handler(createEvent));
router.put('/:id', authenticateToken, handler(updateEvent));
router.delete('/:id', authenticateToken, handler(deleteEvent));

export default router; 