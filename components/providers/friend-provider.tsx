import AddFriendPage from "@/components/me/add-friend-page"
import FriendsPage from "@/components/me/friends-page"
import { useSocket } from "@/components/providers/socket-provider"
import { UsersProps, VariantFriend } from "@/lib/type"
import { userIsOnline } from "@/lib/utils"
import { User } from "@prisma/client"

interface FriendProviderProps {
  type: VariantFriend
  friends: UsersProps[]
  friendRequest: User[]
  isLoading: boolean
}

const FriendsPageView = {
  "ONLINE": FriendsPage,
  "ALL": FriendsPage,
  "PENDING": FriendsPage,
  "ADD_FRIEND": AddFriendPage
}

const FriendProvider = ({ type, friends, friendRequest, isLoading }: FriendProviderProps) => {
  const { onlineUsers } = useSocket()
  const CurrentView = FriendsPageView[type]

  const userFriends = friends.map(user => ({ ...user, online: userIsOnline(onlineUsers, user.id) }))

  return <CurrentView type={type} isLoading={isLoading} users={type === "PENDING" ? friendRequest : userFriends} />
}
export default FriendProvider