import express from 'express';
import * as ChoreController from '../controllers/chores.controller.js';
import { authenticate } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/chores')
    .get(ChoreController.getAllChores)
    .post(authenticate, ChoreController.createChore);

router.route('/chores/:id')
    .get(ChoreController.getOneChore)
    .put(authenticate, ChoreController.updateChore)
    .delete(authenticate, ChoreController.deleteChore);

router.put('/chores/:id/assign', authenticate, ChoreController.assignChore);
router.post('/chores', authenticate, ChoreController.createChore);

export default router;
