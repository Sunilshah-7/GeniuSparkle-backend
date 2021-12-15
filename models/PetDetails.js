const mongoose = require("mongoose");

const PetDetails = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age:{
        type:Number,
    },
    image:{
        type:String,
    },
    petType:{
        type:String,
    }
  },
  { collection: "petdetails" }
);

const model = mongoose.model("PetDetails", PetDetails);

module.exports = model;
