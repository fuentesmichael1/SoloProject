import express from 'express';
import * as UserController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);


export default router;
