const express = require("express")
const router = express.Router()
const Session = require("../models/Session")
const { protect } = require("../middleware/auth")

router.post("/", protect, async (req, res) => {
  try {
    const session = await Session.create(req.body)
    res.status(201).json(session)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/", protect, async (req, res) => {
  try {
    const sessions = await Session.find({
      participants: req.user._id
    }).sort({ scheduledAt: 1 })
    res.json(sessions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router