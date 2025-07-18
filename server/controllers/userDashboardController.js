import User from "../models/user.js";
import Appointment from "../models/appointmentModel.js";
import MoodLog from "../models/moodLog.js";
import Content from "../models/content.js";

// GET: User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.status(200).json(user);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

// PUT: Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-passwordHash");
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).json({ msg: "Error updating profile" });
  }
};

// GET: User's Appointments
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id,
    }).populate("therapistId", "username email");
    res.status(200).json(appointments);
  } catch {
    res.status(500).json({ msg: "Failed to load appointments" });
  }
};

// GET: User's Mood Logs
export const getUserMoodLogs = async (req, res) => {
  try {
    const logs = await MoodLog.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(logs);
  } catch {
    res.status(500).json({ msg: "Failed to load mood logs" });
  }
};

// GET: Accessible Content
export const getUserContent = async (req, res) => {
  try {
    const content = await Content.find({});
    res.status(200).json(content);
  } catch {
    res.status(500).json({ msg: "Failed to fetch content" });
  }
};
