const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getMessages,
  sendMessage,
} = require("../controllers/messageControllers");

// GET messages by room (your existing logic moved to controller)
router.get("/:room", protect, getMessages);

// OPTIONAL: send message via API (not required but useful)
router.post("/", protect, sendMessage);

module.exports = router;
