var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const users = require("../data").userDB;
//const questions = require("../data").questions;
const answers = require("../data").answers;
const bcrypt = require("bcrypt");

router.use(bodyParser.json());

router.post("/", async (req, res) => {
  try {
    let foundUser = users.find((data) => req.body.email === data.email);
    if (!foundUser) {
      let hashPassword = await bcrypt.hash(req.body.password, 10);

      let newUser = {
        id: Date.now(),
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      };
      users.push(newUser);
      console.log("User list", users);

      res.send(
        `<div align ='center'><h2>Registration successful</h2></div><br>
        <div align="center">
        <a href='./questions.html'>Questions</a>
        </div>
        <br>
        `
      );
    } else {
      res.send(
        "<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

router.post("/questions", async (req, res, next) => {
  try {
    let answersList = {
      id: '1',
      answer1: req.body.question1,
      answer2: req.body.question2,
      answer3: req.body.question3,
    };

    answers.push(answersList);
    console.log("Answers list", answers);
    res.send(`
    <h1>Thank you for your answers!</h1>
    <div align='center'>
        <a href='/login.html'>login</a>
        </div>
        <br><br>
        <div align='center'>
        <a href='/registration.html'>Register another user</a>
        </div>
    `);
  } catch (err) {
    res.send("Internal server error");
  }
});

module.exports = router;
