"use client"

import LayoutChannelsSidebar from "@/components/layout-channels-sidebar"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const MeSidebar = () => {
  const pathname = usePathname()

  return (
    <LayoutChannelsSidebar
      channelHeader={
        <>
          <p>Neptue</p>
        </>
      }
    >
      <div className="mt-2 space-y-2">
        <div>
          <Link href={"/me/channels"} className="group">
            <div className={cn(pathname?.includes("me") && "bg-zinc-300/50 dark:bg-zinc-600/50", "flex items-center p-2 rounded space-x-3")}>
              <Users className="w-5 h-5" />
              <p>Friends</p>
            </div>
          </Link>
        </div>
      </div>
    </LayoutChannelsSidebar>
  )
}
export default MeSidebar