import Appointment from "../models/appointmentModel.js";

// Book Appointment (User only)
export const bookAppointment = async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Only users can book appointments." });
  }

  try {
    const { therapistId, datetime, notes } = req.body;
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

// Therapist/Admin views appointments by therapistId
export const getAppointmentsForTherapist = async (req, res) => {
  if (!["therapist", "admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const therapistId = req.params.therapistId;
    const appointments = await Appointment.find({ therapistId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User/Admin views own appointments
export const getAppointmentsForUser = async (req, res) => {
  if (req.user.role !== "user" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const userId = req.user.role === "admin" ? req.params.userId : req.user.id;
    const appointments = await Appointment.find({ userId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Therapist/Admin Updates Appointment
export const updateAppointment = async (req, res) => {
  if (!["therapist", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can update appointments." });
  }

  try {
    const { id } = req.params;
    const { datetime, status, notes } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { datetime, status, notes },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Appointment not found" });

    res.status(200).json({ message: "Appointment updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View Appointment Status (All roles)
export const getAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    res.status(200).json({ status: appointment.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Admin views all appointments (for Admin role)
export const getAllAppointmentsForAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // Fetching all appointments for the admin
    const appointments = await Appointment.find()
      .populate("userId", "username email")
      .populate("therapistId", "username email");

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
