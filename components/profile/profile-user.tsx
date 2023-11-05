"use client"

import { useModal } from "@/app/hooks/useModalStore"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from "@prisma/client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ProfileSection from "./profile-section"

const ProfileUser = ({ user }: { user: User }) => {
  const router = useRouter()

  const { onClose, routerTab } = useModal()

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escapre" || event.keyCode === 27) {
        router.back()
      }
    }

    onClose()

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Tabs defaultValue={routerTab === "account-settings" ? "account-settings" : "profile"} orientation="vertical" className="flex space-x-5 p-2">
      <TabsList className="flex flex-col items-start h-full bg-transparent justify-start space-y-2 sticky top-2">
        <Button variant={"ghost"} className="w-full justify-start" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" /> ESC
        </Button>
        <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700">Profile</TabsTrigger>
        <TabsTrigger value="account-settings" className="data-[state=active]:bg-zinc-300 data-[state=active]:dark:bg-dark-secondary w-full justify-start text-xs md:text-sm hover:dark:bg-zinc-700">Account Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="flex-1 h-full pr-10">
        <ProfileSection user={user} />
      </TabsContent>
      <TabsContent value="account-settings" className="flex-1 pr-10">
        <p className="text-xl font-semibold tracking-wider">Account Settings</p>
      </TabsContent>
    </Tabs>
  )
}
export default ProfileUser