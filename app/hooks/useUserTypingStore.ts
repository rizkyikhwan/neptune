import { set } from "date-fns"
import { create } from "zustand"

interface UserTypingStore {
  isTyping: boolean
  conversationTyping: string
  userTyping: string[]
  setIsTyping: (isTyping: boolean) => void
  setConversationTyping: (conversationTyping: string) => void
  setUserTyping: (typingId: string) => void
  removeUserTyping: (typingId: string) => void
}

export const useUserTyping = create<UserTypingStore>((set) => ({
  isTyping: false,
  conversationTyping: "",
  userTyping: [],
  setIsTyping: (isTyping) => set({ isTyping }),
  setConversationTyping: (conversationTyping) => set({ conversationTyping }),
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