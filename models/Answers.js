const mongoose = require("mongoose");

const Answer = new mongoose.Schema({
  nickname: {
    type: String,
  },
  favfood: {
    type: String,
  },
  favmovie: {
    type: String,
  },
});

const model = mongoose.model("Answer", Answer);

module.exports = model;
