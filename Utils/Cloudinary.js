const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "semimoreno",
  api_key: "961372288713766",
  api_secret: "Af4AeKs-LZnxKgbcZWPfFf3qf_8",
});

module.exports = cloudinary;
