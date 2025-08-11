import express, { Router } from 'express';
import { checkAuthen } from '../controllers/checkAuthenController';
import { authenticateOptional } from '../middleware/authenticateOptional';

const router: Router = express.Router();
router.get('/auth/check-auth', authenticateOptional, checkAuthen);

export default router;