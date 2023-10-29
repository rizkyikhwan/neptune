import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, initialText } from "@/lib/utils"

interface UserAvatarProps {
  src?: string
  className?: string
  classNameFallback?: string
  bgColor?: string
  initialName: string
  onlineIndicator?: boolean
}

const UserAvatar = ({ src, className, classNameFallback, bgColor, initialName, onlineIndicator }: UserAvatarProps) => {
  return (
    <div className="relative pointer-events-none">
      <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
        <AvatarImage src={src} />
        <AvatarFallback
          className={cn("font-semibold text-xs md:text-base", bgColor ? "text-zinc-100" : "bg-muted", classNameFallback)}
          style={{ backgroundColor: bgColor }}
        >
          {initialText(initialName)}
        </AvatarFallback>
      </Avatar>
      {onlineIndicator && (
        <div className="absolute border bottom-px right-1 w-2 h-2 rounded-full bg-emerald-500 bg-background" />
      )}
    </div>
  )
}
export default UserAvatar