const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const roadmapTopicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  order: { type: Number },
})

const availabilitySchema = new mongoose.Schema({
  day: { type: String },
  slots: [{ type: String }],
})

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    profilePhoto: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 200 },
    location: { type: String, default: "" },
    isRemote: { type: Boolean, default: true },
    skillOffered: {
      name: { type: String, default: "" },
      category: { type: String, default: "" },
      level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        default: "Beginner",
      },
      roadmap: [roadmapTopicSchema],
    },
    skillWanted: { type: String, default: "" },
    availability: [availabilitySchema],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSwaps: { type: Number, default: 0 },
    totalHoursTaught: { type: Number, default: 0 },
    badges: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)