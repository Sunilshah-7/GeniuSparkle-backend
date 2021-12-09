const mongoose = require("mongoose");
const User = require("./Users").schema;

const Answer = new mongoose.Schema(
  {
    user: [User],
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

const model = mongoose.model("Answer", Answer);

module.exports = model;
