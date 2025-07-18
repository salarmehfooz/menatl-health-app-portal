import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "therapist", "admin"],
      default: "user",
    },
    gender: String,
    emergencyContact: String,

    // ✅ Reference to assigned therapist (for users)
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
