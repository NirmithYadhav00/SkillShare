const express = require("express");
const router = express.Router();
console.log("userController loaded");
const protect = require("../middleware/authMiddleware");
const { 
  getProfile, 
  updateProfile, 
  getAllUsers,
  registerUser
} = require("../controllers/userController");

router.post("/register", registerUser);

router.get("/", getAllUsers);

router.get("/profile/:id", getProfile);

router.put("/profile/:id", protect, updateProfile);

module.exports = router;
