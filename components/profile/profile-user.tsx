"use client"

import { useModal } from "@/app/hooks/useModalStore"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@prisma/client"
import { ArrowLeft, LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProfileSection from "./profile-section"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Separator } from "../ui/separator"
import { signOut } from "next-auth/react"

const ProfileUser = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [onOpen, setOnOpen] = useState(false)

  const { onClose, routerTab } = useModal()

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escapre" || event.keyCode === 27) {
        router.back()
      }
    }

    onClose()

    const windowWidth = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    windowWidth()

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("resize", windowWidth)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("resize", windowWidth)
    }
  }, [isMobile])

  return (
    <Tabs defaultValue={routerTab === "account-settings" ? "account-settings" : "profile"} orientation="vertical" className="flex px-5 py-2 md:space-x-5 md:p-2">
      {isMobile ? (
        <Sheet open={onOpen} onOpenChange={setOnOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute right-5 top-2.5 z-10">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <TabsList className="sticky flex flex-col items-start justify-start h-full space-y-2 bg-transparent top-2">
              <Button variant={"ghost"} className="justify-start w-full" onClick={() => router.back()}>
                <ArrowLeft size={16} className="mr-2" /> BACK
              </Button>
              <TabsTrigger onClick={() => setOnOpen(false)} value="profile" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700">Profile</TabsTrigger>
              <TabsTrigger onClick={() => setOnOpen(false)} value="account-settings" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700">Account Settings</TabsTrigger>
              <Separator className="bg-zinc-300 dark:bg-zinc-700" />
              <Button variant={"ghost"} className="justify-start w-full text-rose-500 focus:text-rose-500 hover:text-rose-500" onClick={() => signOut()}>
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
            </TabsList>
          </SheetContent>
        </Sheet>
      ) : (
        <TabsList className="sticky flex flex-col items-start justify-start h-full space-y-2 bg-transparent top-2">
          <Button variant={"ghost"} className="justify-start w-full" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-2" /> ESC
          </Button>
          <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700 hover:bg-zinc-100">Profile</TabsTrigger>
          <TabsTrigger value="account-settings" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700 hover:bg-zinc-100">Account Settings</TabsTrigger>
          <Separator className="bg-zinc-300 dark:bg-zinc-700" />
          <Button variant={"ghost"} className="justify-start w-full text-rose-500 focus:text-rose-500 hover:text-rose-500" onClick={() => signOut()}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </TabsList>
      )}
      <TabsContent value="profile" className="flex-1 h-full max-w-xl">
        <ProfileSection user={user} isMobile={isMobile} />
      </TabsContent>
      <TabsContent value="account-settings" className="flex-1 max-w-xl">
        <p className="text-xl font-semibold tracking-wider">Account Settings</p>
      </TabsContent>
    </Tabs>
  )
}
export default ProfileUser