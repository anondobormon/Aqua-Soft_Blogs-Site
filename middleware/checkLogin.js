const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (authorization) {
    const token = authorization.split("=")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, username } = decode;
    req.username = username;
    req.userId = userId;
    next();
  } else {
    res.redirect("/login");
  }
};
module.exports = checkLogin;
