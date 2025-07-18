import mongoose from "mongoose";

const MoodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    mood: {
      type: String,
      enum: ["happy", "sad", "anxious", "angry", "excited", "tired"],
      required: true,
    },
    notes: String,
    sleepHours: Number,
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

const MoodLog = mongoose.model("MoodLog", MoodLogSchema);
export default MoodLog;
