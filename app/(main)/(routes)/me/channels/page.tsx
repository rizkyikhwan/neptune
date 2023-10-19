"use client"

import { useFriendStore } from "@/app/hooks/useFriendStore"
import { useModal } from "@/app/hooks/useModalStore"
import ActionTooltip from "@/components/action-tooltip"
import FriendProvider from "@/components/providers/friend-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { VariantFriend } from "@/lib/type"
import { capitalizeLetter, cn } from "@/lib/utils"
import { HelpCircle, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const MeChannelsPage = () => {
  const { data, status } = useSession()

  const { typePage, setTypePage } = useFriendStore()
  const { onOpen } = useModal()

  useEffect(() => {
    if (status === "authenticated") {
      if (data.user.isNewUser) {
        onOpen("infoApp")
      }
    }
  }, [status])

  const variantFriend: VariantFriend[] = ["ONLINE", "ALL", "PENDING", "ADD_FRIEND"]

  return (
    <main className="flex flex-col">
      <section className="min-h-[48px] shadow py-2 px-4 border-b flex items-center relative">
        <div className="flex items-center flex-auto space-x-3 overflow-auto">
          <Users className="w-5 h-5" />
          <p>Friends</p>
          <Separator orientation="vertical" className="h-6 bg-zinc-300 dark:bg-zinc-700" />
          {variantFriend.map((item) => (
            <Button
              key={item}
              variant="ghost"
              className={cn(
                typePage === item ? "bg-zinc-200/50 dark:bg-zinc-600/50 cursor-default dark:text-zinc-50" : "dark:text-zinc-400 hover:dark:text-zinc-300 text-zinc-500",
                "text-base w-auto h-auto px-2 py-0.5 whitespace-nowrap"
              )} 
              onClick={() => {
                setTypePage(item)
              }}
            >
              {item.includes("_") ? capitalizeLetter(item.split("_").join(" ")) : capitalizeLetter(item)}
            </Button>
          ))}
        </div>
        <div className="flex items-center ml-3 after:absolute after:top-0 after:right-[52px] after:w-2 after:h-full after:bg-gradient-to-l after:dark:from-dark-primary after:from-white">
          <ActionTooltip label="What's is this?" align="end">
            <Button size="icon" variant="ghost" className="w-auto h-auto hover:bg-transparent" onClick={() => onOpen("infoApp")}>
              <HelpCircle  />
            </Button>
          </ActionTooltip>
        </div>
      </section>
      <div className="relative flex h-full">
        <div className="flex-auto">
          <FriendProvider type={typePage} />
        </div>
        <div>
          aaaa
        </div>
      </div>
    </main>
  )
}
export default MeChannelsPage