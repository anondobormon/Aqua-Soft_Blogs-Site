const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  blogs: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
  },
});
const User = new mongoose.model("User", userSchema);
module.exports = User;
