import { UsersProps, VariantFriend } from "@/lib/type";
import { create } from "zustand";

interface FriendStore {
  typePage: VariantFriend
  friends: UsersProps[]
  friendRequest: UsersProps[]
  setTypePage: (typePage: VariantFriend) => void
  setFriends: (friends: UsersProps[]) => void
  setFriendRequest: (friendRequest: UsersProps[]) => void
  resetData: () => void
}

export const useFriendPageStore = create<FriendStore>((set) => ({
  typePage: "ONLINE",
  friends: [],
  friendRequest: [],
  setTypePage: (typePage) => set({ typePage }),
  setFriends: (friends = []) => set({ friends }),
  setFriendRequest: (friendRequest = []) => set({ friendRequest }),
  resetData: () => set({ friends: [], friendRequest: [] })
}))