const bcrypt = require("bcrypt");
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

// signup for user
authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { password, firstName, lastName, email, phoneNumber } = req.body;

    // Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    // create new instance of user model
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully to Db");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

// login for user
authRouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    // decrypt password
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create Jwt
      const token = await user.getJWT();

      // send back jwt to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      //return response
      res.status(200).json({ message: "Login successful", token, user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error while login: " + error.message);
  }
});

//logout user
//userAuth not required for logout if you want then its ok
authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send("Logout successfully!"); //chaining
  } catch (error) {
    res.status(400).send("Error while logout: " + error.message);
  }
});

module.exports = authRouter;
