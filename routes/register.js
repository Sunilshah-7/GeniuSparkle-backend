var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const questions = require("../data").questions;
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Answer = require("../models/Answers");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    if (!foundUser) {
      let hashPassword = await bcrypt.hash(req.body.password, 10);

      let newUser = new User({
        id: Date.now(),
        name: req.body.name,
        username: req.body.username,
        password: hashPassword,
        amountPaid: 0,
        insuranceLimit:0,
        insuranceUsed:0,
        monthsRemaining:0,
        insuranceStatus:false,
      });

      let token = jwt.sign(
        { username: newUser.username },
        process.env.secretKey,
        {
          expiresIn: "1h",
        }
      );
      newUser.save();

      res.status(200).send({
        status: "success",
        message: "User added successfully",
        token: token,
      });
    } else {
      res
        .status(400)
        .send({ status: "error", message: "Username already exists" });
    }
  } catch {
    res.status(400).send("Internal server error");
  }
});

router.get("/questions", async (req, res) => {
  try {
    res.send(questions);
  } catch {
    res.send("Internal server error");
  }
});

router.post("/questions", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (!token) {
      res.status(401).send({ status: "error", message: "No token provided" });
    } else {
      const decoded = jwt.verify(token, process.env.secretKey);
      const username = decoded.username;

      let answersList = new Answer({
        nickname: req.body.nickname,
        favfood: req.body.favfood,
        favmovie: req.body.favmovie,
      });

      const foundUser = await User.findOneAndUpdate(
        { username: username },
        { answers: answersList },
        {
          new: true,
        }
      );

      foundUser.save();

      res.status(200).send({
        status: "success",
        message: "Answers added successfully to User",
      });
    }
  } catch (err) {
    res.send("Answers couldnot be added");
  }
});

module.exports = router;
