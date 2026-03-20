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
      console.log("Joined room:", room);
    });

    socket.on("send_message", async (data) => {
      try {
        const newMessage = new Message(data);
        await newMessage.save();

        socket.to(data.room).emit("receive_message", data);
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