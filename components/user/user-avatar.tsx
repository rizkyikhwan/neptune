import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, initialText } from "@/lib/utils"

interface UserAvatarProps {
  src?: string
  className?: string
  bgColor?: string
  initialName: string
}

const UserAvatar = ({ src, className, bgColor, initialName }: UserAvatarProps) => {
  return (
    <div className="relative pointer-events-none">
      <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
        <AvatarImage src={src} />
        <AvatarFallback
          className={cn(bgColor ? "text-zinc-100" : "bg-muted", "font-semibold")}
          style={{ backgroundColor: bgColor }}
        >
          {initialText(initialName)}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
export default UserAvatar