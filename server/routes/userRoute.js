const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../controllers/authController.js");

router.get("/profile", protect, requireRole("user"), (req, res) => {
  res.json({ msg: "User profile data access granted" });
});

module.exports = router;
