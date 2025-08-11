import express, { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();
router.post('/auth/register', register);
router.post('/auth/login', login);

router.post('/auth/logout', authenticate, logout);

export default router