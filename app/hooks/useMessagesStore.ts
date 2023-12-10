import { create } from "zustand"

interface MessagesStore {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading })
}))