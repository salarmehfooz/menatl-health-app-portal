import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
