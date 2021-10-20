const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../Schema/userSchema");

const router = express.Router();

// SignUp
router.get("/sign-up", (req, res) => {
  res.render("user/signUp");
});
router.post("/sign-up", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
    });
    await newUser.save();
    res.status(200).redirect("/login");
  } catch (err) {
    res.status(500).send("There was a server side error");
  }
});

//Sign in
router.get("/login", (req, res) => {
  res.render("user/signin");
});
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.find({ email: req.body.email });
    if (user) {
      const validPassword = bcrypt.compare(req.body.password, user[0].password);
      if (validPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.redirect("/");
      }
    } else {
      res.status(401).send("Authentication Failure");
    }
  } catch (err) {}
});

module.exports = router;
