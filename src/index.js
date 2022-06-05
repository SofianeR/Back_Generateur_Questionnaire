require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());

app.use(cors());

app.post("/login", (req, res) => {
  try {
    if (req.fields.password === "admin") {
      res.json({ message: "connecté" });
    } else {
      res.json({ message: "incorrect password" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/", (req, res) => {
  res.json("introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server launched ! 🦒");
});
