const express = require("express");
const router = express.Router();

const QuestionForm = require("../Models/QuestionForm");
const AnswerForm = require("../Models/AnswerForm");

router.post("/reponseForm/list", async (req, res) => {
  try {
    if (req.fields.title && req.fields.formulaire && req.fields.reponses) {
      const checkForForm = await QuestionForm.findOne({
        _id: req.fields.formulaire._id,
      });
      if (checkForForm) {
        const newReponsesEntry = new AnswerForm({
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

router.post("/reponseForm/delete/all", async (req, res) => {
  try {
    const searchQuestionForm = await QuestionForm.findOne({
      _id: req.fields.formulaireId,
    });

    const searchReponseForm = await AnswerForm.deleteMany({
      formulaire: req.fields.formulaireId,
    });

    searchQuestionForm.reponseFormulaire = [];

    await searchQuestionForm.save();

    res.json(searchQuestionForm);
  } catch (error) {
    res.status("400").json({ message: error.message });
  }
});

router.post("/reponseForm/delete/single", async (req, res) => {
  try {
    if (req.fields.id) {
      const reponseToDelete = await AnswerForm.findByIdAndDelete({
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

module.exports = router;
