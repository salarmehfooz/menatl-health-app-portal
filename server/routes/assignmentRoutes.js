import express from "express";
const router = express.Router();

import {
  assignUsersToTherapist,
  getAllAssignments,
  getAssignedUsersForTherapist,
  getAssignedTherapistForUser,
  removeUserFromTherapist,
} from "../controllers/assignmentController.js";

import { protect, requireRole } from "../controllers/authController.js";

router.post("/assign", protect, requireRole("admin"), assignUsersToTherapist);
router.get("/", protect, requireRole("admin", "therapist"), getAllAssignments);
router.get(
  "/my-users",
  protect,
  requireRole("therapist"),
  getAssignedUsersForTherapist
);
router.get(
  "/my-therapist",
  protect,
  requireRole("user"),
  getAssignedTherapistForUser
);
router.put(
  "/remove-user",
  protect,
  requireRole("admin"),
  removeUserFromTherapist
);
export default router;
