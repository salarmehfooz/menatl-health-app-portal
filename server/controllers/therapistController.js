import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-passwordHash");
    res.json(users);
  } catch {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};
