const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route GET /api/users/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/users/me
router.put("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const {
      name, bio, location, isRemote,
      skillOffered, skillWanted,
      availability, onboardingComplete,
    } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (isRemote !== undefined) user.isRemote = isRemote;
    if (skillOffered) user.skillOffered = skillOffered;
    if (skillWanted) user.skillWanted = skillWanted;
    if (availability) user.availability = availability;
    if (onboardingComplete !== undefined)
      user.onboardingComplete = onboardingComplete;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/users/matches
router.get("/matches", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const allUsers = await User.find({ _id: { $ne: req.user._id } });

    const matches = allUsers
      .map((user) => {
        let score = 0;

        // Skill match +50
        if (
          user.skillOffered.name === currentUser.skillWanted &&
          user.skillWanted === currentUser.skillOffered.name
        ) {
          score += 50;
        } else if (
          user.skillOffered.name === currentUser.skillWanted ||
          user.skillWanted === currentUser.skillOffered.name
        ) {
          score += 25;
        }

        // Level compatibility +20
        if (user.skillOffered.level === currentUser.skillOffered.level) {
          score += 20;
        }

        // Location match +10
        if (user.isRemote && currentUser.isRemote) score += 10;

        return { user, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ user, score }) => ({
        _id: user._id,
        name: user.name,
        profilePhoto: user.profilePhoto,
        location: user.location,
        skillOffered: user.skillOffered,
        skillWanted: user.skillWanted,
        rating: user.rating,
        totalSwaps: user.totalSwaps,
        matchScore: score,
      }));

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/users/search
router.get("/search", protect, async (req, res) => {
  try {
    const { skill, category, level } = req.query;
    let query = { _id: { $ne: req.user._id } };

    if (skill) {
      query["skillOffered.name"] = { $regex: skill, $options: "i" };
    }
    if (category) {
      query["skillOffered.category"] = category;
    }
    if (level) {
      query["skillOffered.level"] = level;
    }

    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/users/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;