var express = require("express");
var router = express.Router();
// const bodyParser = require("body-parser");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const PetCheckoutDetails = require("../models/PetDetails");
const PetDetailsArray = require("../models/PetDetailsArray");
const { getListFiles } = require("../controllers/upload");
const upload = require("../middleware/upload");
require("dotenv").config();

//middleware
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: false }));

const baseUrl = "http://geniusparkle12.herokuapp.com/files/";

//get all pet details
router.get("/getDetails", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.secretKey);
      const userid = decoded.id;
      PetDetailsArray.find({ userid: userid }, (err, petDetails) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(petDetails);
        }
      }).populate({ path: "petDetails", select: "name age image petType" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
});

router.delete("/:id", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    if (token) {
      // const decoded = jwt.verify(token, process.env.secretKey);
      // const userid = decoded.id;

      PetCheckoutDetails.findByIdAndDelete(req.params.id, (err, petDetails) => {
        if (err) {
          res.status(500).send({ message: "Something went wrong" });
        } else {
          res.status(200).send({ message: "deleted successfully" });
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
      const foundUserPets = await PetCheckoutDetails.find({ user: userid });

      await petCheckoutDetails.save();

      console.log(foundUserPets.length);
      // res.status(200).send(result);
      if (foundUserPets.length === 0) {
        const newUsers = await PetCheckoutDetails.find({ user: userid });
        console.log("New User");
        petid = [];
        newUsers.forEach((pet) => {
          petid.push(pet._id);
        });
        const petDetailsArray = new PetDetailsArray({
          id: Date.now(),
          petDetails: [petid],
          userid: userid,
        });

        await petDetailsArray.save();
        const arrayResult = await petDetailsArray.populate({
          path: "petDetails",
          select: "name age image petType",
        });

        res.status(200).send(arrayResult);
      } else {
        const oldUsers = await PetCheckoutDetails.find({ user: userid });
        petid = [];

        oldUsers.forEach((pet) => {
          petid.push(pet._id);
        });
        console.log(petid);
        PetDetailsArray.findOneAndUpdate(
          { userid: userid },
          { petDetails: petid },
          { new: true },
          (err, result) => {
            if (result) {
              res.status(200).send(result);
            } else if (err) {
              console.log(err);
            }
          }
        ).populate({ path: "petDetails", select: "name age image petType" });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
