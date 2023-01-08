const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

router.post("/pictureUpload", async (req, res) => {
  try {
    if (req.files.picture) {
      const result = await cloudinary.uploader.upload(req.files.picture.path);
      res.json(result);
    } else if (req.fields.picture) {
      res.json(req.fields.picture);
    } else {
      res.status(400).json({ message: "Missing picture" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
