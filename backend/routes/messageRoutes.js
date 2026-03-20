const express = require("express");
const router = express.Router();

const {
  getMessages,
  sendMessage,
} = require("../controllers/messageControllers");

// GET messages by room (your existing logic moved to controller)
router.get("/:room", getMessages);

// OPTIONAL: send message via API (not required but useful)
router.post("/", sendMessage);

module.exports = router;