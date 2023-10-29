import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import UserAvatar from "../user/user-avatar"
import { Button } from "../ui/button"
import { MoreVertical } from "lucide-react"
import { useSession } from "next-auth/react"

const ProfileModalUser = () => {
  const { data: currentUser } = useSession()
  const { isOpen, onClose, type, data } = useModal()
  const { data: user } = data

  const isModalOpen = isOpen && type === "profileUser"

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-xl bg-[#F2F3F5] dark:bg-dark-primary">
        <div className="relative flex flex-col">
          <div className="absolute inset-0 w-full h-32 bg-indigo-500" />
          <div className="flex items-end justify-between px-4 z-10 mt-12">
            <div className="border-[12px] border-[#F2F3F5] dark:border-dark-primary rounded-full">
              <UserAvatar
                initialName={user?.displayname || user?.username || ""}
                className="md:w-32 md:h-32"
                bgColor={user?.hexColor}
                classNameFallback="md:text-4xl"
              />
            </div>
            {currentUser?.user.id !== user?.id && (
              <div className="flex items-center space-x-2">
                <Button variant={"ghost"} className="bg-emerald-700 hover:bg-emerald-800 rounded text-white hover:text-white">Send Message</Button>
                <button type="button">
                  <MoreVertical size={20} />
                </button>
              </div>
            )}
          </div>
          <div className="mx-4 p-3 mb-4 rounded-md mt-5 bg-white dark:bg-dark-secondary">
            <p className="text-xl font-semibold tracking-wide">{user?.displayname || user?.username}</p>
            <p className="text-xs text-zinc-400">{user?.username}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ProfileModalUser