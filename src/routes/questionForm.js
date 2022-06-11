const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

router.get("/questionForm/:id", async (req, res) => {
  try {
    // console.log("dans la route => ", req.params);

    const form = await Formulaire.findOne({ _id: req.params.id }).populate(
      "reponseFormulaire"
    );
    if (form) {
      res.json(form);
    } else {
      res.status(400).json("Form not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/questionForm/list", async (req, res) => {
  try {
    const listForm = await Formulaire.find();
    const count = await Formulaire.find().count();

    res.json({ count: count, listForm: listForm });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/questionForm/create", async (req, res) => {
  try {
    const { titleForm, slug, theme, questions } = req.fields;
    console.log(questions);

    const checkForm = await Formulaire.findOne({ title: titleForm });

    if (!checkForm) {
      const newForm = new Formulaire({
        title: titleForm,
        slug: slug,
        questions: questions,
      });

      if (req.files.picture) {
        const result = await cloudinary.uploader.upload(req.files.picture.path);
        newForm.picture = result.secure_url;
      }

      if (req.fields.theme) {
        newForm.theme = theme;
      }

      await newForm.save();
      res.json(newForm);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/questionForm/update", async (req, res) => {
  try {
    if (req.fields.id) {
      const formToUpdate = await Formulaire.findOne({ _id: req.fields.id });
      if (formToUpdate) {
        console.log("ici");
        formToUpdate.title = req.fields.titleForm;
        formToUpdate.questions = req.fields.questions;
        formToUpdate.theme = req.fields.theme;

        if (req.fields.picture !== "undefined") {
          console.log("avant await cloudinary");

          const result = await cloudinary.uploader.upload(
            req.files.picture.path
          );
          console.log("apres await cloudinary");

          formToUpdate.picture = result.secure_url;
        }
        console.log("avant save");
        await formToUpdate.save();
        console.log("apres save");
        res.json(formToUpdate);
      } else {
        res.status(400).json("Form not found");
      }
    } else {
      res.status(400).json({ error: { message: "Unauthorized" } });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/deleteForm", async (req, res) => {
  try {
    if (req.fields.id) {
      const formToDelete = await Formulaire.findByIdAndDelete({
        _id: req.fields.id,
      });
      if (formToDelete) {
        res.json(formToDelete);
      } else {
        res.status(400).json("error occured can't find form");
      }
    } else {
      res.status(400).json("Unauthorized");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
