var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
//const users = require("../data").userDB;
const questions = require("../data").questions;
// const answers = require("../data").answers;
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Answer = require("../models/Answers");

router.use(bodyParser.json());

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
      });

      newUser.save();

      res.status(200).send({ status: "success", message: "User added successfully" });
    } else {
      res.status(400).send({ status: "error", message: "Username already exists" });
    }
  } catch {
    res.status(400).send("Internal server error");
  }
});

router.get("/questions", async (req, res) => {
  console.log("questions", questions);
  try {
    res.send(questions);
  } catch {
    res.send("Internal server error");
  }
});

router.post("/questions", async (req, res) => {
  try {
    console.log(req.body);
    let answersList = new Answer({
      nickname: req.body.nickname,
      favfood: req.body.favfood,
      favmovie: req.body.favmovie,
    });

    answersList
      .save()
      .then((data) => {
        console.log("Added to answers" + data);
      })
      .catch((err) => {
        console.log("Couldnot add to answers" + err);
      });

    res
      .status(200)
      .send({ status: "success", message: "Answers added successfully" });
  } catch (err) {
    res.send("Answers couldnot be added");
  }
});

module.exports = router;
