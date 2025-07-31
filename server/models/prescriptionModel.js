import mongoose from "mongoose";

const { Schema, model } = mongoose;

const prescriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  therapistId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  notes: String,
  fileUrl: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
