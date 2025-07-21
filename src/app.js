require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/dataBase");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

//use router
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

//Database connection
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
