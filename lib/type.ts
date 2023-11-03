import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net"
import { Server as SocketIOServer } from "socket.io"
import { User } from "@prisma/client";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type SearchUser = {
  displayname?: string
  email: string
  hexColor: string
  id: string
  picture?: string
  username: string
}

export type UsersProps = User & {
  online?: boolean
}

export type ActiveUsersProps = {
  userId: string
  socketId: string
}

export type ProvidersType = [React.ElementType, Record<string, unknown>]

export type ChildrenType = {
  children: Array<React.ElementType>
}

export type VariantAuth = "LOGIN" | "SIGNUP"

export type EmailType = "Verify Email" | "Reset Password"

export type VariantFriend = "ONLINE" | "ALL" | "PENDING" | "ADD_FRIEND"
