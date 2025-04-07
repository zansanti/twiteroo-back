import express from 'express';
import { signUp } from '../controllers/authController.js';

const router = express.Router();
router.post('/sign-up', signUp); // Nova rota
export default router;