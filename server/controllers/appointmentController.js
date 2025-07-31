import Appointment from "../models/appointmentModel.js";
import mongoose from "mongoose";
import {
  createNotification,
  createBulkNotifications,
} from "./notificationController.js"; // import notification funcs

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

    // Notify therapist + admins about new appointment
    const admins = await mongoose.model("User").find({ role: "admin" });
    const notifications = [
      {
        recipientId: therapistId,
        type: "new_appointment",
        message: "You have a new appointment scheduled.",
        meta: { appointmentId: newAppointment._id },
      },
      ...admins.map((admin) => ({
        recipientId: admin._id,
        type: "new_appointment",
        message: "A new appointment was booked.",
        meta: { appointmentId: newAppointment._id },
      })),
    ];

    await createBulkNotifications(notifications);

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
    const therapistId = req.user.id;

    const appointments = await Appointment.find({
      therapistId: new mongoose.Types.ObjectId(therapistId),
    }).populate("userId", "username email");

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

    const appointments = await Appointment.find({ userId })
      .populate("userId", "username email")
      .populate("therapistId", "username email"); // <== populate therapistId here

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Therapist/Admin/User Updates Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { datetime, status, notes, rescheduleReason } = req.body;

    const oldAppointment = await Appointment.findById(id);
    if (!oldAppointment)
      return res.status(404).json({ error: "Appointment not found" });

    // Optional: ensure users can only modify their own appointments
    if (
      req.user.role === "user" &&
      oldAppointment.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updates = { notes };

    // 🔁 If datetime is changing, it's a reschedule
    if (
      datetime &&
      new Date(datetime).getTime() !== oldAppointment.datetime.getTime()
    ) {
      updates.datetime = datetime;
      updates.wasRescheduled = true;
      updates.rescheduledAt = new Date();
      updates.rescheduleReason = rescheduleReason || "User rescheduled";

      // Optionally update status to "rescheduled"
      if (oldAppointment.status === "scheduled") {
        updates.status = "rescheduled";
      }
    }

    // ✅ Allow status change too (e.g., cancel)
    if (status) {
      updates.status = status;
    }

    const updated = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
    });

    // Notifications
    if (status && oldAppointment.status !== status) {
      const admins = await mongoose.model("User").find({ role: "admin" });

      const notifications = [
        {
          recipientId: updated.userId,
          type: "appointment_status_change",
          message: `Your appointment status changed to "${status}".`,
          meta: { appointmentId: updated._id },
        },
        {
          recipientId: updated.therapistId,
          type: "appointment_status_change",
          message: `Appointment status updated to "${status}".`,
          meta: { appointmentId: updated._id },
        },
        ...admins.map((admin) => ({
          recipientId: admin._id,
          type: "appointment_status_change",
          message: `Appointment status changed to "${status}".`,
          meta: { appointmentId: updated._id },
        })),
      ];

      await createBulkNotifications(notifications);
    }

    res.status(200).json({ message: "Appointment updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View Appointment Status (All roles)
export const getAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate(
      "userId",
      "username email"
    );

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
