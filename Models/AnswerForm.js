const mongoose = require("mongoose");

const AnswerForm = mongoose.model("ResponsesFormulaire", {
  title: {
    required: true,
    type: String,
  },

  reponses: Array,

  formulaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionForm",
  },
});

module.exports = AnswerForm;
