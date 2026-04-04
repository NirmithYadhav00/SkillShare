const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.put("/profile/:id", protect, updateProfile);

module.exports = router;