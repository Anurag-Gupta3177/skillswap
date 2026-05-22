const express = require("express")
const router = express.Router()
const User = require("../models/User")
const SwapRequest = require("../models/SwapRequest")

router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalSwaps = await SwapRequest.countDocuments({ status: "completed" })

    const categoryCounts = {}
    const users = await User.find({}, "skillOffered.category")
    users.forEach(u => {
      const cat = u.skillOffered?.category
      if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    res.json({ totalUsers, totalSwaps, categoryCounts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router