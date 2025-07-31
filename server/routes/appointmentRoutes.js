import express from "express";
import { protect, requireRole } from "../controllers/authController.js";
import {
  bookAppointment,
  getAppointmentsForTherapist,
  getAppointmentsForUser,
  updateAppointment,
  getAppointmentStatus,
  getAllAppointmentsForAdmin,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", protect, requireRole("user"), bookAppointment);
router.get("/me/:id", protect, getAppointmentsForUser);
router.get(
  "/therapist",
  protect,
  requireRole("therapist"),
  getAppointmentsForTherapist
);
router.get(
  "/admin/all",
  protect,
  requireRole("admin"),
  getAllAppointmentsForAdmin
);
router.put("/:id", protect, updateAppointment);
router.get("/:id/status", protect, getAppointmentStatus);

export default router;
