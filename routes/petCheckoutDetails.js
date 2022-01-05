var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const PetCheckoutDetails = require("../models/PetDetails");
// const uploadController = require("../controllers/upload");
// const upload = require("../middleware/upload");
var FormData = require("form-data");
require("dotenv").config();

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const baseUrl = "https://localhost:8080/files/";

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
router.post("/", async (req, res) => {
  const token = req.headers["x-access-token"];
  // const data = new FormData(req.file);
  // data.append("name", 10);
  // console.log(data);
  try {
    if (!token) {
      res.status(401).send({ messsage: "No token provided" });
    } else {
      const decoded = jwt.verify(token, process.env.secretKey);
      const userid = decoded.id;
      // const imageUrl = upload(req.file, res);
      //const imageName = `${baseUrl}/${Date.now()}-gen-${req.file.originalname}`;
      const petCheckoutDetails = new PetCheckoutDetails({
        id: Date.now(),
        name: req.body.name,
        age: req.body.age,
        //image: imageName,
        petType: req.query.petType,
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
