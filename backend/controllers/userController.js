const User = require("../models/User");

// get profile
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.params.id).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.params.id }
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// update profile
const updateProfile = async (req, res) => {
  try {

    console.log("BODY:", req.body);   // debug
    console.log("ID:", req.params.id); // debug

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {

    console.log("ERROR:", error);  // <-- THIS IS IMPORTANT

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

module.exports = { getProfile, updateProfile, getAllUsers };