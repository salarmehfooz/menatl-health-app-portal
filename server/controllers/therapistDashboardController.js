import User from "../models/user.js";
import Appointment from "../models/appointmentModel.js";
import MoodLog from "../models/moodLog.js";
import Content from "../models/content.js";

// GET: Therapist Profile
export const getTherapistProfile = async (req, res) => {
  try {
    const therapist = await User.findById(req.user.id).select("-passwordHash");
    res.status(200).json(therapist);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};

// PUT: Update Therapist Profile
export const updateTherapistProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-passwordHash");
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ msg: "Error updating profile" });
  }
};

// GET: Therapist's Appointments
export const getTherapistAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      therapistId: req.user.id,
    }).populate("userId", "username email");
    res.status(200).json(appointments);
  } catch {
    res.status(500).json({ msg: "Failed to fetch appointments" });
  }
};

// GET: All Patients assigned
export const getTherapistPatients = async (req, res) => {
  try {
    const patients = await Appointment.find({
      therapistId: req.user.id,
    }).distinct("userId");
    const users = await User.find({ _id: { $in: patients } }).select(
      "username email gender"
    );
    res.status(200).json(users);
  } catch {
    res.status(500).json({ msg: "Failed to load patients" });
  }
};

// GET: All Mood Logs of Patients
export const getAllMoodLogs = async (req, res) => {
  try {
    const logs = await MoodLog.find({}).populate("userId", "username");
    res.status(200).json(logs);
  } catch {
    res.status(500).json({ msg: "Failed to load mood logs" });
  }
};

// GET: All Created Content
export const manageContent = async (req, res) => {
  try {
    const content = await Content.find({ createdBy: req.user.id });
    res.status(200).json(content);
  } catch {
    res.status(500).json({ msg: "Failed to fetch content" });
  }
};
