const mongoose = require("mongoose");

const AdminUser = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
    },
  },
  { collection: "admin_user" }
);

const model = mongoose.model("admin_user", AdminUser);

module.exports = model;
