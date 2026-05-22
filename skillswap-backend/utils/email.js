const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `http://localhost:5000/api/auth/verify-email/${token}`

  await transporter.sendMail({
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your SkillSwap account",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
        <h1 style="color:#6C3BFF">SkillSwap 🔄</h1>
        <h2>Welcome ${name}! 🎉</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyUrl}"
           style="background:#6C3BFF;color:white;padding:12px 24px;
                  border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
          Verify Email ✅
        </a>
        <p style="color:#999;font-size:13px">Link expires in 24 hours.</p>
      </div>
    `
  })
}

module.exports = { sendVerificationEmail }