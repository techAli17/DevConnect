const connectDB = require("./config/dataBase");
const express = require("express");
const app = express();
const User = require("./models/user");

app.use(express.json());

// signup for user
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const data = req.body;

  const ALLOWED_UPDATES = [
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    "phoneNumber",
    "lastName",
    "firstName",
    "password",
    "email",
  ];

  try {
    const updateAllowedForTheseKeys = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!updateAllowedForTheseKeys) {
      throw new Error("Update not allowed");
    }
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully to Db");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

//get the user from email
app.get("/getUserFromEmail", async (req, res) => {
  const userEmail = req.body.email;

  //try multiple method to find user , by id or etc

  // findOne method returns first matched id and its object not array
  // try {
  //   const userFound = await User.findOne({ email: userEmail });
  //   if (!userFound) res.status(404).send("user not found with email" + userEmail);
  //   res.send(userFound);
  // } catch (error) {
  //   res.status(400).send("something went wrong");
  // }

  try {
    const userFound = await User.find({ email: userEmail });
    if (userFound.length === 0) res.status(404).send("user not found with email" + userEmail);
    res.send(userFound);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

//get the feed to app
app.get("/getFeed", async (req, res) => {
  try {
    const userFound = await User.find({});
    if (userFound.length === 0) res.status(404).send("users not found");
    res.send(userFound);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

// delete user by Id
app.delete("/deleteUserById", async (req, res) => {
  const userId = req.body.userId;
  try {
    const userFound = await User.findByIdAndDelete(userId);
    console.log("userFound", userFound);

    res.send("User Deleted successfully");
  } catch (error) {
    res.send("something went wrong");
  }
});

//update user
app.patch("/updateUserById/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = [
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    "phoneNumber",
    "lastName",
    "firstName",
    "password",
  ];

  try {
    const updateAllowedForTheseKeys = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!updateAllowedForTheseKeys) {
      throw new Error("Update not allowed");
    }
    const userFound = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after", // return after __id value
      runValidators: true, // this is for when you make custom validators in your models then only you able to update by default custom validator not run
    });
    console.log("userFound", userFound);

    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Update fail:   " + error.message);
  }
});

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
