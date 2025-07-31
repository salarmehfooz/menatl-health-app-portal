import Prescription from "../models/prescriptionModel.js";
import { createNotification } from "./notificationController.js";

export const createPrescription = async (req, res) => {
  try {
    const { userId, therapistId, notes, fileUrl } = req.body;

    const prescription = await Prescription.create({
      userId,
      therapistId,
      notes,
      fileUrl,
    });

    // Notify the patient/user about the new prescription
    await createNotification({
      recipientId: userId,
      type: "new_prescription",
      message: `You have a new prescription from your therapist.`,
      meta: { prescriptionId: prescription._id, therapistId },
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updatePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updatedData = req.body;

    const updated = await Prescription.findByIdAndUpdate(
      prescriptionId,
      updatedData,
      { new: true, overwrite: true } // full replacement of document
    );

    if (!updated) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Notify user about the update
    await createNotification({
      recipientId: updated.userId,
      type: "update_prescription",
      message: `Your prescription has been updated.`,
      meta: { prescriptionId: updated._id },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const user = req.user;

    const query = { userId: req.params.userId };
    if (user.role === "user") {
      query.isActive = true; // filter only active for regular users
    }

    const prescriptions = await Prescription.find(query).sort({
      createdAt: -1,
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
