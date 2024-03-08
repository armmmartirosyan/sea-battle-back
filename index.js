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
  console.log("A user connected");

  socket.on("ready", (message) => {
    socket.broadcast.emit("ready", message);
  });

  socket.on("ask", (message) => {
    socket.broadcast.emit("ask", message);
  });

  socket.on("answer", (message) => {
    socket.broadcast.emit("answer", message);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnected-user");
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
