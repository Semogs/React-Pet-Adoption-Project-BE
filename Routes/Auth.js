const express = require("express");
const router = express.Router();
const User = require("../models/SignupModels");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  phoneNumber: Joi.number().min(9),
});

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { error } = signupSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  const saltPassword = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(req.body.password, saltPassword);

  const signedUser = new User({
    email: req.body.email,
    password: securePassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    Admin: "false",
  });
  try {
    const savedUser = await signedUser.save();
    res.send({ savedUser });
  } catch (error) {
    res.status(400).send(error);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const signedUser = await User.findOne({ email: req.body.email });
  if (!signedUser) return res.status(400).send("Email not found!");

  const validPass = await bcrypt.compare(
    req.body.password,
    signedUser.password
  );
  if (!validPass) return res.status(400).send("Invalid password!");

  const token = jwt.sign({ _id: signedUser._id }, process.env.TOKEN_SECRET);
  const data = {
    token: token,
    signedUser: signedUser,
  };

  res.header("auth-token", token).send(data);
});

module.exports = router;
