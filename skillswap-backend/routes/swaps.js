const express = require("express");
const router = express.Router();
const SwapRequest = require("../models/SwapRequest");
const { protect } = require("../middleware/auth");

// @route POST /api/swaps
router.post("/", protect, async (req, res) => {
  try {
    const { receiver, senderOffersSkill, senderWantsSkill, message } = req.body;
    const swap = await SwapRequest.create({
      sender: req.user._id,
      receiver,
      senderOffersSkill,
      senderWantsSkill,
      message,
    });
    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/swaps
router.get("/", protect, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name profilePhoto skillOffered rating")
      .populate("receiver", "name profilePhoto skillOffered rating")
      .sort({ createdAt: -1 });
    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/swaps/:id/accept
router.put("/:id/accept", protect, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    swap.status = "accepted";
    await swap.save();
    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/swaps/:id/decline
router.put("/:id/decline", protect, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    swap.status = "declined";
    await swap.save();
    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Notify user via in-app notification
router.post("/notify", require("../middleware/auth").protect, async (req, res) => {
  try {
    const Notification = require("../models/Notification")
    const { userId, title, body } = req.body
    const notification = await Notification.create({
      userId, title, body, type: "session_reminder"
    })
    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router;