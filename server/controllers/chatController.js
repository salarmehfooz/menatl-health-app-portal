import ChatThread from "../models/ChatThread.js";
import ChatMessage from "../models/chatMessage.js";
import User from "../models/user.js";
import { createNotification } from "./notificationController.js";
// ✅ Send a message (new thread or existing)
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, threadId } = req.body;
    const senderId = req.user?.id;

    if (!senderId) return res.status(401).json({ message: "Unauthorized" });
    if (!message?.trim())
      return res.status(400).json({ message: "Missing message" });

    let thread;

    if (threadId) {
      thread = await ChatThread.findById(threadId);
      if (!thread) return res.status(404).json({ message: "Thread not found" });
    } else {
      if (!recipientId)
        return res.status(400).json({ message: "Missing recipientId" });

      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient) {
        return res.status(404).json({ message: "Invalid sender or recipient" });
      }

      const validPair =
        (sender.role === "user" && recipient.role === "therapist") ||
        (sender.role === "therapist" && recipient.role === "user");

      if (!validPair) {
        return res
          .status(403)
          .json({ message: "Only user ↔ therapist chat allowed" });
      }

      const userId = sender.role === "user" ? senderId : recipientId;
      const therapistId = sender.role === "therapist" ? senderId : recipientId;

      thread = await ChatThread.findOne({ userId, therapistId });

      if (!thread) {
        thread = await ChatThread.create({
          userId,
          therapistId,
          lastMessage: message,
        });
      } else {
        thread.lastMessage = message;
        thread.lastUpdated = Date.now();
        await thread.save();
      }
    }

    const newMessage = await ChatMessage.create({
      threadId: thread._id,
      sender: req.user.role,
      message,
    });

    // Notify the recipient about the new message
    const recipientUserId =
      req.user.role === "user" ? thread.therapistId : thread.userId;

    try {
      await createNotification({
        recipientId: recipientUserId,
        type: "new_message",
        message: `New message from ${req.user.role}`,
        meta: { threadId: thread._id, senderId },
      });
    } catch (notifyErr) {
      console.error("Notification creation failed:", notifyErr);
      // Continue without failing the request
    }

    res.status(201).json({
      message: "Message sent",
      thread: {
        _id: thread._id,
        userId: thread.userId,
        therapistId: thread.therapistId,
        lastMessage: thread.lastMessage,
        lastUpdated: thread.lastUpdated,
      },
      chatMessage: {
        _id: newMessage._id,
        threadId: newMessage.threadId,
        sender: newMessage.sender,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (err) {
    console.error("SendMessage Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all messages in a thread
export const getThreadMessages = async (req, res) => {
  try {
    const { id: threadId } = req.params;

    if (!threadId || !threadId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid thread ID" });
    }

    const messages = await ChatMessage.find({ threadId }).sort({
      createdAt: 1,
    });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages in this thread" });
    }

    res.status(200).json(messages);
  } catch (err) {
    console.error("GetMessages Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to load messages", error: err.message });
  }
};

// ✅ Get all threads for the logged-in user
export const getMyThreads = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let threads;

    if (role === "user") {
      threads = await ChatThread.find({ userId }).populate(
        "therapistId",
        "username email"
      );
    } else if (role === "therapist") {
      threads = await ChatThread.find({ therapistId: userId }).populate(
        "userId",
        "username email"
      );
    } else {
      return res.status(403).json({ message: "Access denied: invalid role" });
    }

    res.status(200).json(threads);
  } catch (err) {
    console.error("GetThreads Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to load chat threads", error: err.message });
  }
};
