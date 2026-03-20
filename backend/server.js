const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messageRoutes");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// ✅ MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ✅ MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  console.log("Database name:", mongoose.connection.name);
})
.catch(err => console.log(err));

// ✅ ONLINE USERS MAP (NEW)
global.onlineUsers = new Map();

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🔹 store user socket
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User added:", userId);
  });

  // 🔹 join room (your existing)
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  // 🔹 send message (MERGED)
  socket.on("send_message", async (data) => {
    console.log("Message sent:", data);

    try {
      // save to DB
      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        room: data.room
      });

      await newMessage.save();

      // ✅ send to ROOM (group / chat room)
      io.to(data.room).emit("receive_message", data);

      // ✅ ALSO send directly (1-to-1 real-time)
      const sendUserSocket = onlineUsers.get(data.receiver);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("receive_message", data);
      }

    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ START SERVER
server.listen(5000, () => {
  console.log("Server running on port 5000");
});