const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;