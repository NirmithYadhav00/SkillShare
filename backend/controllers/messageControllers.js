const Message = require("../models/Message");
const Connection = require("../models/connection");

// GET messages by room
const getMessages = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || req.user?.id;
    const room = req.params.room;

    const messages = await Message.find({ room }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.json([]);
    }

    const isParticipant = messages.some(
      (msg) =>
        String(msg.senderId || msg.sender) === String(userId) ||
        String(msg.receiverId || msg.receiver) === String(userId)
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const formatted = messages.map((msg) => ({
      ...msg.toObject(),
      sender: String(msg.senderId || msg.sender || ""),
      receiver: String(msg.receiverId || msg.receiver || ""),
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const sender = req.user?._id?.toString() || req.user?.id;
    const { receiver, room, text } = req.body;

    if (!sender || !receiver || !room || !text?.trim()) {
      return res.status(400).json({ message: "sender, receiver, room and text are required" });
    }

    const connection = await Connection.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (!connection || connection.status !== "accepted") {
      return res.status(403).json({ message: "You can only message connected users" });
    }

    const newMessage = await Message.create({
      senderId: sender,
      receiverId: receiver,
      room,
      text: text.trim(),
    });

    return res.status(201).json({
      ...newMessage.toObject(),
      sender: String(newMessage.senderId || ""),
      receiver: String(newMessage.receiverId || ""),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
