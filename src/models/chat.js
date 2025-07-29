const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({});

const chatSchemaModel = new mongoose.model("ConnectionRequestModel", chatSchema);

module.exports = chatSchemaModel;
