const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      console.log("roomId", roomId);

      socket.join(roomId);
    });
    socket.on("sendMessages", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
