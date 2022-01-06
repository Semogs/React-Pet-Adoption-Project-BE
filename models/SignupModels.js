const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    min: 6,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  pets: {
    type: Array,
  },
  favorite: {
    type: Array,
  },
  Admin: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
