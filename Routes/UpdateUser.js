const router = require("express").Router();
const verify = require("../Middleware/verifyToken");
const Joi = require("@hapi/joi");
const UpdateUser = require("../models/SignupModels");
const cloudinary = require("../Utils/Cloudinary");
const upload = require("../Utils/Multer");

const updateUserSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string().min(6),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.number().max(12),
  bio: Joi.string().max(250),
});

router.put("/", verify, upload.single("avatar"), async (req, res) => {
  console.log(req.body);
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let updatedUser = {};
    if (req.body.email) {
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { email: req.body.email } }
      );
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { password: hashedPassword } }
      );
    }
    if (req.body.firstName) {
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { firstName: req.body.firstName } }
      );
    }
    if (req.body.lastName) {
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { lastName: req.body.lastName } }
      );
    }
    if (req.file) {
      const client = await UpdateUser.findOne({ _id: req.signedUser });
      if (client.cloudinary_id) {
        await cloudinary.uploader.destroy(client.cloudinary_id);
      }
      if (!req.file) return res.status(400).send("no path");
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        {
          $set: {
            avatar: result?.secure_url,
            cloudinary_id: result?.public_id,
          },
        }
      );
    }
    if (req.body.phoneNumber) {
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { phoneNumber: req.body.phoneNumber } }
      );
    }
    if (req.body.bio) {
      updatedUser = await UpdateUser.updateOne(
        { _id: req.signedUser },
        { $set: { bio: req.body.bio } }
      );
    }

    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
