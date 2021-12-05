var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const users = require("../data").userDB;
const bcrypt = require("bcrypt");
const answers = require("../data").answers;

router.use(bodyParser.json());
router.get("/", (req, res) => {
  res.send("login page");
});
router.post("/", async (req, res) => {
  try {
    let foundUser = users.find((data) => req.body.email === data.email);
    if (foundUser) {
      let submittedPass = req.body.password;
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let username = foundUser.username;
        res.send(
          `<div align ='center'>
          <h2>login successful</h2>
          </div>
          <br><br><br>
          <div align ='center'>
          <h3>Hello ${username}</h3>
          </div>
          <br>
          <div align='center'>
          <a href='./loginquestion.html'>Confirm your login through security question</a>
          </div>
          <br>
          <div align='center'>
          <a href='./login.html'>logout</a>
          </div>`
        );
      } else {
        res.send(
          "<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>"
        );
      }
    } else {
      let fakePass = `$2b$$10$`;
      await bcrypt.compare(req.body.password, fakePass);

      res.send(
        "<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>"
      );
    }
  } catch {
    res.send("Internal server error");
  }
});

router.post("/:id", async (req, res) => {
  try {
    // let answerfound = await answers.find();
    let answerfound = await answers.find((data) => req.params.id === data.id);
    if(answerfound){
      let answerNo = "answer" + req.params.id;
      let answer = answerfound[answerNo];
      console.log("User answer"+answer);
      let submittedAnswer = req.body.answer;
      if(answer === submittedAnswer){
        res.send(
          `<div align ='center'>
          <h2>login successful</h2>
          </div>
          <br><br><br>
          <div align='center'><a href='/register.html'>Register again<a><div>
          `
        );
      }else{
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
