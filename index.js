const express = require("express");
const http = require("http");
const bcrypt = require("bcrypt");
const path = require("path");
const bodyParser = require("body-parser");

//routers
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
// const questionRouter = require('./routes/questions');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
// app.use("/questions", questionRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});



server.listen(3000, function () {
  console.log("server is listening on port: 3000");
});
