const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderOffersSkill: { type: String, required: true },
    senderWantsSkill: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "active", "completed"],
      default: "pending",
    },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);