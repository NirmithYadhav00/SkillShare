const express = require("express");
const {
  sendRequest,
  getStatus,
  acceptRequest
} = require("../controllers/connectionControllers");
const authMiddleware = require("../middleware/authMiddleware");
const Connection = require("../models/connection");

const router = express.Router();

router.post("/send/:userId", authMiddleware, sendRequest);
router.get("/status/:userId", authMiddleware, getStatus);
router.put("/accept/:id", authMiddleware, acceptRequest);

// ✅ FIXED: move this up + add authMiddleware
router.put("/reject/:id", authMiddleware, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Not found" });
    }

    await Connection.findByIdAndDelete(req.params.id);

    res.json({ message: "Connection rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;