import { currentUser } from "@/lib/currentUser"
import { redirect } from "next/navigation"

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()

  if (!user?.emailVerified) {
    return redirect("/verification")
  }

  return (
    <main>
      <p>user id: {user?.id}</p>
      <p>email verification: {`${user?.emailVerified}`}</p>
      {children}
    </main>
  )
}
export default HomeLayout