import { NextApiResponseServerIo } from "@/lib/type"
import { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import { NextApiRequest } from "next"

export const config = {
  api: {
    bodyParser: false
  }
}

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

    io.on("connection", () => {
      console.log("Connected!");
    })

    io.on("disconnect", () => {
      console.log("Disconnet!");
    })
  }

  res.end()
}

export default ioHandler