require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());

app.use(cors());

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sofiane",
  api_key: "733266457446219",
  api_secret: "KtpGfIOjWpV_ZYJdu-KIWOE-pww",
});

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/generateurForm");

const Formulaire = mongoose.model("Formulaire", {
  title: {
    required: true,
    type: String,
  },
  slug: String,

  theme: Object,
  picture: String,

  questions: Array,

  reponseFormulaire: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ResponsesFormulaire" },
  ],
});

const ReponsesFormulaires = mongoose.model("ResponsesFormulaire", {
  title: {
    required: true,
    type: String,
  },
  reponses: Array,
  formulaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formulaire",
  },
});

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

app.get("/formList", async (req, res) => {
  try {
    const listForm = await Formulaire.find();
    const count = await Formulaire.find().count();

    res.json({ count: count, listForm: listForm });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/form/:id", async (req, res) => {
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

app.post("/createForm", async (req, res) => {
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

app.post("/updateForm", async (req, res) => {
  try {
    console.log(req.files, typeof req.fields.picture);
    if (req.fields.id) {
      const formToUpdate = await Formulaire.findOne({ _id: req.fields.id });
      if (formToUpdate) {
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

app.post("/reponseForm", async (req, res) => {
  try {
    if (req.fields.title && req.fields.formulaire && req.fields.reponses) {
      const checkForForm = await Formulaire.findOne({
        _id: req.fields.formulaire._id,
      });
      if (checkForForm) {
        const newReponsesEntry = new ReponsesFormulaires({
          title: req.fields.title,
          reponses: req.fields.reponses,
          formulaire: req.fields.formulaire,
        });
        await newReponsesEntry.save();

        checkForForm.reponseFormulaire.push(newReponsesEntry);

        await checkForForm.save();

        res.json(newReponsesEntry);
      } else {
        res.status(400).json({ message: "can't find form" });
      }
    } else {
      res.status(400).json({ message: "form fileds missing" });
    }
  } catch (error) {
    res.status(400).json({ message: "CATCH DE SES MORTS" + error.message });
  }
});

app.post("/deleteAllResponse", async (req, res) => {
  try {
    const searchQuestionForm = await Formulaire.findOne({
      _id: req.fields.formulaireId,
    });

    const searchReponseForm = await ReponsesFormulaires.deleteMany({
      formulaire: req.fields.formulaireId,
    });

    searchQuestionForm.reponseFormulaire = [];
    await searchQuestionForm.save();
    res.json(searchQuestionForm);
  } catch (error) {
    res.status("400").json({ message: error.message });
  }
});

app.post("/deleteReponse", async (req, res) => {
  try {
    if (req.fields.id) {
      const reponseToDelete = await ReponsesFormulaires.findByIdAndDelete({
        _id: req.fields.id,
      });
      res.json(reponseToDelete);
    } else {
      res.json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.json("introuvable");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server launched ! 🦒");
});
