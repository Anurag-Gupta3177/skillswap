const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { sendVerificationEmail } = require("../utils/email")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" })
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const user = await User.create({
      name, email, password,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false
    })
    await sendVerificationEmail(email, name, verificationToken)
    res.status(201).json({
      message: "Account created! Check your email to verify."
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// VERIFY EMAIL
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpiry: { $gt: Date.now() }
    })
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=expired`)
    }
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiry = undefined
    await user.save()
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first! Check your inbox 📧",
        notVerified: true
      })
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      onboardingComplete: user.onboardingComplete,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// RESEND VERIFICATION
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.isVerified) return res.status(400).json({ message: "Already verified" })
    const verificationToken = crypto.randomBytes(32).toString("hex")
    user.verificationToken = verificationToken
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()
    await sendVerificationEmail(email, user.name, verificationToken)
    res.json({ message: "Verification email resent!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const passport = require("passport")
require("../config/passport")

// GOOGLE AUTH - Start
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// GOOGLE AUTH - Callback
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user._id)
    const onboarding = req.user.onboardingComplete
    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&onboarding=${onboarding}`
    )
  }
)

module.exports = router