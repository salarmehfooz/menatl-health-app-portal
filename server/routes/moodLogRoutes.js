import express from "express";
import { protect, requireRole } from "../controllers/authController.js";
import {
  createMoodLog,
  getMyMoodLogs,
  getPatientMoodLogs,
  getTherapistClientsMoodLogs,
  getAllMoodLogs,
  deleteMoodLog,
} from "../controllers/moodLogController.js";

const router = express.Router();

// 🟢 User creates a mood log
router.post("/", protect, requireRole("user"), createMoodLog);

// 🟢 User views their own mood logs
router.get("/me", protect, requireRole("user"), getMyMoodLogs);

// 🟢 Therapist views logs of all their assigned clients
router.get(
  "/therapist-clients",
  protect,
  requireRole("therapist"),
  getTherapistClientsMoodLogs
);

// 🟢 Therapist or Admin views a specific patient's mood logs
router.get(
  "/patient/:id",
  protect,
  requireRole("therapist", "admin"),
  getPatientMoodLogs
);

// 🟢 Admin views all mood logs
router.get("/admin/all", protect, requireRole("admin"), getAllMoodLogs);

// 🟢 Therapist or Admin deletes a mood log
router.delete(
  "/:id",
  protect,
  requireRole("therapist", "admin"),
  deleteMoodLog
);

export default router;
