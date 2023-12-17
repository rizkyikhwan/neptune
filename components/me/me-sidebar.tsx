"use client"

import LayoutChannelsSidebar from "@/components/layout-channels-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DirectMessageWithSeen } from "@/lib/type"
import { cn } from "@/lib/utils"
import { Conversation, User } from "@prisma/client"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next13-progressbar"
import { useEffect, useState } from "react"
import { useSocket } from "@/components/providers/socket-provider"
import ListDirectMessages from "@/components/user/list-direct-messages"
import UserAvatar from "@/components/user/user-avatar"
import LoadingItem from "./loading-item"

type ConversationUser = Conversation & {
  users: User[]
  directMessages: DirectMessageWithSeen[],
  isTyping?: boolean
}

interface MeSidebarProps {
  user: User
}

const MeSidebar = ({ user }: MeSidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { socket } = useSocket()

  const [open, setOpen] = useState(false)

  const { data: conversation, isLoading } = useQuery({
    queryKey: ['conversation'],
    queryFn: async () => {
      const data = await axios.get("/api/conversations")
      return data.data
    }
  })

  useEffect(() => {
    if (!conversation) {
      socket.on("chat:conversation:new", (newData: Conversation) => {
        if (newData.userIds.includes(user.id)) {
          queryClient.setQueryData(['conversation'], (oldData: any) => {
            if (!oldData) {
              return oldData
            }

            return { data: [...oldData.data.filter((data: any) => data.id !== newData.id), newData] }
          })
        }
      })

      return
    }

    socket.on("chat:conversation:new", (newData: Conversation) => {
      if (!conversation.data.includes(newData.id) && newData.userIds.includes(user.id)) {
        queryClient.setQueryData(['conversation'], (oldData: any) => {
          if (!oldData) {
            return oldData
          }

          return { data: [...oldData.data.filter((data: any) => data.id !== newData.id), newData] }
        })

        return
      }
    })

    conversation.data.map((item: ConversationUser) => {
      socket.on(`chat:${item.id}:conversation:update`, (data: any) => {
        queryClient.setQueryData(['conversation'], (oldData: any) => {
          if (!oldData) {
            return oldData
          }

          const newData = oldData.data.map((item: any) => {
            if (item.id === data.id) {
              return { ...item, lastMessageAt: data.lastMessageAt }
            }

            return item
          })

          return { data: newData }
        })
      })
    })

    return () => socket.off("chat:conversation:new")
  }, [socket, queryClient, conversation])

  return (
    <>
      <LayoutChannelsSidebar
        channelHeader={
          <div className="flex-1 px-2">
            <button type="button" onClick={() => setOpen(true)} className="flex items-center w-full px-2 py-1 text-xs transition rounded group gap-x-2 dark:bg-zinc-900/80 bg-zinc-200 dark:text-zinc-400">
              Find Server & Direct Messages
            </button>
          </div>
        }
      >
        <div className="my-2 space-y-3">
          <div>
            <button className="w-full group" onClick={() => router.push("/me/channels")}>
              <div className={cn(pathname?.includes("channels") && "bg-zinc-300/50 dark:bg-zinc-600/50", "flex items-center p-2 rounded space-x-3 hover:bg-zinc-400/50 hover:dark:bg-zinc-700/50")}>
                <Users className="w-5 h-5" />
                <p>Friends</p>
              </div>
            </button>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center mb-2 space-x-1 group">
              <p className="text-xs font-semibold tracking-wider uppercase select-none text-zinc-400 whitespace-nowrap group-hover:text-zinc-500 group-hover:dark:text-white">Direct Messages</p>
              <div className="w-full h-0.5 bg-zinc-400 rounded-full group-hover:bg-zinc-500 group-hover:dark:bg-white" />
            </div>
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <LoadingItem key={i} />
                ))}
              </>
            ) : (
              conversation.data.sort((a: any, b: any) => new Date(b.lastMessageAt).valueOf() - new Date(a.lastMessageAt).valueOf()).map((data: ConversationUser) => {
                return data.directMessages.length > 0 && (
                  <ListDirectMessages
                    key={data.id}
                    data={data}
                    user={user}
                  />
                )
              }))}
          </div>
        </div>
      </LayoutChannelsSidebar>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Find servers and direct messages" />
        <CommandList>
          <CommandEmpty>
            No Results Found
          </CommandEmpty>
          <CommandGroup heading={"Servers"}>
            <CommandItem className="space-x-2 cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-sm text-zinc-100 bg-zinc-600">
                  T
                </AvatarFallback>
              </Avatar>
              <span>Tes server</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading={"Direct Messages"} >
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <LoadingItem key={i} />
                ))}
              </>
            ) : (
              conversation.data.sort((a: any, b: any) => new Date(b.lastMessageAt).valueOf() - new Date(a.lastMessageAt).valueOf()).map((data: ConversationUser) => {
                const currentUserId = user.id

                const otherUser = data.users.filter(user => user.id !== currentUserId)[0]

                return data.directMessages.length > 0 && (
                  <CommandItem
                    className="space-x-2 cursor-pointer"
                    key={data.id}
                    onSelect={() => {
                      router.push(`/me/conversation/${otherUser.id}`)
                      setOpen(false)
                    }}
                  >
                    <UserAvatar
                      id={otherUser.id}
                      initialName={otherUser.displayname || otherUser.username}
                      bgColor={otherUser.hexColor}
                      src={otherUser.avatar || ""}
                      className="w-8 h-8"
                      onlineIndicator
                    />
                    <div className="flex flex-col">
                      <p>{otherUser.displayname || otherUser.username}</p>
                      <p className="text-xs text-zinc-400">{otherUser.username}</p>
                    </div>
                  </CommandItem>
                )
              }))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
export default MeSidebar