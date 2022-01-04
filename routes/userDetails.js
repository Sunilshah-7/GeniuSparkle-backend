var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const username = decoded.username;

    const foundUser = await User.findOne({ username: username }).select(
      "name username _id answers amountPaid insuranceLimit insuranceUsed insuranceStatus monthsRemaining"
    );

    if (foundUser) {
      res.status(200).send(foundUser);
    } else {
      res.status(400).send({ status: "error", message: "User not found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
