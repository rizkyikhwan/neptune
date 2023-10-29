"use client"

import LayoutChannelsSidebar from "@/components/layout-channels-sidebar"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const MeSidebar = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <LayoutChannelsSidebar
        channelHeader={
          <div className="flex-1 px-2">
            <button type="button" onClick={() => setOpen(true)} className="flex items-center w-full transition rounded group gap-x-2 dark:bg-zinc-900/80 bg-zinc-200 py-1 px-2 text-sm dark:text-zinc-400">
              Find Server
            </button>
          </div>
        }
      >
        <div className="my-2 space-y-3">
          <div>
            <Link href={"/me/channels"} className="group">
              <div className={cn(pathname?.includes("me") && "bg-zinc-300/50 dark:bg-zinc-600/50", "flex items-center p-2 rounded space-x-3")}>
                <Users className="w-5 h-5" />
                <p>Friends</p>
              </div>
            </Link>
          </div>
          <div>
            <p className="uppercase text-xs font-semibold tracking-wider text-zinc-400 hover:text-zinc-500 hover:dark:text-white select-none">Direct Messages</p>
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
            <CommandItem className="cursor-pointer space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-zinc-100 bg-zinc-600 text-sm">
                  T
                </AvatarFallback>
              </Avatar>
              <span>Tes server</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading={"Direct Messages"}>
            <CommandItem className="cursor-pointer space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-zinc-100 bg-zinc-600 text-sm">
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