import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    datetime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: { type: String },

    // 🔽 New fields for reschedule tracking
    wasRescheduled: { type: Boolean, default: false },
    rescheduledAt: { type: Date },
    rescheduleReason: { type: String },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
