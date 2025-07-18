import Content from "../models/content.js";

// Create content (Therapist or Admin)
export const createContent = async (req, res) => {
  if (!["therapist", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can create content." });
  }

  try {
    const content = await Content.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all content (All roles)
export const getAllContent = async (req, res) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update content (Therapist or Admin)
export const updateContent = async (req, res) => {
  if (!["therapist", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can update content." });
  }

  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Content not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete content (Therapist or Admin)
export const deleteContent = async (req, res) => {
  if (!["therapist", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Only therapists or admins can delete content." });
  }

  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Content not found" });

    res.json({ message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
