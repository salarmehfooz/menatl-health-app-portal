// routes/contentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createContent,
  getAllContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController.js");

const { protect, requireRole } = require("../controllers/authController.js");

// Therapist-only routes
router.post("/", protect, requireRole("therapist"), createContent);
router.put("/:id", protect, requireRole("therapist"), updateContent);
router.delete("/:id", protect, requireRole("therapist"), deleteContent);

// Accessible to both users and therapists
router.get("/", protect, getAllContent);

module.exports = router;
