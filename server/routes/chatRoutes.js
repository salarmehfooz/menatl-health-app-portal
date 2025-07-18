import express from "express";
import { protect } from "../controllers/authController.js";
import {
  sendMessage,
  getThreadMessages,
  getMyThreads,
} from "../controllers/chatController.js";

const router = express.Router();

// ✅ Send a message or start a new thread
router.post("/", protect, sendMessage);

// ✅ Get all chat threads for the logged-in user (user ↔ therapist only)
router.get("/threads", protect, getMyThreads);

// ✅ Get all messages in a specific thread
router.get("/thread/:id", protect, getThreadMessages);

export default router;
