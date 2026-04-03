const express = require("express");
const router = express.Router();
console.log("userController loaded");
const { 
  getProfile, 
  updateProfile, 
  getAllUsers,
  registerUser
} = require("../controllers/userController");

router.post("/register", registerUser);

router.get("/", getAllUsers);

router.get("/profile/:id", getProfile);

router.put("/profile/:id", updateProfile);

module.exports = router;