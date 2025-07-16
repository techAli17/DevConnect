const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");

//send connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      throw new Error("Invalid user ID provided in the request.");
    }

    // 2. Validate status
    if (!["interested", "ignored"].includes(status)) {
      throw new Error(`Invalid status '${status}' — must be either 'interested' or 'ignored'.`);
    }

    // 3. Prevent self-request
    if (fromUserId.equals(toUserId)) {
      throw new Error("You cannot send a connection request to yourself.");
    }

    // 4. Check if toUserId exists in DB
    const isToUserIDExists = await User.findById(toUserId);
    if (!isToUserIDExists) {
      throw new Error("The user you're trying to connect with does not exist.");
    }

    //check if existing connection request
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error(
        `A connection request between ${loggedInUser.firstName} and ${isToUserIDExists.firstName} already exists.`
      );
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

    res.json({
      message: `${capitalizedStatus}: ${req.user.firstName} → ${isToUserIDExists.firstName}`,
      fromUser: {
        id: req.user._id,
        name: req.user.firstName,
      },
      toUser: {
        id: isToUserIDExists._id,
        name: isToUserIDExists.firstName,
      },
      status,
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = requestRouter;
