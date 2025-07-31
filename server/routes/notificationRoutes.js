import express from "express";
import {
  getNotifications,
  markAsRead,
  clearUserNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Get all notifications for a specific user
// GET /api/notifications/:userId
router.get("/:userId", protect, getNotifications);

// Mark a specific notification as read
// PATCH /api/notifications/:id/read
router.patch("/:id/read", protect, markAsRead);
router.delete("/clear", protect, clearUserNotifications);

export default router;
