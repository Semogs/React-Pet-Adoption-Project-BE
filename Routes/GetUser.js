const express = require("express");
const verify = require("../Middleware/verifyToken");
const router = express.Router();
const Users = require("../models/SignupModels");

router.get("/", verify, async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }

  res.send(req.signedUser);
});

router.get("/current", verify, async (req, res) => {
  try {
    const currentUser = await Users.findOne({ _id: req.signedUser });
    res.json(currentUser);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
