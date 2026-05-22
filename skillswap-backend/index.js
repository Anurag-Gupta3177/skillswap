const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const connectDB = require("./config/db")

connectDB()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://skillswap.vercel.app",
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ["GET", "POST"]
  }
})
const passport = require("passport")

app.use(passport.initialize())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skillswap.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/swaps", require("./routes/swaps"))
app.use("/api/messages", require("./routes/messages"))
app.use("/api/sessions", require("./routes/sessions"))
app.use("/api/stats", require("./routes/stats"))

app.get("/", (req, res) => {
  res.json({ message: "SkillSwap API is running!" })
})

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join_swap_room", (swapId) => {
    socket.join(swapId)
    console.log(`User joined room: ${swapId}`)
  })

  socket.on("send_message", (data) => {
    io.to(data.swapId).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})



const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))