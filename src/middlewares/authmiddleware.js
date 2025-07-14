const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the req cookies
    const { token } = req.cookies;

    // validate token
    if (!token) {
      throw new Error("Invalid token!!!!!");
    }

    //verify token
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;
    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth,
};
