const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    topicCovered: { type: String, default: "" },
    sharedNotes: { type: String, default: "" },
    videoRoomId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);