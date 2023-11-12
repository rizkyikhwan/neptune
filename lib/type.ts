import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net"
import { Server as SocketIOServer } from "socket.io"
import { User } from "@prisma/client";
import { z } from "zod";
import { convertBase64 } from "./utils";

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

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

export const formSchemaEditProfile = z.object({
  displayname: z.string().optional(),
  username: z.string().min(3).max(15),
  avatar: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 5000000, `Max image size is 5MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""), "only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional(),
  hexColor: z.string(),
  banner: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 5000000, `Max image size is 5MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""), "only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional(),
  bannerColor: z.string(),
  bio: z.string().max(32)
})