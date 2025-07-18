import express from "express";
import { protect, requireRole } from "../controllers/authController.js";
import {
  createContent,
  updateContent,
  deleteContent,
  getAllContent,
} from "../controllers/contentController.js";

const router = express.Router();

router.post("/", protect, requireRole("therapist"), createContent);
router.put("/:id", protect, requireRole("therapist"), updateContent);
router.delete(
  "/:id",
  protect,
  requireRole("therapist", "admin"),
  deleteContent
);
router.get("/", protect, getAllContent);

export default router;
