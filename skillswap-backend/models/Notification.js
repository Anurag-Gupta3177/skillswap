const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["swap_request", "message", "session_reminder", "review", "badge"],
      default: "session_reminder"
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema)