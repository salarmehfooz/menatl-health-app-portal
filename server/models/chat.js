import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
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
    timestamp: { type: Date, default: Date.now },
    messageType: {
      type: String,
      enum: ["text"],
      default: "text",
    },
    message: { type: String, required: true },
    sender: { type: String, enum: ["user", "therapist"], required: true },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
