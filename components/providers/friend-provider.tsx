import AddFriendPage from "@/components/me/add-friend-page"
import FriendsPage from "@/components/me/friends-page"
import { VariantFriend } from "@/lib/type"
import axios from "axios"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

const users_test = [
  { displayname: "John", username: "son", id: "1", online: true },
  { displayname: "Emily", username: "emily", id: "2", online: true },
  { displayname: "Michael", username: "chen", id: "3", online: true },
  { displayname: "Sarah", username: "sarah", id: "4", online: true },
  { displayname: "David", username: "david", id: "5", online: false },
  { displayname: "Jessica", username: "veranda", id: "6", online: false },
  { displayname: "Daniel", username: "oniel", id: "7", online: true },
  { displayname: "Olivia", username: "rodrigo", id: "8", online: false },
  { displayname: "Matthew", username: "met", id: "9", online: true },
  { displayname: "Sophia", username: "ful", id: "10", online: true },
  { displayname: "John", username: "son", id: "11", online: true },
  { displayname: "Emily", username: "emily", id: "12", online: true },
  { displayname: "Michael", username: "chen", id: "13", online: true },
  { displayname: "Sarah", username: "sarah", id: "14", online: true },
  { displayname: "David", username: "david", id: "15", online: false },
  { displayname: "Jessica", username: "veranda", id: "16", online: false },
  { displayname: "Daniel", username: "oniel", id: "17", online: true },
  { displayname: "Olivia", username: "rodrigo", id: "18", online: false },
  { displayname: "Matthew", username: "met", id: "19", online: true },
  { displayname: "Sophia", username: "ful", id: "20", online: true }
]

const FriendProvider = ({ type }: { type: VariantFriend }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    switch (type) {
      case "PENDING":
       (async () => {
          try {
            setIsLoading(true)

            const res = await axios.get("/api/users/friend-request")
            const data = res.data
            
            const userData = data.data.friendsRequest.map((item: any) => item.userRequest)
            setUsers(userData)
          } catch (error) {
            console.log(error)
          } finally {
            setIsLoading(false)
          }
        })()
    }
  }, [type])

  switch (type) {
    case "ONLINE":
      return <FriendsPage type="ONLINE" users={users_test} isLoading={isLoading} />
    case "ALL":
      return <FriendsPage type="ALL" users={users_test} isLoading={isLoading} />
    case "PENDING":
      return <FriendsPage type="PENDING" users={users} isLoading={isLoading} />
    case "ADD_FRIEND":
      return <AddFriendPage type="ADD_FRIEND" />
    default:
      return redirect("/404")
  }
}
export default FriendProvider