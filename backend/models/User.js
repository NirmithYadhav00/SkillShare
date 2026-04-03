const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: ""
  },

  branch: {
    type: String,
    default: ""
  },

  year: {
    type: String,
    default: ""
  },

  skillsOffered: {
    type: [String],
    default: []
  },

  skillsWanted: {
    type: [String],
    default: []
  }

});

module.exports = mongoose.model("User", userSchema);
