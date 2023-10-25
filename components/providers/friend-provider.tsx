import AddFriendPage from "@/components/me/add-friend-page"
import FriendsPage from "@/components/me/friends-page"
import { UsersProps, VariantFriend } from "@/lib/type"
import { User } from "@prisma/client"
import { redirect } from "next/navigation"

interface FriendProviderProps {
  type: VariantFriend
  friends: UsersProps[]
  friendRequest: User[]
  isLoading: boolean
}

const FriendProvider = ({ type, friends, friendRequest, isLoading }: FriendProviderProps) => {

  switch (type) {
    case "ONLINE":
      return <FriendsPage type="ONLINE" users={friends} isLoading={isLoading} />
    case "ALL":
      return <FriendsPage type="ALL" users={friends} isLoading={isLoading} />
    case "PENDING":
      return <FriendsPage type="PENDING" users={friendRequest} isLoading={isLoading} />
    case "ADD_FRIEND":
      return <AddFriendPage type="ADD_FRIEND" />
    default:
      return redirect("/404")
  }
}
export default FriendProvider