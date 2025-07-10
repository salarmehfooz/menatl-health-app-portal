const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../controllers/authController.js");
const moodLogController = require("../controllers/moodLogController.js");

// Patient creates mood log
router.post("/", protect, requireRole("user"), moodLogController.createMoodLog);

// Therapist views mood logs of a patient
router.get(
  "/patient/:patientId",
  protect,
  requireRole("therapist"),
  moodLogController.getPatientMoodLogs
);

module.exports = router;
