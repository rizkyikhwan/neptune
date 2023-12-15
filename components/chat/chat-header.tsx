"use client"

import MobileMenu from "@/components/mobile-menu"
import { Hash } from "lucide-react"
import UserAvatar from "../user/user-avatar"
import SocketIndicator from "../socket-indicator"
import { User } from "@prisma/client"

interface ChatHeaderProps {
  user: Omit<User, "password" | "verifyToken" | "verifyTokenExpiry" | "friendsRequestIDs" | "resetPasswordToken" | "resetPasswordTokenExpiry">
  type: "channel" | "conversation"
}

const ChatHeader = ({ user, type }: ChatHeaderProps) => {
  return (
    <section className="min-h-[48px] shadow py-2 px-4 border-b flex items-center relative">
      <div className="md:hidden">
        <MobileMenu />
      </div>
      <div className="flex items-center space-x-2">
        {type === "channel" && (
          <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
        )}
        {type === "conversation" && (
          <UserAvatar id={user.id} initialName={user.displayname || user.username} bgColor={user.hexColor} src={user.avatar || ""} className="w-7 h-7" onlineIndicator />
        )}
        <p className="text-sm font-semibold tracking-wide text-black dark:text-white">
          {user.displayname || user.username}
        </p>
      </div>
      <div className="flex items-center ml-auto">
        <SocketIndicator />
      </div>
    </section>
  )
}
export default ChatHeader