const router = require("express").Router();
const verify = require("../Middleware/verifyToken");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.DATABASE_ACCESS);

router.post("/", async (req, res) => {
  const result = await client.connect();
  const db = result.db("user");
  const collection = db.collection("pets");

  const allPets = await collection.find({}).toArray();
  const petTypes = req.body.searchPetType;
  const petName = req.body.searchPetName;
  const petStatus = req.body.searchAdoptionStatus;
  const petHeight = req.body.searchHeight;
  const petWeight = req.body.searchWeight;

  let resultArray;
  if (petTypes) {
    const petToFilter = resultArray || allPets;
    resultArray = petToFilter.filter((pet) => {
      return pet.type === petTypes;
    });
  }
  if (petName) {
    const petToFilter = resultArray || allPets;

    resultArray = petToFilter.filter((pet) => {
      return pet.name === petName;
    });
  }
  if (petStatus) {
    const petToFilter = resultArray || allPets;

    resultArray = petToFilter.filter((pet) => {
      return pet.adoptionStatus === petStatus;
    });
  }
  if (petHeight) {
    const petToFilter = resultArray || allPets;

    resultArray = petToFilter.filter((pet) => {
      return pet.height === +petHeight;
    });
  }
  if (petWeight) {
    const petToFilter = resultArray || allPets;

    resultArray = petToFilter.filter((pet) => {
      return pet.weight === +petWeight;
    });
  }

  res.json(resultArray || allPets);
});

module.exports = router;
