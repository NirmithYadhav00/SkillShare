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
const server = http.createServer(app);   //  create http server

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  console.log("Database name:", mongoose.connection.name);
})
.catch(err => console.log(err));

// Socket connection
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("send_message", async (data) => {

    console.log("Message sent to room:", data.room);

    const newMessage = new Message({
      sender: data.sender,
      receiver: data.receiver,
      text: data.text,
      room: data.room
    });

    await newMessage.save();

    io.to(data.room).emit("receive_message", data);

  });

});

//  IMPORTANT: use server.listen instead of app.listen
server.listen(5000, () => {
  console.log("Server running on port 5000");
});