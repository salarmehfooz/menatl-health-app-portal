// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional: for system/admin generated notifications
    },
    type: {
      type: String,
      enum: [
        "new_message",
        "new_appointment",
        "appointment_status_change",
        "new_prescription",
        "update_prescription",
        "therapist_assigned",
        "user_registered",
        "user_unassigned",
        "therapist_unassigned",
        "assigned_patients",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    meta: {
      type: Object,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
