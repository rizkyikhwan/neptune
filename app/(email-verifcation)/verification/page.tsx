import CardVerification from "@/components/card/card-verification"
import { currentUser } from "@/lib/currentUser"
import { redirect } from "next/navigation"

const Verification = async () => {
  const user = await currentUser()

  if (!user) {
    return redirect("/")
  }

  if (user.emailVerified) {
    return redirect("/explore")
  }

  return (
    <main className="min-h-[100svh] flex flex-col-reverse items-center justify-center px-4 bg-[#1E1F22]">
      <CardVerification email={user.email} />
    </main>
  )
}
export default Verification