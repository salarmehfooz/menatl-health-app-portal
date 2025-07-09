const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../controllers/authController.js");
const { getAllUsers } = require("../controllers/therapistController.js");

router.get("/users", protect, requireRole("therapist"), getAllUsers);

module.exports = router;
