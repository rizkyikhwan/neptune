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

  socket.on("typing", (data) => {
    const user = activeUsers.find((user) => user.userId === data.receiverId);

    user && io.to(user.socketId).emit("get-typing", data);
  });

  socket.on("disconnect", () => {
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
