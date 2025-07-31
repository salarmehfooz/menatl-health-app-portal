import Assignment from "../models/assignmentModel.js";
import mongoose from "mongoose";
import { createBulkNotifications } from "./notificationController.js";
import User from "../models/user.js";
// ✅ Create or update therapist assignment
export const assignUsersToTherapist = async (req, res) => {
  const { therapistId, assignedUsers } = req.body;

  try {
    let assignment = await Assignment.findOne({ therapistId });

    if (assignment) {
      assignment.assignedUsers = assignedUsers;
    } else {
      assignment = new Assignment({ therapistId, assignedUsers });
    }

    await assignment.save();

    // Notify therapist about the assignment
    const notifications = [
      {
        recipientId: therapistId,
        type: "assigned_patients",
        message: `You have been assigned ${assignedUsers.length} new user(s).`,
        meta: { assignedUsers },
      },
      // Optionally notify the assigned users that they've been assigned a therapist
      ...assignedUsers.map((userId) => ({
        recipientId: userId,
        type: "therapist_assigned",
        message: `You have been assigned a therapist.`,
        meta: { therapistId },
      })),
    ];

    await createBulkNotifications(notifications);

    res.status(200).json({ message: "Assignment saved", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all therapist assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("therapistId", "_id username email")
      .populate("assignedUsers", "_id username email");
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAssignedUsersForTherapist = async (req, res) => {
  const therapistId = req.user.id;

  try {
    const assignment = await Assignment.findOne({ therapistId }).populate(
      "assignedUsers",
      "_id username email"
    );

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "No assigned users found for this therapist" });
    }

    res.status(200).json({ assignedUsers: assignment.assignedUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Get assigned therapist for a user
export const getAssignedTherapistForUser = async (req, res) => {
  const userId = req.user.id; // Assuming user is authenticated and req.user is populated

  try {
    const assignment = await Assignment.findOne({
      assignedUsers: userId,
    }).populate("therapistId", "_id username email");

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "No therapist assigned to this user" });
    }

    res.status(200).json({ therapist: assignment.therapistId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ Remove a user from a therapist assignment
export const removeUserFromTherapist = async (req, res) => {
  const { therapistId, userId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(therapistId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ error: "Invalid therapistId or userId" });
  }

  try {
    const assignment = await Assignment.findOne({ therapistId });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const beforeCount = assignment.assignedUsers.length;

    assignment.assignedUsers = assignment.assignedUsers.filter(
      (id) => id.toString?.() !== userId && id._id?.toString?.() !== userId
    );

    if (assignment.assignedUsers.length === beforeCount) {
      return res
        .status(404)
        .json({ message: "User was not assigned to this therapist" });
    }

    await assignment.save();

    // Safe notification attempt
    try {
      const notifications = [
        {
          recipientId: therapistId,
          type: "user_unassigned",
          message: `A user has been removed from your assigned list.`,
          meta: { userId },
        },
        {
          recipientId: userId,
          type: "therapist_unassigned",
          message: `You have been unassigned from your therapist.`,
          meta: { therapistId },
        },
      ];

      await createBulkNotifications(notifications);
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr.message);
    }

    res.status(200).json({
      message: "User removed successfully",
      assignment,
    });
  } catch (err) {
    console.error("Error in removeUserFromTherapist:", err.message);
    res.status(500).json({ error: err.message });
  }
};
