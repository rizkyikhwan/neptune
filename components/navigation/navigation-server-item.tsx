import { cn, initialText } from "@/lib/utils"
import { Server } from "@prisma/client"
import ActionTooltip from "../action-tooltip"
import { useParams } from "next/navigation"
import Image from "next/image"

const NavigationServerItem = ({ server }: { server: Server }) => {
  const params = useParams()

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={server.name}
    >
      <button
        type="button"
        className="relative flex items-center group"
      >
        <div className={cn(
          "absolute left-0 bg-primary rounded-r-full transition-all w-1",
          !params?.serverId && "group-hover:h-5 group-hover:scale-100",
          params?.serverId ? "h-9" : "h-0 scale-0"
        )} />
        <div className={cn(
          "flex items-center justify-center w-12 h-12 mx-3 overflow-hidden transition-all rounded-3xl group-hover:rounded-2xl bg-background dark:bg-neutral-700 group-hover:bg-indigo-400",
          params?.serverId && "bg-indigo-400 dark:bg-indigo-400 text-primary rounded-2xl"
        )}>
          {server.imageUrl ? (
            <Image
              width={48}
              height={48}
              src={server.imageUrl}
              alt="Channel"
              className="object-cover"
            />
          ) : (
            <p>{initialText(server.name)}</p>
          )}
        </div>
      </button>
    </ActionTooltip>
  )
}
export default NavigationServerItem