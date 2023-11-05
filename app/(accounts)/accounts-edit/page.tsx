import ProfileUser from "@/components/profile/profile-user"
import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/nextAuth"
import { redirect } from "next/navigation"

const MeProfilePage = async () => {
  const session = await getAuthSession()

  if (!session?.user?.email) {
    return redirect("/")
  }

  const data = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!data) {
    return redirect("/")
  }

  return (
    <main className="relative flex flex-col h-full max-w-4xl mx-auto">
      <ProfileUser user={data} />
    </main>
  )
}
export default MeProfilePage