import { User } from "@prisma/client"
import { create } from "zustand"

export type ModalType = "resetPassowrd" | "updatePassword" | "changeEmail" | "infoApp" | "removeFriend" | "profileUser" | "avatarCrop" | "bannerCrop"

interface ModalData {
  data?: User & { friends?: User[] }
  image?: string
}

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  routerTab?: string
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
  setRouterTab: (routerTab: string) => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  routerTab: "",
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, data: {} }),
  setRouterTab: (routerTab) => set({ routerTab }),
}))