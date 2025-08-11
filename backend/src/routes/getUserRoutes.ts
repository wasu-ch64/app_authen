import express, { Router } from 'express'
import { allUser, selectUser } from '../controllers/getUserController';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();
router.get('/get-alluser', authenticate, allUser);
router.get('/users/:id', authenticate, selectUser);

export default router;
