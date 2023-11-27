import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, initialText, userIsOnline } from "@/lib/utils"
import { useSocket } from "../providers/socket-provider"

interface UserAvatarProps {
  id: string
  src?: string
  className?: string
  classNameFallback?: string
  bgColor?: string
  initialName: string
  onlineIndicator?: boolean
}

const UserAvatar = ({ id, src, className, classNameFallback, bgColor, initialName, onlineIndicator }: UserAvatarProps) => {
  const { onlineUsers } = useSocket()

  return (
    <div className="relative pointer-events-none">
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarImage className="object-cover" src={src} />
        <AvatarFallback
          className={cn("font-semibold text-xs md:text-base", bgColor ? "text-zinc-100" : "bg-muted", classNameFallback)}
          style={{ backgroundColor: bgColor }}
        >
          {initialText(initialName)}
        </AvatarFallback>
      </Avatar>
      {onlineIndicator && userIsOnline(onlineUsers, id) && (
        <div className="absolute w-2 h-2 border rounded-full bottom-px right-1 bg-emerald-500 bg-background" />
      )}
    </div>
  )
}
export default UserAvatar