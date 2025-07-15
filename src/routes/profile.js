const bcrypt = require("bcrypt");
const express = require("express");
const validator = require("validator");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const { validateProfileEditData } = require("../utils/validation");

//get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userFound = req.user;
    res.send(userFound);
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

//profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit request!");
      // return res.status(400).send("Invalid edit request")
    }
    const userFound = req.user;
    console.log("updated data", userFound);

    Object.keys(req.body).forEach((key) => (userFound[key] = req.body[key]));
    await userFound.save();

    // res.send(`${userFound.firstName} your profile update successfully!`);
    res.json({
      message: `${userFound.firstName}  your profile update successfully!`,
      data: userFound,
    });
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

//forgot password
profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    // you can also write data sanitization like  if (!validateProfileEditData(req))

    const userFound = req.user;

    const { newPassword } = req.body;

    if (!newPassword) {
      throw new Error("New password is required");
    }

    // Optional: Validate newPassword format manually or using validator
    const isStrong = validator.isStrongPassword(newPassword, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isStrong) {
      throw new Error("Password must contain at least one number and one special character.");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update and save
    userFound.password = hashedPassword;
    await userFound.save();

    res.json({
      message: `${userFound.firstName}, your password has been reset successfully.`,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
