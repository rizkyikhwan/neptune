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
import ListDirectMessages from "../user/list-direct-messages"
import LoadingItem from "./loading-item"
import { useSocket } from "../providers/socket-provider"

type ConversationUser = Conversation & {
  userOne: User
  userTwo: User,
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
      socket.on("chat:conversation:new", (newData: any) => {
        if (newData.userOneId === user.id || newData.userTwoId === user.id) {
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
  }, [socket, queryClient, conversation])
  
  return (
    <>
      <LayoutChannelsSidebar
        channelHeader={
          <div className="flex-1 px-2">
            <button type="button" onClick={() => setOpen(true)} className="flex items-center w-full px-2 py-1 text-sm transition rounded group gap-x-2 dark:bg-zinc-900/80 bg-zinc-200 dark:text-zinc-400">
              Find Server
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
          <div className="flex flex-col space-y-2">
            <p className="text-xs font-semibold tracking-wider uppercase select-none text-zinc-400 hover:text-zinc-500 hover:dark:text-white">Direct Messages</p>
            {isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <LoadingItem key={i} />
                ))}
              </>
              ) : (
              conversation.data.sort((a: any, b: any) => new Date(b.lastMessageAt).valueOf() - new Date(a.lastMessageAt).valueOf()).map((data: ConversationUser) => (
                <ListDirectMessages
                  key={data.id}
                  data={data}
                  user={user}
                />
              )))}
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
          <CommandGroup heading={"Direct Messages"}>
            <CommandItem className="space-x-2 cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-sm text-zinc-100 bg-zinc-600">
                  T
                </AvatarFallback>
              </Avatar>
              <span>Tes User</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
export default MeSidebar