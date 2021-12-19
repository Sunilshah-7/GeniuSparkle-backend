var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const questions = require("../data").questions;

//middleware
router.use(bodyParser.json());

router.get("/", (req, res) => {
  var randomItem = questions[Math.floor(Math.random() * questions.length)];
  res.send(randomItem);
});

router.post("/", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const username = decoded.username;

    const foundUser = await User.findOne({ username: username });

    if (foundUser) {
      let id = req.body.id;
      questions.forEach((question) => {
        if (question.id === id) {
          const key = Object.keys(question)[1];
          // const answerName = keys[1];
          const answer = req.body[key];
          const correctAnswer = foundUser.answers[key];
          if (answer === correctAnswer) {
            res.send({ message: "Answer is correct" });
          } else {
            res.send({ message: "Answer is incorrect" });
          }
        }
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/reset", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.secretKey);
    const username = decoded.username;

    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
      let hashPassword = await bcrypt.hash(req.body.newPassword, 10);
      foundUser.password = hashPassword;
      foundUser.save();
      res.send({ message: "Password changed successfully" });
    } else {
      res.send({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
