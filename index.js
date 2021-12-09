const express = require("express");
require("dotenv").config();
const http = require("http");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoUrl = process.env.mongoUrl;

//routers
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
// const questionRouter = require('./routes/questions');

const app = express();
const server = http.createServer(app);

//connect to mongodb
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."));

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(cors());

//routes
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/signup", registerRouter);
// app.use("/questions", questionRouter);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("server is listening on port: " + PORT);
});
