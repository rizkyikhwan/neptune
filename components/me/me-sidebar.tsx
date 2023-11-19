"use client"

import LayoutChannelsSidebar from "@/components/layout-channels-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next13-progressbar"
import { useState } from "react"

const MeSidebar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
              <div className={cn(pathname?.includes("me") && "bg-zinc-300/50 dark:bg-zinc-600/50", "flex items-center p-2 rounded space-x-3")}>
                <Users className="w-5 h-5" />
                <p>Friends</p>
              </div>
            </button>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase select-none text-zinc-400 hover:text-zinc-500 hover:dark:text-white">Direct Messages</p>
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