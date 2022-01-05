var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// create application/json parser
router.use(bodyParser.json());

router.post("/", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secretKey);
      //const username = decoded.username;
      const id = decoded.id;
      const user = req.body;

      User.findByIdAndUpdate(id, user, { new: true }, (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(user);
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
});

module.exports = router;
