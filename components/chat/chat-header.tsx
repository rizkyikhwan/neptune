"use client"

import MobileMenu from "@/components/mobile-menu"
import { Hash } from "lucide-react"
import UserAvatar from "../user/user-avatar"
import { userIsOnline } from "@/lib/utils"
import { useSocket } from "../providers/socket-provider"
import SocketIndicator from "../socket-indicator"

interface ChatHeaderProps {
  user: any
  type: "channel" | "conversation"
}

const ChatHeader = ({ user, type }: ChatHeaderProps) => {
  const { onlineUsers } = useSocket()

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
          <UserAvatar initialName={user.displayname || user.username} bgColor={user.hexColor} src={user.avatar} className="w-8 h-8" onlineIndicator={userIsOnline(onlineUsers, user.id)} />
        )}
        <p className="font-semibold text-black dark:text-white">
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