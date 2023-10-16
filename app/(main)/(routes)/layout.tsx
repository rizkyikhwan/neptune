import NavigationSidebar from "@/components/navigation/navigation-sidebar"
import { currentUser } from "@/lib/currentUser"
import { redirect } from "next/navigation"

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()

  if (!user?.emailVerified) {
    return redirect("/verification")
  }

  // const test = (date: Date) => {
  //   console.log(date > new Date(Date.now() - 10 * 60 * 1000));
  // }

  // test(user.createdAt)

  return (
    <main className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar user={user} />
      </div>
      <section className="md:pl-[72px] h-full">
        {children}
      </section>
    </main>
  )
}
export default MainLayout