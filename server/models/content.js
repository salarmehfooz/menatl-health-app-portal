const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["video", "article", "exercise", "image", "blog"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: [String],
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Content", contentSchema);
