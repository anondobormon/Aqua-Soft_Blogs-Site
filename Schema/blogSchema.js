const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  blog: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://i.ibb.co/dc3RFLC/8.jpg",
  },
  slug: {
    type: String,
    slug: "title",
    slug_padding_size: 4,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Blog = new mongoose.model("Blog", blogSchema);
module.exports = Blog;
