var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// create application/json parser
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("settings to change data");
  console.log("settings to change data");
});

// router.get("/getUsername", (req, res) => {
//   User.find({}, function (err, users) {
//     var userMap = {};
//     users.forEach(function (user, index) {
//       userMap[index] = user.username;
//     });

//     // if (Object.values(userMap).indexOf("tan_jiro") > -1) {
//     //   res.send("has user");
//     // }
//     res.send(userMap);
//   });
// });

router.post("/", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secretKey);
      const username = decoded.username;
      const id = decoded.id;

      if (
        req.body.name === " " ||
        req.body.name === null ||
        req.body.name === ""
      ) {
        res.status(401).json({ message: "name cannot be empty" });
      } else {
        User.findOne({ _id: id }, (err, doc) => {
          doc.name = req.body.name;
          doc.save();
        });
      }

      if (
        req.body.username === " " ||
        req.body.username === null ||
        req.body.username === ""
      ) {
        res.status(401).json({ message: "Username cannot be empty" });
      } else {
        User.find({}, function (err, users) {
          var userMap = {};
          users.forEach(function (user, index) {
            userMap[index] = user.username;
          });

          if (Object.values(userMap).indexOf(req.body.username) > -1) {
            res
              .status(401)
              .json({ message: "Username already exists,try another one" });
          } else {
            User.findOne({ _id: id }, (err, doc) => {
              doc.username = req.body.username;
              doc.save();
            });
            res.status(200).json({ message: "Username changed" });
          }
        });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
    // res.status(200).json({
    //   message: `New name ${req.body.name} & ${req.body.username} saved`,
    // });
    //req.body.username req.body.name req.body.password
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
});

module.exports = router;
