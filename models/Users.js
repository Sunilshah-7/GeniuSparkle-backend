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
    amountPaid: {
      type: Number,
    },
    insuranceLimit: {
      type: Number,
    },
    insuranceUsed: {
      type: Number,
    },
    monthsRemaining: {
      type: Number,
    },
    insuranceStatus: {
      type: Boolean,
    },
  },
  { collection: "users" }
);

const model = mongoose.model("User", User);

module.exports = model;
