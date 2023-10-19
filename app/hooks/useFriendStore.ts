import { VariantFriend } from "@/lib/type";
import { create } from "zustand";

interface FriendStore {
  typePage: VariantFriend
  setTypePage: (typePage: VariantFriend) => void
}

export const useFriendStore = create<FriendStore>((set) => ({
  typePage: "ONLINE",
  setTypePage: (typePage) => set({ typePage })
}))