const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  const { username } = socket.handshake.query;

  socket.join(`user_${username}`);

  let clentsList = Array.from(io.sockets.sockets, ([_, value]) => value);
  clentsList = clentsList.map((client) => client.handshake.query.username);

  let isTheirTurn = false;

  if (clentsList && clentsList.length && clentsList.length % 2 === 0) {
    isTheirTurn = true;
  }

  io.to(`user_${username}`).emit("connected", isTheirTurn);

  console.log({ isTheirTurn, clentsList, username });

  socket.on("ready", (message) => {
    socket.broadcast.emit("ready", message);
  });

  socket.on("switch_turn", (message) => {
    io.emit("switch_turn", message);
  });

  socket.on("ask", (message) => {
    socket.broadcast.emit("ask", message);
  });

  socket.on("answer", (message) => {
    socket.broadcast.emit("answer", message);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnected-user");
  });
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
