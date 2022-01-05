const express = require("express");
require("dotenv").config();
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoUrl = process.env.mongoUrl;
const Grid = require("gridfs-stream");
// const maxmind = require('maxmind');

//routers
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const resetPasswordRouter = require("./routes/reset_password");
const settingRouter = require("./routes/settings");
const petCheckoutRouter = require("./routes/petCheckoutDetails");
const userDetailsRouter = require("./routes/userDetails");
const adminRouter = require("./routes/admin");
const uploadController = require("./controllers/upload");

const app = express();
const server = http.createServer(app);

//connect to mongodb and deta
// const deta = Deta(process.env.detaKey);
// const db = deta.Base("Users");
// console.log(db);
let gfs;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("connected to mongodb");
  });

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use("/file", express.static(__dirname + "/uploads"));

//routes
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/signup", registerRouter);
app.use("/api/user/reset_password", resetPasswordRouter);
app.use("/api/user/settings", settingRouter);
app.use("/api/user/checkout/pet_details", petCheckoutRouter);
app.use("/api/user/user_details", userDetailsRouter);
app.use("/api/admin", adminRouter);
//file handling
app.post("/upload", uploadController.uploadFiles);
app.get("/files", uploadController.getListFiles);
app.get("/files/:name", uploadController.download);

const PORT = process.env.PORT || 8080;
// For Heroku
server.listen(PORT, function () {
  console.log("server is listening on port: " + PORT);
});

//For DETA
// module.exports = app;
