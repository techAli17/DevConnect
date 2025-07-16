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
      senderName: loggedInUser.firstName + " " + loggedInUser.lastName,
      receiverName: isToUserIDExists.firstName + " " + isToUserIDExists.lastName,
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

// Review connection request
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      throw new Error(`Invalid status '${status}' — must be either 'accepted' or 'rejected'.`);
    }

    // Validate requestId is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error("Invalid connection request ID.");
    }

    // Check if the connection request exists at all
    const requestExists = await ConnectionRequestModel.findById(requestId);
    if (!requestExists) {
      throw new Error("Connection request not found.");
    }

    // Check if the request was meant for this user
    if (!requestExists.toUserId.equals(loggedInUser._id)) {
      throw new Error("You are not authorized to review this request.");
    }

    // Check if the request is still in 'interested' state
    if (requestExists.status !== "interested") {
      throw new Error(`Request has already been reviewed as '${requestExists.status}'.`);
    }
    // Find the request that is addressed to the logged-in user and is still 'interested'
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new Error("The request is either invalid or has already been reviewed.");
    }

    // Fetch sender user info for response message
    const senderUser = await User.findById(connectionRequest.fromUserId);
    if (!senderUser) {
      throw new Error("Sender user not found.");
    }

    // Update status and log timestamp
    connectionRequest.status = status;
    connectionRequest.reviewedAt = new Date();

    const data = await connectionRequest.save();

    res.json({
      message: `You have successfully ${status} the connection request from ${senderUser.firstName}.`,
      status,
      data: {
        requestId: data._id,
        fromUser: {
          id: senderUser._id,
          name: senderUser.firstName,
        },
        toUser: {
          id: loggedInUser._id,
          name: loggedInUser.firstName,
        },
        status: data.status,
        reviewedAt: data.reviewedAt,
      },
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = requestRouter;
