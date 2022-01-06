const router = require("express").Router();
const verify = require("../Middleware/verifyToken");
const Pets = require("../models/PetModel");
const cloudinary = require("../Utils/Cloudinary");
const upload = require("../Utils/Multer");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");
dotenv.config();

const client = new MongoClient(process.env.DATABASE_ACCESS);

router.get("/", verify, async (req, res) => {
  try {
    const pets = await Pets.find();
    res.json(pets);
  } catch (err) {
    res.json({ message: err });
  }
  res.send(req.signedUser);
});

router.get("/:id", verify, async (req, res) => {
  try {
    const pet = await Pets.findById(req.params.id);
    res.json(pet);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", verify, upload.single("image"), async (req, res) => {
  let result = await client.connect();
  db = result.db("user");
  collection = db.collection("pets");

  try {
    let editedPet = {};
    if (req.body.type) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { type: req.body.type } }
      );
    }
    if (req.body.name) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { name: req.body.name } }
      );
    }
    if (req.body.adoptionStatus) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { adoptionStatus: req.body.adoptionStatus } }
      );
    }
    if (req.body.image) {
      let client = await collection.findOne({ _id: ObjectId(req.params.id) });
      if (client.cloudinary_id) {
        await cloudinary.uploader.destroy(client.cloudinary_id);
      }
      const result = await cloudinary.uploader.upload(req.body.image);
      editedPet = await collection.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            image: result?.secure_url,
            cloudinary_id: result?.public_id,
          },
        }
      );
    }
    if (req.body.height) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { height: req.body.height } }
      );
    }
    if (req.body.weight) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { weight: req.body.weight } }
      );
    }
    if (req.body.color) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { color: req.body.color } }
      );
    }
    if (req.body.bio) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { bio: req.body.bio } }
      );
    }
    if (req.body.hypoallergenic) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { hypoallergenic: req.body.hypoallergenic } }
      );
    }
    if (req.body.breed) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { breed: req.body.breed } }
      );
    }
    if (req.body.dietary) {
      editedPet = await Pets.updateOne(
        { _id: ObjectId(req.params.id) },

        { $set: { dietary: req.body.dietary } }
      );
    }
    res.json(editedPet);
  } catch (err) {
    res.json({ message: error });
  }
});

module.exports = router;
