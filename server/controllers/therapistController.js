const User = require("../models/user.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-passwordHash");
    res.json(users);
  } catch {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

module.exports = { getAllUsers };
