import ClientContextProvider from "@/app/context/ClientContext"
import MeSidebar from "@/components/me/me-sidebar"
import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic";

const LayoutMe = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()

  if (!user) {
    return redirect("/")
  }

  const conversation = await db.conversation.findMany({
    where: {
      userIds: {
        hasSome: [user.id, user.id]
      }
    },
    include: {
      users: true,
      directMessages: {
        include: {
          seen: true
        }
      }
    }
  })

  if (!conversation) {
    return null
  }

  return (
    <ClientContextProvider user={user} conversations={conversation}>
      <div className="h-full">
        <div className="fixed inset-y-0 flex-col hidden h-full md:flex w-60">
          <MeSidebar user={user} />
        </div>
        <div className="h-full md:pl-60">
          {children}
        </div>
      </div>
    </ClientContextProvider>
  )
}
export default LayoutMe