const express = require("express");
const router = express.Router();

const { getProfile, updateProfile, getAllUsers } = require("../controllers/userController");

router.get("/profile/:id", getProfile);
router.get("/", getAllUsers);

router.put("/profile/:id", updateProfile);

module.exports = router;