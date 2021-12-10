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

router.get("/", (req, res) => {
  res.send("login page");
});

router.post("/", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    if (foundUser) {
      let submittedPass = req.body.password;
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let username = foundUser.username;
        let token = jwt.sign({ username: username }, process.env.secretKey, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .send({ status: "success", username: username, sessionid: token });
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


module.exports = router;
