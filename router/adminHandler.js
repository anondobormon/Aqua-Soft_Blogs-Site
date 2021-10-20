const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Blog = require("../Schema/blogSchema");
const User = require("../Schema/userSchema");
const Admin = require("../Schema/adminSchema");
const checkLogin = require("../middleware/adminLoginCheck");

const router = express.Router();

//ADMIN SING UP
router.get("/sign-up", checkLogin, (req, res) => {
  res.render("admin/adminSignUp");
});
router.post("/sign-up", checkLogin, async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const newAdmin = new Admin({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
    });
    await newAdmin.save();
    res.status(200).redirect("/login");
  } catch (err) {
    res.status(500).send("Authentication Error");
  }
});

//login
router.get("/login", (req, res) => {
  res.render("admin/adminSignIn");
});

router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.find({ email: req.body.email });
    if (admin) {
      const validPassword = bcrypt.compare(
        req.body.password,
        admin[0].password
      );
      if (validPassword) {
        const token = jwt.sign(
          {
            username: admin[0].username,
            userId: admin[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
        });
        res.redirect("/admin/dashboard");
      }
    } else {
      res.status(401).send("Authentication Failure");
    }
  } catch (err) {
    res.send("Authentication failure!");
  }
});

//Dashboard BLOG
router.get("/dashboard", checkLogin, async (req, res) => {
  const blogs = await Blog.find({});
  const user = await User.find({});
  if (blogs) {
    res.status(200).render("admin/dashboard", { blogs: blogs, user: user });
  } else {
    res.status(500).send("There was an server side error");
  }
});

// GET ALL USERS
router.get("/users", checkLogin, async (req, res) => {
  const user = await User.find({});
  if (user) {
    res.status(200).render("admin/userList", { user: user });
  } else {
    res.status(500).send("There was an server side error");
  }
});
//GET ALL BLOG'S
router.get("/blogs", checkLogin, async (req, res) => {
  const blogs = await Blog.find({});
  if (blogs) {
    res.status(200).render("admin/allBlogs", { blogs: blogs });
  } else {
    res.status(500).send("There was an server side error");
  }
});
//DELETE BLOG
router.get("/dashboard/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.find({ _id: req.params.id });
    const filePath = `../Public/uploads/${blog[0].image}`;
    console.log(filePath);
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
    console.log(blog);
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("There was an error deleting");
  }
});

//UPDATE BLOG
router.get("/dashboard/update/:id", async (req, res) => {
  try {
    const blog = await Blog.find({ _id: req.params.id });
    res.status(200).render("admin/form", { blogs: blog[0] });
  } catch (err) {
    res.status(500).send("There was an sever side error");
  }
});
router.post("/dashboard/update/:id", async (req, res) => {
  try {
    await Blog.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          blog: req.body.blog,
          category: req.body.category,
        },
      }
    );
    res.status(200).redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("There was an sever side error");
  }
});

module.exports = router;
