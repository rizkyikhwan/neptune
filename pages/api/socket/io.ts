import { ActiveUsersProps, NextApiResponseServerIo } from "@/lib/type"
import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

export const config = {
  api: {
    bodyParser: false
  }
}

let activeUsers: ActiveUsersProps[] = []

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io"
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false
    })
    res.socket.server.io = io

    io.on("connection", (socket) => {
      socket.on("new-user-add", (newUserId) => {
        if (newUserId) {
          if (!activeUsers.some(user => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id })
          }

          io.emit("get-users", activeUsers)
        }
      })

      socket.on("typing", (data) => {
        const user = activeUsers.find((user) => user.userId === data.receiverId);
        
        user && io.to(user.socketId).emit("get-typing", {...data, socketId: user.socketId})
      });

      socket.on("set-notification", (data) => {
        const user = activeUsers.find((user) => user.userId === data.receiver.id);

        user && io.to(user.socketId).emit("get-notification", data)
      })

      socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

        io.emit("get-users", activeUsers);
      });

      socket.on("offline", (userId) => {
        activeUsers = activeUsers.filter(user => user.userId !== userId)

        io.emit("get-users", activeUsers);
      });
    })
  }

  res.end()
}

export default ioHandler