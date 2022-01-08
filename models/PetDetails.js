const mongoose = require("mongoose");

const PetCheckoutDetails = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
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

// const PetDetailsArray = new mongoose.Schema(
//   {
//     petDetails: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "PetCheckoutDetails",
//       },
//     ],
//   },
//   { collection: "petdetailsarray" }
// );

const model = mongoose.model("PetCheckoutDetails", PetCheckoutDetails);

module.exports = model;
// module.exports = mongoose.model("PetDetailsArray", PetDetailsArray);
