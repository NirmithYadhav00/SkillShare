const Message = require("../models/Message");
const Connection = require("../models/connection");

const onlineUsers = new Map();
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User online:", userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

socket.on("join_room", (room) => {
  socket.join(room);

  const clients = io.sockets.adapter.rooms.get(room);

  console.log("Room:", room);
  console.log("Users in room:", clients ? clients.size : 0);
});
socket.on("send_message", async (data) => {
  try {
    const { sender, receiver, room, text } = data;

    // 🚫 Block empty messages
    if (!text || !text.trim()) return;

    // 🔍 CHECK CONNECTION
    const connection = await Connection.findOne({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender }
      ]
    });

    if (!connection || connection.status !== "accepted") {
      console.log("❌ Not connected - message blocked");

      // 🔥 Send error BACK to sender only
      socket.emit("message_error", {
        message: "You can only message connected users"
      });

      return;
    }

    // ✅ Save message
    const newMessage = new Message({
      senderId: sender,
      receiverId: receiver,
      room,
      text,
    });

    await newMessage.save();

    const formattedMessage = {
      ...newMessage.toObject(),
      sender: newMessage.senderId,
      receiver: newMessage.receiverId,
    };

    // 📡 Send to room
    io.to(room).emit("receive_message", formattedMessage);

  } catch (err) {
    console.error(err);
  }
});

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
        for (let [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit("online-users", Array.from(onlineUsers.keys()));    
    });
  });
};

module.exports = socketHandler;
