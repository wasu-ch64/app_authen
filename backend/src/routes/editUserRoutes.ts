import express, { Router } from 'express'
import { authenticate } from '../middleware/authMiddleware';
import { deleteUser, updateUser } from '../controllers/editUserController';

const router: Router = express.Router();
router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteUser);

export default router;