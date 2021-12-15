var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.send("Checkout pet details");
});

module.exports = router;
