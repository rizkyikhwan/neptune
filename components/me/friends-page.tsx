import { useFriendPageStore } from "@/app/hooks/useFriendPageStore"
import ActionTooltip from "@/components/action-tooltip"
import InputFormComp from "@/components/form/input-form-comp"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user/user-avatar"
import { UsersProps, VariantFriend } from "@/lib/type"
import { capitalizeLetter, cn, initialText } from "@/lib/utils"
import axios from "axios"
import { motion } from "framer-motion"
import { Check, MessageSquare, MoreVertical, Search, UserX, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import LoadingItem from "./loading-item"
import { User } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useModal } from "@/app/hooks/useModalStore"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu"

type ActionRequest = "ACCEPT" | "REJECT"

interface FriendsPageProps {
  type: VariantFriend,
  isLoading: boolean
  users: UsersProps[]
}

const FriendsPage = ({ users, isLoading, type }: FriendsPageProps) => {
  const { register, resetField } = useForm()
  const { setFriends, setFriendRequest } = useFriendPageStore()
  const { onOpen } = useModal()


  const [filteredUsers, setFilteredUsers] = useState<UsersProps[]>([])

  const [isLoadingAction, setIsLoadingAction] = useState(false)

  useEffect(() => {
    users && setFilteredUsers(users)
    type && resetField("search")
  }, [users, type])

  const onHandleChange = (e: string) => {
    const filteredItems = users.filter((user) =>
      user.displayname?.toLowerCase().includes(e.toLowerCase()) || user.username.toLowerCase().includes(e.toLowerCase())
    )

    setFilteredUsers(filteredItems)
  }

  const handleRequest = async (id: string, action: ActionRequest) => {
    try {
      setIsLoadingAction(true)

      if (action === "ACCEPT") {
        await axios.post("/api/users/friends", { userId: id })
      } else if (action === "REJECT") {
        await axios.patch("/api/users/friend-request", { userId: id })
      }

      const res = await axios.get("/api/users/friends")
      const data = res.data

      setFriends(data.data)

      const filterUser = users.filter(user => user.id !== id)

      setFriendRequest(filterUser)
      setFilteredUsers(filterUser)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingAction(false)
    }
  }

  return (
    <div className={cn("mx-0 md:mx-5 mt-4 space-y-3 flex flex-col h-full", filteredUsers.filter(user => type === "ONLINE" ? user.online : user).length >= 15 ? "h-[calc(100%-64px)]" : "pb-16")}>
      <div className="relative mx-5 md:mx-0">
        <InputFormComp
          className="pr-8 border-0 rounded-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-500"
          placeholder="Search"
          autoComplete="off"
          {...register("search", {
            onChange: (event) => {
              onHandleChange(event.target.value)
            },
          })}
        />
        <Search className="absolute right-2 top-2 text-zinc-500 dark:text-zinc-300" size={20} />
      </div>
      <div className="flex items-center px-2 mx-3 space-x-1 text-xs text-zinc-500 dark:text-zinc-400 md:mx-0">
        <p className="uppercase">{capitalizeLetter(type)}</p>
        <Separator orientation="horizontal" className="w-3 h-[0.5px] bg-zinc-400" />
        <p>{filteredUsers.filter(user => type === "ONLINE" ? user.online : user).length}</p>
      </div>
      <ScrollArea className="flex-1 pr-3 ml-3 md:ml-0">
        {isLoading ? (
          <>
            {[...Array(10)].map((_, i) => (
              <LoadingItem key={i} />
            ))}
          </>
        ) : (
          <>
            {filteredUsers.filter(user => type === "ONLINE" ? user.online : user).map(user => (
              <motion.div
                layout
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                tabIndex={0}
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div className="flex items-center justify-between px-2 py-2 mb-1 rounded-md cursor-pointer select-none border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/20 hover:dark:bg-zinc-400/10 data-[state=open]:dark:bg-zinc-400/10 data-[state=open]:bg-zinc-300/20">
                      <div className="flex items-start flex-grow space-x-2">
                        <UserAvatar bgColor={user.hexColor} initialName={user.displayname || user.username} onlineIndicator={user.online} />
                        <div className="flex flex-col">
                          <p>{user.displayname || user.username}</p>
                          <p className="text-xs text-zinc-400">{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {type === "PENDING" ? (
                          <>
                            <ActionTooltip label="Accept" side="top" align="center">
                              <Button variant={"ghost"} disabled={isLoadingAction} onClick={() => handleRequest(user.id, "ACCEPT")} className="flex items-center justify-center rounded-full w-9 h-9 bg-accent group">
                                <Check className="flex-none transition text-zinc-400 group-hover:text-emerald-500" size={20} />
                              </Button>
                            </ActionTooltip>
                            <ActionTooltip label="Reject" side="top" align="center">
                              <Button variant={"ghost"} disabled={isLoadingAction} onClick={() => handleRequest(user.id, "REJECT")} className="flex items-center justify-center rounded-full w-9 h-9 bg-accent group">
                                <X className="flex-none transition text-zinc-400 group-hover:text-rose-500" size={20} />
                              </Button>
                            </ActionTooltip>
                          </>
                        ) : (
                          <>
                            <ActionTooltip label="Message" side="top" align="center">
                              <Button variant={"ghost"} className="flex items-center justify-center rounded-full w-9 h-9 bg-accent group">
                                <MessageSquare className="flex-none transition group-hover:dark:text-zinc-200 text-zinc-400 group-hover:text-zinc-700" size={20} />
                              </Button>
                            </ActionTooltip>
                            <DropdownMenu>
                              <ActionTooltip label="More" side="top" align="end">
                                <DropdownMenuTrigger asChild>
                                  <Button variant={"ghost"} className="flex items-center justify-center rounded-full w-9 h-9 bg-accent group">
                                    <MoreVertical className="flex-none transition group-hover:dark:text-zinc-200 text-zinc-400 group-hover:text-zinc-700" size={20} />
                                  </Button>
                                </DropdownMenuTrigger>
                              </ActionTooltip>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onOpen("removeFriend", { data: user })} className="h-10 cursor-pointer text-rose-500 focus:text-rose-500">
                                  <UserX className="w-4 h-4 mr-2" />
                                  <span>Remove Friend</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onClick={() => onOpen("profileUser", { data: user })}>
                      Profile
                    </ContextMenuItem>
                    <ContextMenuItem>
                      Message
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-rose-500 focus:text-rose-500" onClick={() => onOpen("removeFriend", { data: user })}>
                      Remove Friend
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </motion.div>
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  )
}
export default FriendsPage