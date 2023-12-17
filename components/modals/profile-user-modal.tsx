import { useModal } from "@/app/hooks/useModalStore"
import ActionTooltip from "@/components/action-tooltip"
import LoadingScreen from "@/components/loading-screen"
import { useSocket } from "@/components/providers/socket-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserAvatar from "@/components/user/user-avatar"
import { cn, userIsOnline } from "@/lib/utils"
import { User } from "@prisma/client"
import axios from "axios"
import { MessageSquare, MoreVertical, UserX } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next13-progressbar"
import { useEffect, useState } from "react"

const ProfileModalUser = () => {
  const router = useRouter()
  const { data: currentUser } = useSession()
  const { onlineUsers } = useSocket()
  const { isOpen, onOpen, onClose, setRouterTab, type, data } = useModal()

  const { data: user } = data

  const [mutualFriends, setMutualFriends] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isShowMore, setIsShowMore] = useState(false)

  const userJoin = user && new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })

  const isModalOpen = isOpen && type === "profileUser"

  useEffect(() => {
    const abortCotroller = new AbortController()

    if (isModalOpen) {
      (async () => {
        try {
          setIsLoading(true)
          const res = await axios.get(`/api/users/friends/mutuals/${user?.id}`, {
            signal: abortCotroller.signal
          })
          const data = res.data

          setMutualFriends(data.data)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      })()
    }

    return () => abortCotroller.abort()
  }, [user])

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-xl bg-[#F2F3F5] dark:bg-dark-primary min-h-screen md:min-h-max">
        <div className="relative flex flex-col">
          {user?.banner ? (
            <div className="absolute inset-0 w-full h-32 md:h-48">
              <Image fill src={user.banner} className="object-cover" alt="banner" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" blurDataURL={user.banner} />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-32" style={{ backgroundColor: user?.bannerColor }} />
          )}
          <div className={cn("z-10 flex items-end justify-between px-4 mt-20 md:mt-16", user?.banner && "mt-[72px] md:mt-32")}>
            <div className="flex items-center space-x-3">
              <UserAvatar
                id={user?.id || ""}
                src={user?.avatar || ""}
                initialName={user?.displayname || user?.username || ""}
                className="w-28 h-28 md:w-32 md:h-32 bg-[#F2F3F5] dark:bg-dark-primary border-[12px] border-[#F2F3F5] dark:border-dark-primary"
                bgColor={user?.hexColor}
                classNameFallback="text-2xl md:text-4xl"
              />
              {user && (
                <ActionTooltip label={userIsOnline(onlineUsers, user.id) ? "Online" : "Offline"} align="start">
                  <div className="flex items-center px-2 py-1 mt-12 space-x-1 bg-white rounded select-none dark:bg-dark-secondary">
                    <div className={cn("w-3 h-3 rounded-full bg-dark-tertiary", userIsOnline(onlineUsers, user.id) && "bg-emerald-500")} />
                    <span className="text-sm">{userIsOnline(onlineUsers, user.id) ? "Online" : "Offline"}</span>
                  </div>
                </ActionTooltip>
              )}
            </div>
            {currentUser?.user.id !== user?.id ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant={"ghost"}
                  className="hidden text-white rounded md:block bg-emerald-700 hover:bg-emerald-800 hover:text-white"
                  onClick={() => {
                    router.push(`/me/conversation/${user?.id}`)
                    onClose()
                  }}
                >
                  Send Message
                </Button>
                <DropdownMenu>
                  <ActionTooltip label="More" side="top" align="end">
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} size="icon" className="flex items-center justify-center rounded-full">
                        <MoreVertical className="flex-none transition text-zinc-400" size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                  </ActionTooltip>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem className="flex md:hidden" onClick={() => router.push(`/me/conversation/${user?.id}`)}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>Send Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpen("removeFriend", { data: user })} className="h-10 cursor-pointer text-rose-500 focus:text-rose-500">
                      <UserX className="w-4 h-4 mr-2" />
                      <span>Remove Friend</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant={"primary"}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => {
                  router.push("/accounts-edit")
                  setRouterTab("profile")
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className="flex flex-col p-3 mx-4 mt-5 mb-4 space-y-2 min-h-[320px] h-full bg-white rounded-md dark:bg-dark-secondary">
            <div>
              <p className="text-xl font-semibold tracking-wide">{user?.displayname || user?.username}</p>
              <p className="text-xs text-zinc-400">{user?.username}</p>
            </div>
            <Tabs defaultValue="user-info">
              <TabsList className="items-stretch justify-start w-full p-0 bg-transparent border-b rounded-none border-border dark:border-zinc-500/30">
                <TabsTrigger value="user-info" className="data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none">User Info</TabsTrigger>
                {currentUser?.user.id !== user?.id && (
                  <>
                    <TabsTrigger value="mutual-servers" className="data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none">Mutual Servers</TabsTrigger>
                    <TabsTrigger value="mutual-friends" className="data-[state=active]:border-b data-[state=active]:border-foreground data-[state=active]:bg-transparent rounded-none">Mutual Friends</TabsTrigger>
                  </>
                )}
              </TabsList>
              <TabsContent value="user-info">
                <ScrollArea className="md:h-48">
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold tracking-wide uppercase">About me</p>
                    <p className="text-xs whitespace-pre-line">
                      {user?.bio ? user.bio.length > 50 && !isShowMore ? `${user.bio.substring(0, 50)}...` : user.bio : "None"}
                    </p>
                    {user?.bio && user.bio.length > 50 && (
                      <div tabIndex={0} role="button" className="text-xs text-indigo-400 underline underline-offset-2" onClick={() => setIsShowMore(!isShowMore)}>{isShowMore ? "Show less" : "Show more"}</div>
                    )}
                  </div>
                  <div className="mt-5 space-y-1">
                    <p className="text-xs font-semibold tracking-wide uppercase">Neptune member since</p>
                    <p className="text-xs">{userJoin}</p>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="mutual-servers">
                <ScrollArea className="h-[calc(100vh-22.15rem)] pr-3 md:h-48">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className={cn("mb-1 flex items-center px-2 space-x-2 py-2 rounded-md cursor-pointer select-none border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/10 hover:dark:bg-zinc-400/10", [...Array(10)].length - 1 === index && "mb-0")}>
                      <UserAvatar id={user?.id || ""} initialName={`Server ${index + 1}`} className="rounded-xl" classNameFallback="rounded-xl" />
                      <p>Server {index + 1}</p>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="mutual-friends">
                <ScrollArea className="h-[calc(100vh-22.15rem)] md:h-48 pr-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[calc(100vh-22.15rem)] md:h-48">
                      <LoadingScreen />
                    </div>
                  ) : (
                    <>
                      {mutualFriends.map((user: User, index) => (
                        <div key={user.id} className={cn("mb-1 flex items-center px-2 space-x-2 py-2 rounded-md cursor-pointer select-none border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/10 hover:dark:bg-zinc-400/10", [...Array(10)].length - 1 === index && "mb-0")}>
                          <UserAvatar id={user.id} src={user.avatar || ""} initialName={user.displayname || user.username} bgColor={user.hexColor} onlineIndicator />
                          <div className="flex flex-col">
                            <p>{user.displayname || user.username}</p>
                            <p className="text-xs dark:text-zinc-400">{user.username}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default ProfileModalUser