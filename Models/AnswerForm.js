const mongoose = require("mongoose");

const AnswerForm = mongoose.model("AnswerForm", {
  title: {
    required: true,
    type: String,
  },

  reponses: Array,

  questionForm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionForm",
  },
});

module.exports = AnswerForm;
