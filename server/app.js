// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Route imports
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/moodlogs", moodLogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Google Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ Chatbot Endpoint (Fixed)
app.post("/api/chatbot", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "Messages array is required and cannot be empty." });
  }

  try {
    // Convert messages to Gemini format
    let chatHistory = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // If this is the first user message, add therapist system prompt
    if (messages.length === 1 && messages[0].sender === "user") {
      chatHistory.unshift({
        role: "user",
        parts: [
          {
            text: "The user is in distress and needs to calm down. Act as a compassionate therapist. Respond empathetically and guide them towards calmness. Do not reveal you are an AI.",
          },
        ],
      });
    }

    // ✅ Use generateContent instead of startChat to avoid role order issues
    const result = await model.generateContent({
      contents: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const response = result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(
      "❌ Error communicating with Gemini API:",
      error.message || error
    );
    res.status(500).json({
      error: "Failed to get response from AI. Please try again.",
    });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("🧠 Mental Health API is running...");
});

export default app;
