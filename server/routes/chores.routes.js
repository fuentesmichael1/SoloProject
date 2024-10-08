import express from 'express';
import * as PatientController from '../controllers/chores.controller.js';

const router = express.Router();

router.route('/patients')
    .get(PatientController.getAllPatients)
    .post(PatientController.createPatient);

router.route('/patients/:id')
    .get(PatientController.getOnePatient)
    .put(PatientController.updatePatient)
    .delete(PatientController.deletePatient);

export default router;
