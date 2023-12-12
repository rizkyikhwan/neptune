"use client"

import { DirectMessageWithSeen } from "@/lib/type"
import { cn } from "@/lib/utils"
import { Conversation, User } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useRouter } from "next13-progressbar"
import { useEffect, useMemo } from "react"
import { useSocket } from "../providers/socket-provider"
import UserAvatar from "./user-avatar"

type ConversationUser = Conversation & {
  users: User[]
  directMessages: DirectMessageWithSeen[],
  isTyping?: boolean
}

interface ListDirectMessagesProps {
  user: User
  data: ConversationUser
}

const ListDirectMessages = ({ data, user }: ListDirectMessagesProps) => {
  if (!data) {
    return
  }

  const channelKey = `chat:${data.id}:messages:new`
  const dmKey = `chat:messages:seen`

  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { socket } = useSocket()

  const onEnter = { height: 0, opacity: 0 }
  const animate = { height: "auto", opacity: 1 }
  const onLeave = { height: 0, opacity: 0 }

  useEffect(() => {
    socket.on(channelKey, (data: any) => {
      queryClient.setQueryData(['conversation'], (oldData: any) => {
        if (!oldData) {
          return oldData
        }

        const newData = oldData.data.map((item: any) => {
          if (item.id === data.conversationId) {
            return { ...item, directMessages: [...item.directMessages, data] }
          }

          return item
        })

        return { data: newData }
      })
    })

    socket.on(dmKey, (data: any) => {
      queryClient.setQueryData(['conversation'], (oldData: any) => {
        if (!oldData) {
          return oldData
        }

        const newData = oldData.data.map((item: any) => {
          if (item.id === data.conversationId) {
            return { ...item, directMessages: [...item.directMessages, data] }
          }

          return item
        })

        return { data: newData }
      })
    })

    return () => {
      socket.off(channelKey)
      socket.off(dmKey)
    }
  }, [socket, data, channelKey, queryClient])

  const currentUserId = user.id

  const otherUser = data.users.filter(user => user.id !== currentUserId)[0]

  const lastMessage = useMemo(() => {
    const directMessage = data.directMessages

    return directMessage[directMessage.length - 1]
  }, [data.directMessages])

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false
    }

    const seenArray = lastMessage.seen || []

    if (!user) {
      return false
    }

    return seenArray.filter((currentUser) => currentUser.email === user.email).length !== 0
  }, [user, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.fileUrl) {
      return 'Sent an file'
    }

    if (lastMessage?.content) {
      return lastMessage?.content
    }
  }, [lastMessage])

  const isOwn = lastMessage?.senderId === user.id

  return (
    <motion.button
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(pathname?.includes(otherUser.id) ? "bg-zinc-300/50 dark:bg-zinc-600/50" : "dark:bg-dark-tertiary bg-[#F2F3F5]", "flex items-center justify-between p-2 h-12 rounded space-x-3 w-full hover:bg-zinc-400/50 hover:dark:bg-zinc-700/50")}
      onClick={() => router.push(`/me/conversation/${otherUser.id}`)}
      type="button"
    >
      <div className="flex items-center space-x-2">
        <UserAvatar
          id={otherUser.id}
          initialName={otherUser.displayname || otherUser.username}
          bgColor={otherUser.hexColor}
          src={otherUser.avatar || ""}
          className="w-8 h-8"
          onlineIndicator
        />
        <div className={cn(!hasSeen && !isOwn && "font-semibold tracking-wide", "flex flex-col items-start")}>
          <p className="text-sm">
            {otherUser.displayname ? otherUser.displayname.length > 14 ? `${otherUser.displayname.slice(0, 14)}...` : otherUser.displayname : otherUser.username.length > 14 ? `${otherUser.username.slice(0, 14)}...` : otherUser.username}
          </p>
          <AnimatePresence mode="wait">
            {lastMessageText && (
              <motion.p
                initial={onEnter}
                animate={animate}
                exit={onLeave}
                className={cn(lastMessage.deleted && "italic", "text-[10px] text-zinc-400 text-left space-x-1")}
              >
                {isOwn && <span>You:</span>}
                <span>{lastMessageText.length > 15 ? `${lastMessageText.slice(0, 15)}...` : lastMessageText}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!hasSeen && !isOwn && <div className="flex-none w-2 h-2 rounded-full bg-sky-500" />}
    </motion.button>
  )
}
export default ListDirectMessages