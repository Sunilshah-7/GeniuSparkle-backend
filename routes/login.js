var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
// const users = require("../data").userDB;
const bcrypt = require("bcrypt");
const answers = require("../data").answers;
const User = require("../models/Users");

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("login page");
});

router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const foundUser = await User.findOne({ username: req.body.username });
    console.log(foundUser);

    if (foundUser) {
      let submittedPass = req.body.password;
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let username = foundUser.username;
        res.status(200).send({ status: "success", username: username });
      } else {
        res
          .status(400)
          .send({ status: "error", message: "Incorrect password" });
      }
    } else {
      let fakePass = `$2b$$10$`;
      await bcrypt.compare(req.body.password, fakePass);

      res.status(400).send({ status: "error", message: "User not found" });
    }
  } catch {
    res.status(500).send("Internal server error");
  }
});

router.post("/:id", async (req, res) => {
  try {
    // let answerfound = await answers.find();
    let answerfound = await answers.find((data) => req.params.id === data.id);
    if (answerfound) {
      let answerNo = "answer" + req.params.id;
      let answer = answerfound[answerNo];
      console.log("User answer" + answer);
      let submittedAnswer = req.body.answer;
      if (answer === submittedAnswer) {
        res.send(
          `<div align ='center'>
          <h2>login successful</h2>
          </div>
          <br><br><br>
          <div align='center'><a href='/register.html'>Register again<a><div>
          `
        );
      } else {
        res.send(
          `<div align ='center'>
          <h2>Answer didn't match.</h2>
          </div>
          <br><br><br>
          <div align='center'><a href='/login.html'>Login again<a><div>
          `
        );
      }
    }
    //answer1
    console.log("Answers are found", answerfound);
  } catch (err) {
    res.send("Post on login security questions not found.");
  }
});

module.exports = router;
