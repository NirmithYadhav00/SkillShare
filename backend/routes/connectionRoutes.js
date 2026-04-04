const express = require("express");
const {
  sendRequest,
  getStatus,
  acceptRequest
} = require("../controllers/connectionControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send/:userId", authMiddleware, sendRequest);
router.get("/status/:userId", authMiddleware, getStatus);
router.put("/accept/:id", authMiddleware, acceptRequest);
module.exports = router;
