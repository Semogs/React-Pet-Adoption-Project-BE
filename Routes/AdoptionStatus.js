const router = require("express").Router();
const verify = require("../Middleware/verifyToken");
const Users = require("../models/SignupModels");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");
dotenv.config();

const client = new MongoClient(process.env.DATABASE_ACCESS);

router.put("/adopt-foster", verify, async (req, res) => {
  let result = await client.connect();
  db = result.db("user");
  collection = db.collection("pets");
  let updatedUser = {};
  try {
    pet = await collection.updateOne(
      { _id: ObjectId(req.body.id) },
      { $set: { adoptionStatus: req.body.adoptionStatus } }
    );
    if (
      req.body.adoptionStatus === "Adopted" ||
      req.body.adoptionStatus === "Fostered"
    ) {
      updatedUser = await Users.updateOne(
        { _id: req.signedUser },
        { $push: { pets: req.body.pet } }
      );
    }
    res.json(pet);
  } catch (error) {
    res.json("error");
  }
});

router.put("/available-pet", verify, async (req, res) => {
  let result = await client.connect();
  db = result.db("user");
  collection = db.collection("pets");
  pet = await collection.updateOne(
    { _id: ObjectId(req.body.id) },
    { $set: { adoptionStatus: "Available" } }
  );
});

router.put("/set-pets", verify, async (req, res) => {
  updatedUser = await Users.updateOne(
    { _id: req.signedUser },
    { $set: { pets: req.body.pets } }
  );
});

router.put("/save", verify, async (req, res) => {
  let result = await client.connect();
  db = result.db("usersDb");
  collection = db.collection("pets");
  let updatedUser = {};

  try {
    if (req.body.isFavorite === true) {
      updatedUser = await Users.updateOne(
        { _id: req.signedUser },
        { $push: { favorite: req.body.pet } }
      );
    }
    if (req.body.isFavorite === false) {
      updatedUser = await Users.updateOne(
        { _id: req.signedUser },
        { $pull: { favorite: { _id: req.body.pet._id } } }
      );
    }
    res.json(pet);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
