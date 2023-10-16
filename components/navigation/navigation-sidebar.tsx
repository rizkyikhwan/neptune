import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user-avatar"
import { User } from "@prisma/client"
import { AlertCircle, Compass, Plus } from "lucide-react"
import Link from "next/link"
import ActionTooltip from "../action-tooltip"

interface NavigationSidebarProps {
  user: User
}

const NavigationSidebar = ({ user }: NavigationSidebarProps) => {
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-dark-secondary bg-[#E3E5E8] py-3">
      <div>
        <ActionTooltip side="right" align="center" label="Add a server">
          <button className="flex items-center group">
            <div className="flex items-center justify-center w-12 h-12 mx-3 overflow-hidden transition-all rounded-3xl group-hover:rounded-2xl bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
              <Plus 
                className="transition group-hover:text-white text-emerald-500"
                size={25}
              />
            </div>
          </button>
        </ActionTooltip>
      </div>
      <div>
        <ActionTooltip side="right" align="center" label="Explore a server">
          <Link href={"/explore"} className="flex items-center group">
            <div className="flex items-center justify-center w-12 h-12 mx-3 overflow-hidden transition-all rounded-3xl group-hover:rounded-2xl bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
              <Compass 
                className="transition group-hover:text-white text-emerald-500"
                size={25}
              />
            </div>
          </Link>
        </ActionTooltip>
      </div>
      <Separator className="h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {[...Array(20)].map((_, i) => (
          <Link href={`/servers/${i + 1}`} key={i}>
            <div className="mb-4">
              <div className="flex items-center justify-center">
                <AlertCircle />
              </div>
            </div>
          </Link>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <UserAvatar bgColor={user.hexColor} initialName={user.username} />
      </div>
    </div>
  )
}
export default NavigationSidebar