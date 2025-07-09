const connectDB = require("./config/dataBase");
const express = require("express");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "kayyoom",
    lastName: "Ali",
    email: "kayyoom@gmail.com",
    password: "kayyoom@131",
  };
  try {
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully to Db");
  } catch (error) {
    res.status(400).send("Error saving the use" + error.message);
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
