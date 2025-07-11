const Content = require("../models/content.js");

exports.createContent = async (req, res) => {
  if (req.user.role !== "therapist") {
    return res
      .status(403)
      .json({ error: "Only therapists can create content." });
  }

  try {
    const content = await Content.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContent = async (req, res) => {
  if (req.user.role !== "therapist") {
    return res.status(403).json({ error: "Only therapists can edit content." });
  }

  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  if (req.user.role !== "therapist") {
    return res
      .status(403)
      .json({ error: "Only therapists can delete content." });
  }

  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ msg: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
