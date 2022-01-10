const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const bloggerAuth = require("./src/routes/auth/blogger");
const userAuth = require("./src/routes/auth/user");
const postRoute = require("./src/routes/posts/post");

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

const port = 8080;

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  next();
});

server.use("/auth-b", bloggerAuth);
server.use("/auth/", userAuth);
server.use("/feed", postRoute);

mongoose
  .connect(
    "mongodb+srv://default:new_user2@studentform.o0has.mongodb.net/a2Default?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    const serve = server.listen(process.env.PORT || port);
    const io = require("socket.io")(serve);
    io.on("connnection", (connectedClient) => {
      console.log("client connnected");
    });
    console.log("server is running on port", port);
  })
  .catch((err) => {
    console.log(err);
  });
// server.listen(process.env.PORT || port);
