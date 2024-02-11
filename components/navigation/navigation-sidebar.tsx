"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserButton from "@/components/user/user-button"
import { Server, User } from "@prisma/client"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import NavigationHeader from "./navigation-header"
import { initialText } from "@/lib/utils"
import NavigationServerItem from "./navigation-server-item"

interface NavigationSidebarProps {
  user: User
  servers: Server[]
}

const NavigationSidebar = ({ user, servers }: NavigationSidebarProps) => {
  const pathname = usePathname()

  return (
    <div className="space-y-3 flex flex-col items-center h-full text-primary w-full dark:bg-dark-secondary bg-[#E3E5E8] py-3">
      <NavigationHeader pathname={pathname} />
      <Separator className="h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map(server => (
          <div key={server.id} className="mb-4">
            <NavigationServerItem server={server} key={server.id} />
          </div>
          // <Link href={`/servers/${server.id}`} key={server.id}>
          //   <div className="mb-4">
          //     <div className="flex items-center justify-center">
          //       {/* <AlertCircle /> */}
          //       <p>{initialText(server.name)}</p>
          //     </div>
          //   </div>
          // </Link>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <UserButton user={user} side="right" align="end" />
      </div>
    </div>
  )
}
export default NavigationSidebar