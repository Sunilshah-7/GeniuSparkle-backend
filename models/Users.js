const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    role:{
      type:String,
      enum:["admin","user"],
    }
  },
  { collection: "users" }
);

const model = mongoose.model("User", User);

module.exports = model;
