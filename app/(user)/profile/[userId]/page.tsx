import ProfileUser from "@/components/profile/profile-user"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const MeProfilePage = async ({ params }: { params: { userId: string } }) => {
  const data = await db.user.findUnique({
    where: {
      id: params.userId
    }
  })

  if (!data) {
    redirect("/")
  }

  return (
    <main className="relative flex flex-col h-full max-w-4xl mx-auto">
      <ProfileUser user={data} />
    </main>
  )
}
export default MeProfilePage