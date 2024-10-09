import express from 'express';
import * as ChoreController from '../controllers/chores.controller.js';

const router = express.Router();

router.route('/chores')
    .get(ChoreController.getAllChores)
    .post(ChoreController.createChore);

router.route('/chores/:id')
    .get(ChoreController.getOneChore)
    .put(ChoreController.updateChore)
    .delete(ChoreController.deleteChore);

export default router;