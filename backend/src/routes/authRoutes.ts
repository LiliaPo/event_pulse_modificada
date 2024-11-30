import express, { Router, RequestHandler } from 'express';
import { login, register, adminLogin } from '../controllers/authController.js';

const router: Router = express.Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);
router.post('/admin/login', adminLogin as RequestHandler);

export default router; 