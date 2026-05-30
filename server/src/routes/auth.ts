import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

export default router;
