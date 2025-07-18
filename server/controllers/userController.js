import User from "../models/user.js";

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can view users." });
  }

  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get one user
export const getUserById = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can view user data." });
  }

  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ msg: "User not found." });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a user
export const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can delete users." });
  }

  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "User not found." });
    res.status(200).json({ msg: "User deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update a user
export const updateUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can update users." });
  }

  try {
    const { username, email, role, gender, emergencyContact } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, gender, emergencyContact },
      { new: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ msg: "User not found." });

    res.status(200).json({ msg: "User updated.", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllTherapists = async (req, res) => {
  try {
    const therapists = await User.find({ role: "therapist" }).select(
      "_id username email"
    );
    res.status(200).json(therapists);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch therapists" });
  }
};
