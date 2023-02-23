const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

const QuestionForm = require("../Models/QuestionForm");

router.get("/questionForm/single/:id", async (req, res) => {
  try {
    const form = await QuestionForm.findOne({ _id: req.params.id }).populate(
      "answerForm"
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

router.get("/questionForm/all", async (req, res) => {
  try {
    const listForm = await QuestionForm.find();
    const count = await QuestionForm.find().count();

    res.json({ count: count, listForm: listForm });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/questionForm/create", async (req, res) => {
  try {
    const { title, slug, theme, questions, picture } = req.fields;

    const checkForm = await QuestionForm.findOne({ title });

    if (!checkForm) {
      const newForm = new QuestionForm({
        title,
        slug,
        questions,
        picture,
        theme,
      });

      if (req.fields.theme) {
        newForm.theme = theme;
      }

      await newForm.save();
      res.json(newForm);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/questionForm/update", async (req, res) => {
  try {
    if (req.fields.id) {
      let formToUpdate = await QuestionForm.findOne({ _id: req.fields.id });

      if (formToUpdate) {
        formToUpdate.title = req.fields.title;
        formToUpdate.slug = formToUpdate.slug;
        formToUpdate.questions = req.fields.questions;
        formToUpdate.theme = req.fields.theme;
        if (req.fields.picture) {
          formToUpdate.picture = req.fields.picture;
        } else {
          formToUpdate.picture = "";
        }

        await formToUpdate.save();

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

router.post("/questionForm/delete/single", async (req, res) => {
  try {
    if (req.fields.id) {
      const formToDelete = await QuestionForm.findByIdAndDelete({
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
