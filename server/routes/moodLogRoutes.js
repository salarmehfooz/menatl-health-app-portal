const express = require('express');
const router = express.Router();
const moodLogController = require('../controller/moodLogController.js');

// Patient creates mood log
router.post('/', moodLogController.createMoodLog);

// Therapist views mood logs of a patient
router.get('/patient/:patientId', moodLogController.getPatientMoodLogs);

module.exports = router;
