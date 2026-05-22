const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const crypto = require("crypto")

const User = require("../models/User")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value

        if (!email) {
          return done(new Error("No email found from Google"), null)
        }

        let user = await User.findOne({ email })

        // Existing user
        if (user) {
          return done(null, user)
        }

        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: email,

          // Random password for Google users
          password: crypto
            .randomBytes(16)
            .toString("hex"),

          profilePhoto:
            profile.photos?.[0]?.value || "",

          isVerified: true,
        })

        return done(null, user)

      } catch (error) {
        console.error("Google Auth Error:", error)
        return done(error, null)
      }
    }
  )
)

module.exports = passport