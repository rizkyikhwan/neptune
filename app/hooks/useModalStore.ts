import { User } from "@prisma/client"
import { create } from "zustand"

export type ModalType = "resetPassowrd" | "infoApp" | "removeFriend" | "profileUser"

interface ModalData {
  data?: User & { friends?: User[] }
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
  onClose: () => set({ isOpen: false }),
  setRouterTab: (routerTab) => set({ routerTab }),
}))