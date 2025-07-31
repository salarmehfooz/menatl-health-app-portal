// controllers/notificationController.js
import Notification from "../models/Notification.js";

/**
 * @desc Get all notifications for a user
 * @route GET /api/notifications/:userId
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ recipientId: userId }).sort(
      { createdAt: -1 }
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

/**
 * @desc Mark a notification as read
 * @route PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

/**
 * @desc Create a single notification (use inside other controllers)
 */
export const createNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * @desc Create multiple notifications at once (use inside other controllers)
 */
export const createBulkNotifications = async (notifications) => {
  try {
    return await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
};
export const clearUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ recipientId: userId });
    res.status(200).json({ message: "Notifications cleared" });
  } catch (err) {
    console.error("ClearNotifications error:", err);
    res.status(500).json({ message: "Server error clearing notifications" });
  }
};
