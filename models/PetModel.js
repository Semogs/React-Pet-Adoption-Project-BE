const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  name: {
    type: String,
    trim: true,
  },
  adoptionStatus: {
    type: String,
  },
  image: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  height: {
    type: String,
    trim: true,
  },
  weight: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  hypoallergenic: {
    type: String,
    trim: true,
  },
  breed: {
    type: String,
    trim: true,
  },
  dietary: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("pet", petSchema);
