import { getAuthSession } from "@/lib/nextAuth"

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession()

  return (
    <main>
      <p>{session?.user.id}</p>
      {children}
    </main>
  )
}
export default HomeLayout