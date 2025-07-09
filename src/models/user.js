const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  // firstName:{
  // type:String
  // }
  //OR

  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  phoneNumber: Number,
});

//model name must be start from capital letter is good practice
const User = mongoose.model("User", userSchema);

module.exports = User;
