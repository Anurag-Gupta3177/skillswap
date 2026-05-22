const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const { protect } = require("../middleware/auth")

// GET my notifications
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST create notification
router.post("/", protect, async (req, res) => {
  try {
    const { userId, title, body, type } = req.body
    const notification = await Notification.create({
      userId, title, body,
      type: type || "session_reminder"
    })
    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUT mark all as read
router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { isRead: true }
    )
    res.json({ message: "All marked as read" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router