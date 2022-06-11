const mongoose = require("mongoose");

const QuestionForm = mongoose.model("QuestionForm", {
  title: {
    required: true,
    type: String,
  },

  slug: {
    required: true,
    unique: true,
    type: String,
  },

  theme: Object,
  picture: String,

  questions: Array,

  answerForm: [{ type: mongoose.Schema.Types.ObjectId, ref: "AnswerForm" }],
});

module.exports = QuestionForm;
