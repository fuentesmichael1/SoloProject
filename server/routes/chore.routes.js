import express from 'express';
import * as ChoreController from '../controllers/chores.controller.js';
import { authenticate } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', ChoreController.registerUser);
router.post('/login', ChoreController.loginUser);

router.route('/chores')
    .get(authenticate, ChoreController.getAllChores)
    .post(authenticate, ChoreController.createChore);

router.get('/chores/user/:userId', authenticate, ChoreController.getUserChores);

router.route('/chores/:id')
    .get(authenticate, ChoreController.getOneChore)
    .put(authenticate, ChoreController.updateChore)
    .delete(authenticate, ChoreController.deleteChore);

router.post('/chores/:id/assign', authenticate, ChoreController.assignChore);

router.post('/chores/validate', authenticate, ChoreController.validateChore);
router.get('/user', ChoreController.getCurrentUser);
router.post('/logout', ChoreController.logoutUser);

export default router;