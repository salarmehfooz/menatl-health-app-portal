import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "article", "exercise"],
      required: true,
    },
    url: { type: String },
    tags: [String],
    description: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
