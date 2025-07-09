const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://techali1718:EOWrItubLSwinO9K@nodejscluster0.oq4u0vv.mongodb.net/devConnect"
  );
};

module.exports = connectDB;
