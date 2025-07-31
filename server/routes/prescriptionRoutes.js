import express from "express";
const router = express.Router();
import {
  createPrescription,
  getPrescriptionsByPatient,
  updatePrescription,
} from "../controllers/prescriptionController.js";
import { protect, requireRole } from "../controllers/authController.js";

router.post("/", protect, requireRole("therapist"), createPrescription);
router.get("/:userId", protect, getPrescriptionsByPatient);
router.put(
  "/:prescriptionId",
  protect,
  requireRole("therapist"),
  updatePrescription
);

export default router;
