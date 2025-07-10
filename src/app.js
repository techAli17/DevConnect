const connectDB = require("./config/dataBase");
const express = require("express");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  try {
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully to Db");
  } catch (error) {
    res.status(400).send("Error saving the use" + error.message);
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
