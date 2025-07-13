import { Appointment } from "../models/appointmentModel.js";
import User from "../models/user.js";

// Create Appointment (User only)
export const bookAppointment = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ error: "Only users can book appointments." });
    }

    const { therapistId, datetime, notes } = req.body;

    const therapist = await User.findOne({
      _id: therapistId,
      role: "therapist",
    });
    if (!therapist) {
      return res.status(400).json({ error: "Invalid therapist ID." });
    }

    const newAppointment = new Appointment({
      userId: req.user.id,
      therapistId,
      datetime,
      notes,
    });

    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Appointments for Therapist
export const getAppointmentsForTherapist = async (req, res) => {
  try {
    if (req.user.role !== "therapist") {
      return res
        .status(403)
        .json({ error: "Only therapists can view appointments." });
    }

    const appointments = await Appointment.find({
      therapistId: req.user.id,
    }).populate("userId", "username email");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Therapist Updates Appointment (e.g., reschedule or cancel)
export const updateAppointment = async (req, res) => {
  try {
    if (req.user.role !== "therapist") {
      return res
        .status(403)
        .json({ error: "Only therapists can update appointments." });
    }

    const { id } = req.params;
    const { datetime, status, notes } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Ensure therapist owns the appointment
    if (appointment.therapistId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not allowed to edit this appointment." });
    }

    appointment.datetime = datetime || appointment.datetime;
    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;

    const updated = await appointment.save();
    res.status(200).json({ message: "Appointment updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View Appointment Status (Accessible to all authenticated users)
export const getAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Only involved user or therapist can access
    if (
      req.user.id !== appointment.userId.toString() &&
      req.user.id !== appointment.therapistId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this appointment." });
    }

    res.status(200).json({ status: appointment.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Appointments for Logged-in User
export const getUserAppointments = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ error: "Only users can view their appointments." });
    }

    const appointments = await Appointment.find({
      userId: req.user.id,
    }).populate("therapistId", "username email");
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
