const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nickname: {
      type: String,
    },
    favfood: {
      type: String,
    },
    favmovie: {
      type: String,
    },
  },
  { collection: "answers" }
);

const model = mongoose.model("Answer", AnswerSchema);

module.exports = model;
