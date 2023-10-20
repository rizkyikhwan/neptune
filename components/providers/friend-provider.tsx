import OnlinePage from "@/components/me/online-page"
import { VariantFriend } from "@/lib/type"
import { redirect } from "next/navigation"

const users = [
  { firstName: "John", id: 1, online: true },
  { firstName: "Emily", id: 2, online: true },
  { firstName: "Michael", id: 3, online: true },
  { firstName: "Sarah", id: 4, online: true },
  { firstName: "David", id: 5, online: false },
  { firstName: "Jessica", id: 6, online: false },
  { firstName: "Daniel", id: 7, online: true },
  { firstName: "Olivia", id: 8, online: false },
  { firstName: "Matthew", id: 9, online: true },
  { firstName: "Sophia", id: 10, online: true }
]

const FriendProvider = ({ type }: { type: VariantFriend }) => {
  switch (type) {
    case "ONLINE":
      return <OnlinePage type={"ONLINE"} users={users} />
    case "ALL":
      return <p>halaman all</p>
    case "PENDING":
      return <p>halaman pending</p>
    case "ADD_FRIEND":
      return <p>halaman add friend</p>
    default:
      return redirect("/404")
  }
}
export default FriendProvider