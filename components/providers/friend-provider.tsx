import AddFriendPage from "@/components/me/add-friend-page"
import FriendsPage from "@/components/me/friends-page"
import { UsersProps, VariantFriend } from "@/lib/type"
import { User } from "@prisma/client"
import { redirect } from "next/navigation"

// const users_test = [
//   { displayname: "John", username: "son", id: "1", online: true },
//   { displayname: "Emily", username: "emily", id: "2", online: true },
//   { displayname: "Michael", username: "chen", id: "3", online: true },
//   { displayname: "Sarah", username: "sarah", id: "4", online: true },
//   { displayname: "David", username: "david", id: "5", online: false },
//   { displayname: "Jessica", username: "veranda", id: "6", online: false },
//   { displayname: "Daniel", username: "oniel", id: "7", online: true },
//   { displayname: "Olivia", username: "rodrigo", id: "8", online: false },
//   { displayname: "Matthew", username: "met", id: "9", online: true },
//   { displayname: "Sophia", username: "ful", id: "10", online: true },
//   { displayname: "John", username: "son", id: "11", online: true },
//   { displayname: "Emily", username: "emily", id: "12", online: true },
//   { displayname: "Michael", username: "chen", id: "13", online: true },
//   { displayname: "Sarah", username: "sarah", id: "14", online: true },
//   { displayname: "David", username: "david", id: "15", online: false },
//   { displayname: "Jessica", username: "veranda", id: "16", online: false },
//   { displayname: "Daniel", username: "oniel", id: "17", online: true },
//   { displayname: "Olivia", username: "rodrigo", id: "18", online: false },
//   { displayname: "Matthew", username: "met", id: "19", online: true },
//   { displayname: "Sophia", username: "ful", id: "20", online: true }
// ]

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