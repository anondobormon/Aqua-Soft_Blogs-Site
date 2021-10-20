const express = require("express");
const Blog = require("../Schema/blogSchema");
const User = require("../Schema/userSchema");
const upload = require("../multer/upload");
const checkLogin = require("../middleware/checkLogin");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    const trending = await Blog.find({}).limit(4);
    // console.log(trending);

    res.status(200).render("user/home", { blogs: blogs, trending: trending });
  } catch (err) {
    res.status(500).send("There was a server site error!");
  }
});

//ABOUT PAGE
router.get("/about", (req, res) => {
  res.render("user/about");
});

// GET BLOG DETAILS
router.get("/blog/:id", checkLogin, async (req, res) => {
  try {
    const blog = await Blog.find({ slug: req.params.id });
    const blogs = await Blog.find({});
    res.render("user/blogDetails", { blog: blog[0], blogs: blogs });
  } catch (err) {}
});

//GET ALL BLOGS BY CATEGORY

router.get("/blogs/:id", async (req, res) => {
  try {
    let category;
    if (req.params.id === "web") {
      category = "Web Development";
    } else if (req.params.id === "software") {
      category = "Software Development";
    } else if (req.params.id === "react") {
      category = "React Development";
    }

    const blog = await Blog.find({ category: category });
    res.render("user/seeAll", { blogs: blog });
  } catch (err) {
    console.log(err);
  }
});

//GET BLOG FORM
router.get("/add-blogs", checkLogin, (req, res) => {
  res.render("user/blogsForm");
});

//POST AN BLOG
router.post(
  "/add-blogs",
  checkLogin,
  upload.single("image"),
  async (req, res) => {
    try {
      const data = {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        blog: req.body.blog,
        image: req.file.filename,
        userId: req.userId,
      };

      const newBlog = Blog(data);
      const blog = await newBlog.save();
      await User.updateOne(
        { _id: req.userId },
        {
          $push: {
            blogs: blog._id,
          },
        }
      );
      res.status(200).redirect("add-blogs");
    } catch (err) {
      res.status(500).send("There was an server side error!");
    }
  }
);

module.exports = router;
