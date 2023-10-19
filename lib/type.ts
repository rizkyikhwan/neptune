import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net"
import { Server as SocketIOServer } from "socket.io"

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type VariantAuth = "LOGIN" | "SIGNUP"

export type EmailType = "Verify Email" | "Reset Password"

export type VariantFriend = "ONLINE" | "ALL" | "PENDING" | "ADD_FRIEND"
