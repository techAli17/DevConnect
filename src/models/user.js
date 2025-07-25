require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
      unique: true,
      required: [true, "Email is required"],
      maxLength: [50, "Email cannot exceed 50 characters"],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      validate: {
        validator: function (val) {
          return validator.isStrongPassword(val, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message: "Password must contain at least one number and one special character.",
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    photoUrl: {
      type: String,
      default: "https://smsdelhibmw.co.in/wp-content/uploads/2022/02/User-Profile-PNG.png",
      validate: function (value) {
        return validator.isURL(value);
      },
      message: "Photo url is valid",
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: (val) => val.length <= 10,
          message: "A user can have up to 10 skills only.",
        },
        {
          validator: (val) => val.every((skill) => skill.length >= 2),
          message: "Each skill must be at least 2 characters long.",
        },
      ],
    },
    about: {
      type: String,
      default: "Random Default about",
      maxLength: 150,
    },
    age: {
      type: Number,
      min: 12,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    lastName: String,
  },
  { timestamps: true }
);

// Compound index to optimize queries involving both fromUserId and toUserId.
// This improves performance when checking for existing connection requests between two users.
// userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

//model name must be start from capital letter is good practice
const User = mongoose.model("User", userSchema);

module.exports = User;
