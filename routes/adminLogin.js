const express = require("express");
const router = express.Router();

router.post("/backoffice/login", (req, res) => {
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

module.exports = router;
