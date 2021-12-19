var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const PetCheckoutDetails = require("../models/PetDetails");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//define storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//upload parameter for multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 2024 * 3 },
  fileFilter: function (req, file, cb) {
    if (
      path.extname(file.originalname) !== ".png" &&
      path.extname(file.originalname) !== ".jpg" &&
      path.extname(file.originalname) !== ".jpeg"
    ) {
      cb({ message: "Please upload an png, jpg or jpeg image" }, false);
    } else {
      cb(null, true);
    }
  },
});

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


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

//testing the endpoint for uploading image
// router.post("/uploadImage", upload.single("image"), (req, res) => {
//   try {
//     console.log(req.file.filename);
//     res.send("ok");
//   } catch (err) {
//     console.log("Error");
//   }
// });

//checking to see if we can get the images
// router.get("/getImages", (req, res) => {
//   res.sendFile(
//     path.join(
//       __dirname,
//       "../public/uploads/",
//       "72cfc96e1684f125afe2123ff4c8e6af.jpg"
//     )
//   );
// });

//actual route for uploading all datas
router.post("/", upload.single("image"), async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (!token) {
      res.status(401).send({ messsage: "No token provided" });
    } else {
      const decoded = jwt.verify(token, process.env.secretKey);
      const userid = decoded.id;

      const petCheckoutDetails = new PetCheckoutDetails({
        id: Date.now(),
        name: req.body.name,
        age: req.body.age,
        image: req.file.filename,
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
