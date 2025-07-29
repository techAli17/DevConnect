require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dataBase");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");

//use router
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

//socket.io
const server = http.createServer(app);
initializeSocket(server);
//Database connection
connectDB()
  .then(() => {
    console.log("Database connection established!");
    server.listen(7777, () => {
      console.log("Server is running on port: 7777");
    });
  })
  .catch(() => {
    console.log("Database connection not established!");
  });
