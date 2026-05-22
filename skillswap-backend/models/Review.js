const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    swapId: { type: mongoose.Schema.Types.ObjectId, ref: "SwapRequest" },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String }],
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);