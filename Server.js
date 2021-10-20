const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const blogsHandler = require("./router/blogsHandler");
const loginHandler = require("./router/loginHandler");
const adminHandler = require("./router/adminHandler");

const app = express();
dotenv.config();
app.use(express.static("Public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose
  .connect(
    "mongodb+srv://learningMongodb:L7WjwKRuFQOkvnaU@cluster0.3hvbw.mongodb.net/Blogs?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connection success"))
  .catch((err) => console.log(err));

app.use("/", blogsHandler);
app.use("/", loginHandler);
app.use("/admin", adminHandler);

app.listen(5050, () => {
  console.log("Server Running on port 5050");
});
