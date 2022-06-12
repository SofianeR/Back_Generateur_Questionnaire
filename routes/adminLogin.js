const express = require("express");
const router = express.Router();

router.post("/backoffice/login", (req, res) => {
  try {
    const password = "admin";
    if (req.fields.password === password) {
      res.json({ message: "connecté", password: password });
    } else {
      res.json({ error: "incorrect password" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
