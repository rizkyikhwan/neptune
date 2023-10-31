import { useFriendPageStore } from "@/app/hooks/useFriendPageStore"
import { useModal } from "@/app/hooks/useModalStore"
import axios from "axios"
import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

const RemoveFriendModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { setFriends } = useFriendPageStore()

  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === "removeFriend"

  const { data: user } = data

  const handleRemoveFriend = async (id?: string) => {
    try {
      setIsLoading(true)

      await axios.patch("/api/users/friends", { userId: id })


      const res = await axios.get("/api/users/friends")
      const data = res.data

      setFriends(data.data)

      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle className="text-2xl font-bold">
            Remove '{user?.username}'
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Are you sure you want to permanently remove <b>{user?.username}</b> from your friends?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-3">
          <Button variant={"ghost"} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={"destructive"} onClick={() => handleRemoveFriend(user?.id)} disabled={isLoading}>
            Remove Friend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default RemoveFriendModal