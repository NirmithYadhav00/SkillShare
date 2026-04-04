const User = require("../models/User");
const jwt = require("jsonwebtoken");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check existing email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password
    });

    await user.save();

  res.status(201).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id)
});

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString(); // from token
    const requestedUserId = req.params.id;

    // 🔥 SECURITY CHECK
    if (loggedInUserId !== requestedUserId) {
      return res.status(403).json({
        message: "You can only edit your own profile"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      requestedUserId,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerUser,
  getProfile,
  updateProfile,
  getAllUsers
};