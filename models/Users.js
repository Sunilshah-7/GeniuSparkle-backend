const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    answers: {
      type: Object,
    },
  },
  { collection: "users" }
);

const model = mongoose.model("User", User);

module.exports = model;