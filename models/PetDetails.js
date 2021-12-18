const mongoose = require("mongoose");

const PetCheckoutDetails = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    petType: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "petdetails" }
);

const model = mongoose.model("PetCheckoutDetails", PetCheckoutDetails);

module.exports = model;
