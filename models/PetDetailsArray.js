const mongoose = require("mongoose");

const PetDetailsArray = new mongoose.Schema(
  {
    petDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PetCheckoutDetails",
      },
    ],
    userid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "petdetailsarray" }
);

const model = mongoose.model("PetDetailsArray", PetDetailsArray);
module.exports = model;
