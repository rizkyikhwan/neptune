import { create } from "zustand"

interface UserTypingStore {
  typing: string
  isTyping: boolean
  userTyping: string[]
  setTyping: (typing: string) => void
  setIsTyping: (isTyping: boolean) => void
  setUserTyping: (typingId: string) => void
  removeUserTyping: (typingId: string) => void
}

export const useUserTyping = create<UserTypingStore>((set) => ({
  typing: "",
  isTyping: false,
  userTyping: [],
  setTyping: (typing) => set({ typing }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setUserTyping: (typingId) => {
    set(state => ({
      userTyping: [
        ...state.userTyping,
        typingId
      ]
    }))
  },
  removeUserTyping: (typingId) => {
    set((state) => ({
      userTyping: state.userTyping.filter((userId) => userId !== typingId),
    }));
  }
}))