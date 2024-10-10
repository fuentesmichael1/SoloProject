import express from 'express';
import * as ChoreController from '../controllers/chores.controller.js';

const router = express.Router();

router.post('/register', ChoreController.registerUser);
router.post('/login', ChoreController.loginUser);

router.use(ChoreController.authenticate);  // Apply authentication middleware to all routes below

router.route('/chores')
    .get(ChoreController.getAllChores)
    .post(ChoreController.createChore);

router.get('/chores/user/:userId', ChoreController.getUserChores);

router.route('/chores/:id')
    .get(ChoreController.getOneChore)
    .put(ChoreController.updateChore)
    .delete(ChoreController.deleteChore);

router.post('/chores/:id/assign', ChoreController.assignChore);

router.post('/chores/validate', ChoreController.validateChore);
router.get('/user', ChoreController.getCurrentUser);
router.post('/logout', ChoreController.logoutUser);

export default router;
