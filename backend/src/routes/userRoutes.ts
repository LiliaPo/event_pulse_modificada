import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserProfile, updateProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };

router.get('/all', authenticateToken, asyncHandler(getAllUsers));
router.get('/profile', authenticateToken, asyncHandler(getUserProfile));
router.put('/profile', authenticateToken, asyncHandler(updateProfile));

export default router; 
