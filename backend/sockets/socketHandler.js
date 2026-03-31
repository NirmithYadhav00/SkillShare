const Message = require("../models/Message");

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
 console.log("Saving room:", data.room);

const newMessage = new Message({
  senderId: data.sender,      // ✅ FIX
  receiverId: data.receiver,  // ✅ FIX
  room: data.room,
  text: data.text,
});    await newMessage.save();
const clients = io.sockets.adapter.rooms.get(data.room);
console.log("Room:", data.room);
console.log("Users in room:", clients ? clients.size : 0);
    const formattedMessage = {
      ...newMessage.toObject(),
      sender: newMessage.sender.id,
    };

    io.to(data.room).emit("receive_message", formattedMessage);

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