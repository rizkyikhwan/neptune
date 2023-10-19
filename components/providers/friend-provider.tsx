import { VariantFriend } from "@/lib/type"
import { redirect } from "next/navigation"

const FriendProvider = ({ type }: { type: VariantFriend }) => {

  switch (type) {
    case "ONLINE":
      return <p>halaman online</p>
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