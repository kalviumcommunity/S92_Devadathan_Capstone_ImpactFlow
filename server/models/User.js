const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);