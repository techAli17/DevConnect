const connectDB = require("./config/dataBase");
const express = require("express");
const app = express();

require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const validateSignUpData = require("./utils/validation");
const { userAuth } = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(cookieParser());

// signup for user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
      res.status(200).json({ message: "Login successful", token });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("Error while login: " + error.message);
  }
});

//get user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const userFound = req.user;
    res.send(userFound);
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

//send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "sent connection successfully!");
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

//Database connection
connectDB()
  .then(() => {
    console.log("Database connection established!");
    app.listen(7777, () => {
      console.log("Server is running on port: 7777");
    });
  })
  .catch(() => {
    console.log("Database connection not established!");
  });
