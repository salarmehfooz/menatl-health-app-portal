import express from "express";
import { protect, requireRole } from "../controllers/authController.js";
import { getAllUsers } from "../controllers/therapistController.js";

const router = express.Router();

router.get("/users", protect, requireRole("therapist"), getAllUsers);

export default router;
