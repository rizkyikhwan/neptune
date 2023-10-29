const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (userId) => {
    if (userId) {
      if (!activeUsers.some((user) => user.userId === userId)) {
        activeUsers.push({ userId: userId, socketId: socket.id });
      }

      io.emit("get-users", activeUsers);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
  });

  socket.on("offline", (userId) => {
    activeUsers = activeUsers.filter((user) => user.userId !== userId);

    io.emit("get-users", activeUsers);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
