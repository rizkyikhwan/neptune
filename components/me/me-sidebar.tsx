"use client"

import LayoutChannelsSidebar from "@/components/layout-channels-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Conversation, DirectMessage, User } from "@prisma/client"
import { Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next13-progressbar"
import { useEffect, useState } from "react"
import { useSocket } from "../providers/socket-provider"
import UserAvatar from "../user/user-avatar"
import { AnimatePresence, motion } from "framer-motion"

type ConversationUser = Conversation & {
  userOne: User
  userTwo: User,
  directMessages: DirectMessage[]
}

interface MeSidebarProps {
  user: User
  conversation: ConversationUser[]
}

const MeSidebar = ({ user, conversation }: MeSidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { socket } = useSocket()

  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState("")

  const onEnter = { height: 0, opacity: 0 }
  const animate = { height: "auto", opacity: 1 }
  const onLeave = { height: 0, opacity: 0 }

  useEffect(() => {
    let timer: NodeJS.Timeout

    socket.on("get-typing", () => {
      setTyping(`typing...`)

      clearTimeout(timer)

      timer = setTimeout(() => {
        setTyping("");
      }, 1000);
    })
  }, [socket])

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
            {conversation.map((item) => {
              const { userOne, userTwo } = item

              const otherUser = userOne.id === user.id ? userTwo : userOne

              if (item.directMessages.length > 0) {
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -150, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -150, opacity: 0 }}
                    className={cn(pathname?.includes(otherUser.id) && "bg-zinc-300/50 dark:bg-zinc-600/50", "flex items-center p-2 h-12 rounded space-x-3 w-full hover:bg-zinc-400/50 hover:dark:bg-zinc-700/50")}
                    onClick={() => router.push(`/me/conversation/${otherUser.id}`)}
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
                      <div className="flex flex-col">
                        <p className="text-sm">{otherUser.username}</p>
                        <AnimatePresence mode="wait">
                          {typing && (
                            <motion.p
                              key={typing ? "user_typing" : "user_not_typing"}
                              initial={onEnter}
                              animate={animate}
                              exit={onLeave}
                              className="text-[10px] italic text-zinc-400 text-left"
                            >
                              {typing}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.button>
                )
              }
            })}
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