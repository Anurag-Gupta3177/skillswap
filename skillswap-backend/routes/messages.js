const express = require("express")
const router = express.Router()
const Message = require("../models/Message")
const { protect } = require("../middleware/auth")

router.get("/:swapId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ swapId: req.params.swapId })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:swapId", protect, async (req, res) => {
  try {
    const message = await Message.create({
      swapId: req.params.swapId,
      sender: req.user._id,
      content: req.body.content,
    })
    const populated = await message.populate("sender", "name")
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router