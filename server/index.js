import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import moodLogRoutes from "./routes/moodLogRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import contentRoutes from "./routes/contentRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/moodlogs", moodLogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);

// Root
app.get("/", (req, res) => {
  res.send("🧠 Mental Health API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
