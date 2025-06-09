import { Router } from 'express';
import { register, login, getProfile } from '../controllers/userController';
import { auth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

export default router; 