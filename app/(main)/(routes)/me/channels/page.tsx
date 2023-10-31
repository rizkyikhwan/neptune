"use client"

import { useFriendPageStore } from "@/app/hooks/useFriendPageStore"
import { useModal } from "@/app/hooks/useModalStore"
import ActionTooltip from "@/components/action-tooltip"
import FriendProvider from "@/components/providers/friend-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { VariantFriend } from "@/lib/type"
import { capitalizeLetter, cn } from "@/lib/utils"
import { FriendRequest, User } from "@prisma/client"
import axios from "axios"
import { HelpCircle, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const MeChannelsPage = () => {
  const { data, status } = useSession()

  const { typePage, setTypePage, friends, friendRequest, setFriends, setFriendRequest, resetData } = useFriendPageStore()
  const { onOpen } = useModal()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      if (data.user.isNewUser) {
        onOpen("infoApp")
      }
    }
    resetData()
  }, [status])

  const getFriends = async () => {
    try {
      setIsLoading(true)
      const resFriends = await axios.get("/api/users/friends")
      const dataFriends = resFriends.data

      const resFriendRequest = await axios.get("/api/users/friend-request")
      const dataFriendRequest = resFriendRequest.data

      const friendRequestData = dataFriendRequest.data.map((item: FriendRequest & { userRequest: User }) => item.userRequest)

      setFriends(dataFriends.data)
      setFriendRequest(friendRequestData)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    getFriends()
  }, [])

  const variantFriend: VariantFriend[] = ["ONLINE", "ALL", "PENDING", "ADD_FRIEND"]

  return (
    <main className="flex flex-col fixed inset-y-0 h-full w-full md:w-[calc(100%-313px)]">
      <section className="min-h-[48px] shadow py-2 px-4 border-b flex items-center relative">
        <div className="flex items-center flex-auto space-x-3 overflow-auto scrollbar-none">
          <Users className="flex-none w-5 h-5" />
          <p>Friends</p>
          <Separator orientation="vertical" className="h-6 bg-zinc-300 dark:bg-zinc-700" />
          {variantFriend.map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={cn(
                "text-base w-auto h-auto px-2 py-0.5 whitespace-nowrap dark:text-zinc-400 hover:dark:text-zinc-300 text-zinc-500",
                typePage === item && "bg-zinc-200/50 dark:bg-zinc-600/50 cursor-default dark:text-zinc-50"
              )}
              onClick={() => {
                setTypePage(item)
              }}
            >
              {item.includes("_") ? capitalizeLetter(item.split("_").join(" ")) : capitalizeLetter(item)}
              {item === "PENDING" && friendRequest.length > 0 && <span className="flex items-center justify-center px-1.5 ml-2 text-xs text-white rounded-full bg-rose-500">{friendRequest.length > 99 ? "99+" : friendRequest.length}</span>}
            </Button>
          ))}
        </div>
        <div className="flex items-center ml-3 after:absolute after:top-0 after:right-[51px] after:w-2 after:h-full after:bg-gradient-to-l after:dark:from-dark-primary after:dark:via-dark-primary/90 after:from-white">
          <ActionTooltip label="What's is this?" align="end">
            <Button size="icon" variant="ghost" className="w-auto h-auto hover:bg-transparent" onClick={() => onOpen("infoApp")}>
              <HelpCircle />
            </Button>
          </ActionTooltip>
        </div>
      </section>
      <div className="relative flex h-full">
        <div className="flex-1 w-full">
          <FriendProvider
            type={typePage}
            friends={friends}
            friendRequest={friendRequest}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  )
}
export default MeChannelsPage