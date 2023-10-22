import ActionTooltip from "@/components/action-tooltip"
import InputFormComp from "@/components/form/input-form-comp"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user/user-avatar"
import { VariantFriend } from "@/lib/type"
import { capitalizeLetter, cn, initialText } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, MessageSquare, MoreVertical, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ScrollArea } from "../ui/scroll-area"

interface OnlinePageProps {
  id: number
  displayname?: string
  username: string
  online?: boolean
}

const FriendsPage = ({ users, type }: { users: OnlinePageProps[], type: VariantFriend }) => {
  const { register, resetField } = useForm()
  const [filteredUsers, setFilteredUsers] = useState<OnlinePageProps[]>([])

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

  return (
    <div className={cn("mx-5 mt-4 space-y-3 flex flex-col h-full", filteredUsers.filter(user => type === "ONLINE" ? user.online : user).length >= 15 ? "h-[calc(100%-64px)]" : "pb-16")}>
      <div className="relative">
        <InputFormComp
          className="pr-8 border-0 rounded-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-400"
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
      <div className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400 px-2">
        <p className="uppercase">{capitalizeLetter(type)}</p>
        <Separator orientation="horizontal" className="w-3 h-[0.5px] bg-zinc-400" />
        <p>{filteredUsers.filter(user => type === "ONLINE" ? user.online : user).length}</p>
      </div>
      <ScrollArea className="flex-1 pr-3">
        {filteredUsers.filter(user => type === "ONLINE" ? user.online : user).map(user => (
          <motion.div
            layout
            key={user.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between py-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/10 hover:dark:bg-zinc-400/10 px-2 rounded-md cursor-pointer select-none mb-1"
            tabIndex={0}
          >
            <div className="flex items-start space-x-2 flex-grow">
              <UserAvatar initialName={`${initialText(user.displayname || user.username)}`} />
              <div className="flex flex-col">
                <p>{user.displayname || user.username}</p>
                <p className="text-xs text-zinc-400">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {type === "PENDING" ? (
                <>
                  <ActionTooltip label="Accept" side="top" align="center">
                    <Button variant={"ghost"} className="rounded-full w-9 h-9 flex items-center justify-center bg-accent group">
                      <Check className="flex-none text-zinc-400 group-hover:text-emerald-500 transition" size={20} />
                    </Button>
                  </ActionTooltip>
                  <ActionTooltip label="Ignore" side="top" align="center">
                    <Button variant={"ghost"} className="rounded-full w-9 h-9 flex items-center justify-center bg-accent group">
                      <X className="flex-none text-zinc-400 group-hover:text-rose-500 transition" size={20} />
                    </Button>
                  </ActionTooltip>
                </>
              ) : (
                <>
                  <ActionTooltip label="Message" side="top" align="center">
                    <Button variant={"ghost"} className="rounded-full w-9 h-9 flex items-center justify-center bg-accent group">
                      <MessageSquare className="flex-none group-hover:dark:text-zinc-200 text-zinc-400 group-hover:text-zinc-700 transition" size={20} />
                    </Button>
                  </ActionTooltip>
                  <ActionTooltip label="More" side="top" align="center">
                    <Button variant={"ghost"} className="rounded-full w-9 h-9 flex items-center justify-center bg-accent group">
                      <MoreVertical className="flex-none group-hover:dark:text-zinc-200 text-zinc-400 group-hover:text-zinc-700 transition" size={20} />
                    </Button>
                  </ActionTooltip>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </ScrollArea>
    </div>
  )
}
export default FriendsPage