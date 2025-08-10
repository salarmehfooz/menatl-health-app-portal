import mongoose from "mongoose";
import MoodLog from "../models/moodLog.js";
import User from "../models/user.js";
import Assignment from "../models/assignmentModel.js";
// User (patient) creates a mood log
export const createMoodLog = async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Only users can create mood logs." });
  }

  const { mood, notes, sleepHours, energyLevel } = req.body;

  try {
    const newLog = new MoodLog({
      userId: req.user.id,
      mood,
      notes,
      sleepHours,
      energyLevel,
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Therapist or Admin views mood logs of a specific patient
export const getPatientMoodLogs = async (req, res) => {
  const allowedRoles = ["therapist", "admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can view patient mood logs." });
  }

  try {
    const patientId = req.params.patientId;

    const logs = await MoodLog.find({ userId: patientId })
      .populate("userId", "username email therapistId") // populate patient info
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User views their own mood logs
export const getMyMoodLogs = async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const logs = await MoodLog.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a mood log (only by therapist or admin)
export const deleteMoodLog = async (req, res) => {
  const logId = req.params.id;

  const allowedRoles = ["therapist", "admin"];
  if (!allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can delete mood logs." });
  }

  try {
    const log = await MoodLog.findById(logId);
    if (!log) {
      return res.status(404).json({ error: "Mood log not found." });
    }

    await MoodLog.findByIdAndDelete(logId);
    res.json({ message: "Mood log deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin gets all mood logs from all users (with user populated)
export const getAllMoodLogs = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can access all mood logs." });
  }

  try {
    const logs = await MoodLog.find()
      .populate("userId", "username email therapistId") // include user info
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Therapist sees mood logs only from *their* assigned patients

export const getTherapistClientsMoodLogs = async (req, res) => {
  if (req.user.role !== "therapist") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const therapistId = req.user.id;
    const patientId = req.params.patientId; // Ensure you're getting the patientId from the URL

    // ✅ Step 1: Get assigned user IDs from Assignment model
    const assignment = await Assignment.findOne({ therapistId });

    if (!assignment || !assignment.assignedUsers.includes(patientId)) {
      return res
        .status(404)
        .json({ error: "Patient not found or not assigned to this therapist" });
    }

    // ✅ Step 2: Fetch mood logs for the selected patient
    const logs = await MoodLog.find({ userId: patientId })
      .populate("userId", "username email therapistId")
      .sort({ createdAt: -1 });

    console.log(`Fetched ${logs.length} mood log(s) for selected patient.`);

    return res.json(logs);
  } catch (err) {
    console.error("Error fetching therapist clients' mood logs:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};
