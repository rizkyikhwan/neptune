import { toast } from "sonner"
import UserAvatar from "./user/user-avatar"
import { User } from "@prisma/client"
import Notif from "@/public/audio/notif.mp3"

interface ToastNotifocation {
  user: User
  message: string
}

const ToastNotifocation = ({ user, message }: ToastNotifocation) => {
  toast.custom(() => {
    return (
      <div className="flex items-center space-x-2 w-full md:w-[356px] p-4 border rounded-md shadow-md dark:bg-dark-secondary bg-[#F2F3F5]">
        <UserAvatar id={user.id} initialName={user.displayname || user.username} bgColor={user.hexColor} src={user.avatar || ""} className="w-8 h-8" />
        <div className="flex flex-col dark:text-zinc-100 text-zinc-900">
          <p className="text-base font-semibold">{user.displayname || user.username}</p>
          <p className="text-sm">{message.length > 150 ? `${message.slice(0, 150)}...` : message}</p>
        </div>
        <audio src={Notif} muted={false} autoPlay />
      </div>
    )
  })
}
export default ToastNotifocation