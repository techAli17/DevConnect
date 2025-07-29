const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // this is reference  to user collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // this is reference  to user collection
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "rejected", "accepted", "ignored"],
        message: `{VALUE} is incorrect status type`,
      },
    },
    senderName: {
      type: String,
    },
    receiverName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize queries involving both fromUserId and toUserId.
// This improves performance when checking for existing connection requests between two users.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// this will always run before save the data to DB you can handle all edge cases here
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can't send a request to yourself.");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
