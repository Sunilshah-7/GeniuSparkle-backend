var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminUsers = require("../.deploy/users.json");
// create application/json parser
router.use(bodyParser.json());

// router.get("/", (req, res) => {
//   res.send(users);
// });

function auth(username) {
  const foundUser = adminUsers.users.find((user) => user.username === username);
  if (foundUser) {
    return foundUser;
  } else {
    return false;
  }
}

router.post("/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = auth(username);
    const isValid = bcrypt.compareSync(password, user.password);
    if (user && isValid) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.secretKey,
        {
          expiresIn: "1h",
        }
      );
      res.json({
        token: token,
        adminName: user.username,
        message: "Authorized",
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    console.log("pinged");
    res.status(401).json({ message: "You are not authorized" });
  }
});

router.get("/getUsers", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secretKey);
      const username = decoded.username;
      const id = decoded.id;

      const adminUser = auth(username);
      if (adminUser) {
        User.find({}, (err, users) => {
          if (err) {
            res.status(500).json({
              message: "Error",
            });
          } else {
            res.status(200).json({
              users: users,
            });
          }
        }).select("name username _id answers role");
      } else {
        res.status(401).json({
          message: "You are not authorized",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

router.post("/updateUser/:id", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secretKey);
      const username = decoded.username;
      const id = decoded.id;

      const adminUser = auth(username);
      if (adminUser) {
        const id = req.params.id;
        const user = req.body;
        const password = req.body.password;
        if (password) {
          res.status(500).json({ message: "Password cannot be updated" });
        } else {
          User.findByIdAndUpdate(id, user, (err) => {
            if (err) {
              res.status(500).json({
                message: "Error",
              });
            } else {
              res.status(200).json({
                message: "User updated",
              });
            }
          });
        }
      } else {
        res.status(401).json({
          message: "You are not authorized",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
module.exports = router;
