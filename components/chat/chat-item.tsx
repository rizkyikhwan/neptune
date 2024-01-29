"use client"

import { useModal } from "@/app/hooks/useModalStore"
import ActionTooltip from "@/components/action-tooltip"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import UserAvatar from "@/components/user/user-avatar"
import { cn, removeNewlines, userIsOnline } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import axios from "axios"
import { Edit, FileIcon, Loader2, Pencil, SendHorizonal, Trash, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next13-progressbar"
import qs from "query-string"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSocket } from "../providers/socket-provider"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea } from "../ui/scroll-area"

interface ChatItemProps {
  id: string
  content: string
  user: User
  otherUser: User
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  isUpdated: boolean
  markNewMessage: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().transform(data => removeNewlines(data)).pipe(z.string().min(1))
})

const ChatItem = ({ id, content, user, otherUser, timestamp, fileUrl, deleted, isUpdated, markNewMessage, socketUrl, socketQuery }: ChatItemProps) => {
  const router = useRouter()
  const { onOpen, setRouterTab } = useModal()
  const { onlineUsers } = useSocket()
  const [isEditing, setIsEditing] = useState(false)
  const [isShowMore, setIsShowMore] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const userJoin = user && new Date(user.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })

      await axios.patch(url, value)

      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.code === "Escape") {
        setIsEditing(false)
        form.reset()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content])

  const fileType = fileUrl?.split(".").pop()

  const isOwner = otherUser.id === user.id
  const canDeleteMessage = !deleted && isOwner
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === "pdf" && fileUrl
  const isImage = !isPDF && fileUrl

  return (
    <div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
      {markNewMessage && (
        <div className="absolute top-0 left-0 w-[calc(100%-20px)] h-px mx-2 bg-rose-500">
          <div className="absolute top-0 right-0 rounded-sm">
            <div className="flex items-center text-[10px] text-white">
              <span className="px-1 tracking-wide uppercase rounded-b-sm bg-rose-500">New</span>
            </div>
          </div>
        </div>
      )}
      <Popover open={showProfile} onOpenChange={setShowProfile}>
        <div className="flex items-start w-full group gap-x-2">
          <PopoverTrigger asChild>
            <div className="transition cursor-pointer hover:drop-shadow-md">
              <UserAvatar id={otherUser.id} initialName={otherUser.displayname || otherUser.username} bgColor={otherUser.hexColor} src={otherUser.avatar || ""} />
            </div>
          </PopoverTrigger>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center" onClick={() => setShowProfile(!showProfile)}>
                <p className="text-sm font-semibold cursor-pointer hover:underline">
                  {otherUser.displayname || otherUser.username}
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>
            {isImage && (
              <>
                <div className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md md:w-60 md:h-w-60 aspect-square bg-secondary">
                  <Image fill src={fileUrl} blurDataURL={fileUrl} alt={content} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover cursor-pointer" priority onClick={() => onOpen("messageImageView", { image: fileUrl })} />
                </div>
                {fileUrl !== content && (
                  <>
                    <p className={cn("text-sm text-zinc-600 dark:text-zinc-300 break-all whitespace-pre-line", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                      {content.length > 200 && !isShowMore ? `${content.substring(0, 200)}...` : content}
                      {isUpdated && !deleted && (
                        <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                          (edited)
                        </span>
                      )}
                    </p>
                    {content.length > 200 && (
                      <div tabIndex={0} role="button" className="text-xs text-indigo-400 underline underline-offset-2" onClick={() => setIsShowMore(!isShowMore)}>{isShowMore ? "Show less" : "Show more"}</div>
                    )}
                  </>
                )}
              </>
            )}
            {isPDF && (
              <div className="relative flex items-center p-2 mt-2 rounded-md bg-[#edeff2] dark:bg-background/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                  PDF File
                </a>
              </div>
            )}
            {!fileUrl && !isEditing && (
              <>
                <p className={cn("text-sm text-zinc-600 dark:text-zinc-300 break-all whitespace-pre-line", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                  {content.length > 200 && !isShowMore ? `${content.substring(0, 200)}...` : content}
                  {isUpdated && !deleted && (
                    <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                      (edited)
                    </span>
                  )}
                </p>
                {content.length > 200 && (
                  <div tabIndex={0} role="button" className="text-xs text-indigo-400 underline underline-offset-2" onClick={() => setIsShowMore(!isShowMore)}>{isShowMore ? "Show less" : "Show more"}</div>
                )}
              </>
            )}
            {!fileUrl && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <div className="flex items-start w-full pt-2 gap-x-2">
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative w-full">
                              <Textarea
                                className="p-2 border-0 border-none resize-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                placeholder="Edited message"
                                disabled={isLoading}
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                        <Button size="icon" variant="primary" disabled={isLoading}>
                          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={18} />}
                        </Button>
                      </div>
                    )}
                  />
                </form>
                <div className="text-[10px] mt-1 text-zinc-400 flex">
                  Press
                  <button
                    type="reset"
                    onClick={() => {
                      if (!isLoading) {
                        setIsEditing(false)
                        form.reset()
                      }
                    }}
                    className="text-indigo-400 transition hover:text-indigo-500"
                    disabled={isLoading}
                  >
                    &nbsp;escape&nbsp;
                  </button>
                  to cancel
                </div>
              </Form>
            )}
          </div>
        </div>
        <PopoverContent align="start" side="right" className="p-0 overflow-hidden max-w-xl bg-[#F2F3F5] dark:bg-dark-tertiary">
          <div className="relative flex flex-col">
            {otherUser?.banner ? (
              <div className="w-full h-16">
                <Image fill src={otherUser.banner} className="object-cover" alt="banner" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" blurDataURL={otherUser.banner} />
              </div>
            ) : (
              <div className="w-full h-16" style={{ backgroundColor: otherUser.bannerColor }} />
            )}
            <div className="absolute z-10 flex items-start p-3 top-8">
              <UserAvatar id={otherUser.id} initialName={otherUser.displayname || otherUser.username} bgColor={otherUser.hexColor} src={otherUser.avatar || ""} className="w-4 h-4 md:w-12 md:h-12 bg-[#F2F3F5] dark:bg-dark-tertiary border-4 border-[#F2F3F5] dark:border-dark-tertiary" />
            </div>
            {otherUser.id === user.id && (
              <button
                className="absolute p-1 transition-opacity rounded-sm top-1 right-1 opacity-70 ring-offset-background hover:opacity-100 focus:outline-none bg-muted/50"
                onClick={() => {
                  router.push("/accounts-edit")
                  setRouterTab("profile")
                }}
              >
                <Pencil size={16} className="text-white" />
              </button>
            )}
          </div>
          <div className="flex flex-col space-y-2 min-h-[120px] h-full bg-white rounded-md dark:bg-dark-secondary mx-3 mb-3 mt-9 p-2">
            <div className="items-stretch justify-start w-full pb-2 bg-transparent border-b rounded-none border-border dark:border-zinc-500/30">
              <div className="flex items-start space-x-2">
                <div>
                  <p className="font-semibold tracking-wide">{otherUser.displayname || otherUser.username}</p>
                  <p className="text-xs text-zinc-400">{otherUser.username}</p>
                </div>
                <div className="flex items-center px-2 py-1 space-x-1 select-none">
                  <div className={cn("w-2 h-2 rounded-full bg-dark-tertiary", userIsOnline(onlineUsers, otherUser.id) && "bg-emerald-500")} />
                  <span className={cn(!userIsOnline(onlineUsers, otherUser.id) && "text-zinc-400", "text-xs")}>{userIsOnline(onlineUsers, otherUser.id) ? "Online" : "Offline"}</span>
                </div>
              </div>
            </div>
            <ScrollArea className="md:h-40">
              <div className="mt-2 space-y-1">
                <p className="text-xs font-semibold tracking-wide uppercase">About me</p>
                <p className="text-xs whitespace-pre-line">
                  {otherUser.bio ? otherUser.bio.length > 50 && !isShowMore ? `${otherUser.bio.substring(0, 50)}...` : otherUser.bio : "None"}
                </p>
                {otherUser.bio && otherUser.bio.length > 50 && (
                  <div tabIndex={0} role="button" className="text-xs text-indigo-400 underline underline-offset-2" onClick={() => setIsShowMore(!isShowMore)}>{isShowMore ? "Show less" : "Show more"}</div>
                )}
              </div>
              <div className="mt-5 space-y-1">
                <p className="text-xs font-semibold tracking-wide uppercase">Neptune member since</p>
                <p className="text-xs">{userJoin}</p>
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
      {canDeleteMessage && (
        <div className="absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 dark:bg-zinc-800">
          {canEditMessage && !isEditing && (
            <ActionTooltip label="Edit">
              <Edit onClick={() => setIsEditing(true)} className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300" />
            </ActionTooltip>
          )}
          {isEditing && (
            <ActionTooltip label="Cancel">
              <X
                onClick={() => {
                  if (!isLoading) {
                    setIsEditing(false)
                    form.reset()
                  }
                }}
                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => !isLoading && onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
              className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
export default ChatItem