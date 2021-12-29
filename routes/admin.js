var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const AdminUser = require("../models/Admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// create application/json parser
router.use(bodyParser.json());
// router.get("/", (req, res) => {
//   res.send(users);
// });

async function auth(username) {
  const user = await AdminUser.findOne({ username: username });
  if (user) {
    return user;
  } else {
    return false;
  }
}

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await auth(username);
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
        adminName: user.username,
        message: "Authorized",
        token: token,
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
