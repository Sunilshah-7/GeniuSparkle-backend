var express = require("express");
var router = express.Router();
// const bodyParser = require("body-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const PetCheckoutDetails = require("../models/PetDetails");
const { getListFiles } = require("../controllers/upload");
const upload = require("../middleware/upload");
require("dotenv").config();

//middleware
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: false }));

const baseUrl = "http://geniusparkle12.herokuapp.com/files/";

//get all pet details
router.get("/getDetails", (req, res) => {
  PetCheckoutDetails.find()
    .populate([{ path: "user", select: "name username" }])
    .then((petDetails) => {
      res.send(petDetails);
    })
    .catch((err) => {
      res.send(err);
    });
});

//actual route for uploading all datas
router.post("/", upload, async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    if (!token) {
      res.status(401).send({ messsage: "No token provided" });
    } else {
      const decoded = jwt.verify(token, process.env.secretKey);
      const userid = decoded.id;
      const imageUrl = await getListFiles(
        `genius-${req.file.originalname}`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
          imageName = result;
        }
      );
      // const imageName = `${baseUrl}genius-${req.file.originalname}`;
      const petCheckoutDetails = new PetCheckoutDetails({
        id: Date.now(),
        name: req.body.name,
        age: req.body.age,
        image: imageName,
        petType: req.body.petType,
        user: userid,
      });
      const result = await petCheckoutDetails.save();
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
