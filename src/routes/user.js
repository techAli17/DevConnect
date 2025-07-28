const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const { userAuth } = require("../middlewares/authMiddleware");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(loggedInUser._id)) {
      throw new Error("Invalid request id!");
    }

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName email");
    // }).populate("fromUserId", ["firstName", "lastName", "email"]); both above and below are same

    res.json({
      message: "Received connection requests",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(loggedInUser._id)) {
      throw new Error("Invalid request id!");
    }

    const connectionRequests = await ConnectionRequestModel.find({
      // toUserId: loggedInUser._id,  That means you're only showing connections that this user received and accepted — but not the ones they sent and were accepted.
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }], //all mutual connections,
      status: "accepted",
    })
      .populate("fromUserId", "firstName lastName email")
      .populate("toUserId", "firstName lastName email"); //multiple ref can be used

    const modifiedSendData = connectionRequests.map((item) => {
      const isSender = item.fromUserId._id.equals(loggedInUser._id);
      return isSender ? item.toUserId : item.fromUserId;
    });

    res.json({
      message: "Your accepted connections",
      data: modifiedSendData,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Fetch all requests where user is sender or receiver
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId status");

    // Set of user IDs to hide from feed
    const hideUserIds = new Set([loggedInUser._id.toString()]);

    connectionRequests.forEach((req) => {
      const from = req.fromUserId.toString();
      const to = req.toUserId.toString();

      // Hide any user involved in any request
      hideUserIds.add(from);
      hideUserIds.add(to);

      // Optionally: if you only want to hide users involved in rejected requests,
      // you can separate them like this:
      if (req.status === "rejected") {
        hideUserIds.add(from);
        hideUserIds.add(to);
      }
    });

    //user with pagination mode
    const usersToShow = await User.find({
      $and: [{ _id: { $nin: Array.from(hideUserIds) } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select("firstName lastName email photoUrl skills about age")
      .skip(skip)
      .limit(limit);

    //returns json
    res.json({
      message: "User feed fetched successfully",
      total: usersToShow.length,
      data: usersToShow,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userRouter;
