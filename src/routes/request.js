const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");

//send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "sent connection successfully!");
  } catch (error) {
    res.status(400).send("something went wrong: " + error.message);
  }
});

module.exports = requestRouter;
