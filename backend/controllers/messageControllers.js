const Message = require("../models/Message");

// GET messages by room
const getMessages = async (req, res) => {
  try {
    console.log("Fetching room:", req.params.room);
    const messages = await Message.find({ room: req.params.room })
      .sort({ createdAt: 1 });

    const formatted = messages.map(msg => ({
      ...msg.toObject(),
      sender: msg.sender?.toString(), // 🔥 FIX HERE
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  SAVE message (optional for REST)
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text, room } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      text,
      room,
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};