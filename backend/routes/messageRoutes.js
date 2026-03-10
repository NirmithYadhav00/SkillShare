const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:room", async (req, res) => {

  const messages = await Message.find({ room: req.params.room })
    .sort({ createdAt: 1 });

  res.json(messages);

});

module.exports = router;