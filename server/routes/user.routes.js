import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticate } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.get('/me', authenticate, UserController.getCurrentUser);


export default router;
