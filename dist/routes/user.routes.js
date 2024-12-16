import { Router } from 'express';
import { userController } from '../controllers/user.controller';
const router = Router();
router.post('/register', userController.register);
router.get('/user/:identifier', userController.getUser);
export default router;
