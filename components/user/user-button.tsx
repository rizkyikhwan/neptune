import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/user/user-avatar"
import { User } from "@prisma/client"
import { LogOut, Moon, UserCog } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Switch } from "../ui/switch"

interface UserButtonProps {
  user: User
  side?: "top" | "right" | "bottom" | "left" | undefined
  align?: "center" | "start" | "end" | undefined
}

const UserButton = ({ user, side, align }: UserButtonProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <UserAvatar bgColor={user.hexColor} initialName={user.username} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side={side} align={align}>
        <DropdownMenuItem className="space-x-2 cursor-pointer">
          <UserAvatar bgColor={user.hexColor} initialName={user.username} />
          <div className="relative line-clamp-2">
            <p className="font-semibold tracking-wide">{user.username}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-10 cursor-pointer">
          <UserCog className="w-4 h-4 mr-2" />
          <span>Account settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-between h-10 cursor-pointer" onSelect={e => e.preventDefault()}>
          <div className="flex items-center">
            <Moon className="w-4 h-4 mr-2" />
            <span>Dark mode</span>
          </div>
          <Switch 
            checked={theme === "dark" ? true : false} 
            onCheckedChange={() => theme === "dark" ? setTheme("light") : setTheme("dark")} 
            className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-zinc-300" 
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-10 cursor-pointer text-rose-500 focus:text-rose-500" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserButton