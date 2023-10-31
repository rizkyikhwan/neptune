import { User } from "@prisma/client"
import { create } from "zustand"

export type ModalType = "resetPassowrd" | "infoApp" | "removeFriend" | "profileUser"

interface UserFriends {
  friends?: User
}

interface ModalData {
  data?: User & { friends?: User[] }
}

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false })
}))