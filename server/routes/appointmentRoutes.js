import express from "express";
import {
  bookAppointment,
  getAppointmentsForTherapist,
  updateAppointment,
  getAppointmentStatus,
  getUserAppointments,
} from "../controllers/appointmentController.js";

import { protect, requireRole } from "../controllers/authController.js";

const router = express.Router();

// Users
router.post("/", protect, requireRole("user"), bookAppointment);
router.get("/my", protect, requireRole("user"), getUserAppointments);

// Therapists
router.get(
  "/therapist",
  protect,
  requireRole("therapist"),
  getAppointmentsForTherapist
);
router.put("/:id", protect, requireRole("therapist"), updateAppointment);

// Public (optional: or protect if needed)
router.get("/:id/status", protect, getAppointmentStatus);

module.exports = router;
