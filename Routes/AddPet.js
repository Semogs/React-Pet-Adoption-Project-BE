const router = require("express").Router();
const Joi = require("@hapi/joi");
const verify = require("../Middleware/verifyToken");
const Pet = require("../models/PetModel");
const cloudinary = require("../Utils/Cloudinary");
const upload = require("../Utils/Multer");

const addPetSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  adoptionStatus: Joi.string().required(),
  height: Joi.string().max(3).required(),
  weight: Joi.string().max(3).required(),
  color: Joi.string().required(),
  bio: Joi.string().max(250),
  hypoallergenic: Joi.string().required(),
  breed: Joi.string().max(50).required(),
  dietary: Joi.string().max(55),
});

router.post("/", verify, upload.single("image"), async (req, res) => {
  const { error } = addPetSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.file) return res.status(400).send("no path");
  const result = await cloudinary.uploader.upload(req.file.path);

  const pet = new Pet({
    type: req.body.type,
    name: req.body.name,
    adoptionStatus: req.body.adoptionStatus,
    image: result.secure_url,
    cloudinary_id: result?.public_id,
    height: req.body.height,
    weight: req.body.weight,
    color: req.body.color,
    bio: req.body.bio,
    hypoallergenic: req.body.hypoallergenic,
    breed: req.body.breed,
    dietary: req.body.dietary,
  });

  try {
    const savedPet = await pet.save();
    res.json(savedPet);
  } catch (err) {
    res.json({ message: error });
  }
});

module.exports = router;
