import express from "express";
import { protect, requireRole } from "../controllers/authController.js";

import {
  getAllUsers,
  deleteUser,
  getAllTherapists,
} from "../controllers/userController.js";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userDashboardController.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

router.get("/", protect, requireRole("admin"), getAllUsers);
router.delete("/:id", protect, requireRole("admin"), deleteUser);
router.get("/therapists", getAllTherapists);

export default router;
