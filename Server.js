const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/Auth");
const cors = require("cors");
const petRoute = require("./Routes/GetPet");
const addPet = require("./Routes/AddPet");
const userRoute = require("./Routes/GetUser");
const updateUserRoute = require("./Routes/UpdateUser");
const searchRoute = require("./Routes/Search");
const statusRoute = require("./Routes/AdoptionStatus");

dotenv.config();

mongoose.connect(process.env.DATABASE_ACCESS, () =>
  console.log("Database connected")
);

app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/profile", updateUserRoute);
app.use("/add-pet", addPet);
app.use("/pet", petRoute);
app.use("/search", searchRoute);
app.use("/status", statusRoute);
app.listen(4000, () => console.log("Server is running"));
