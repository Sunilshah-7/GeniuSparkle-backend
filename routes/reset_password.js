var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

//middleware
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("reset password");
});

router.post("/", async (req, res) => {
  try {
    let username = req.body.username;
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
