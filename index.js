require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const backofficeRoutes = require("./routes/adminLogin");
app.use(backofficeRoutes);

const questionFormRoutes = require("./routes/questionForm");
app.use(questionFormRoutes);

const reponseFormRoutes = require("./routes/reponseForm");
app.use(reponseFormRoutes);

app.get("/", (req, res) => {
  res.json("introuvable");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server launched ! 🦒");
});
