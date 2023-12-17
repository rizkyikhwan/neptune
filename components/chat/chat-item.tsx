"use client"

import { useModal } from "@/app/hooks/useModalStore"
import { cn } from "@/lib/utils"
import { User } from "@prisma/client"
import axios from "axios"
import { Edit, SendHorizonal, Trash, X } from "lucide-react"
import Image from "next/image"
import qs from "query-string"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import ActionTooltip from "../action-tooltip"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import UserAvatar from "../user/user-avatar"
import { Textarea } from "../ui/textarea"

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
  content: z.string().min(1)
})

const ChatItem = ({ id, content, user, otherUser, timestamp, fileUrl, deleted, isUpdated, markNewMessage, socketUrl, socketQuery }: ChatItemProps) => {
  const { onOpen } = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [isShowMore, setIsShowMore] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: content
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })
      console.log(value);

      // await axios.patch(url, value)

      // form.reset()
      // setIsEditing(false)
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

  const isOwner = otherUser.id === user.id
  const canDeleteMessage = !deleted && isOwner
  const canEditMessage = !deleted && isOwner && !fileUrl

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
      <div className="flex items-start w-full group gap-x-2">
        <div className="transition cursor-pointer hover:drop-shadow-md">
          <UserAvatar id={otherUser.id} initialName={otherUser.displayname || otherUser.username} bgColor={otherUser.hexColor} src={otherUser.avatar || ""} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="text-sm font-semibold cursor-pointer hover:underline">
                {otherUser.displayname || otherUser.username}
              </p>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {fileUrl && (
            <div className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
              <Image fill src={fileUrl} alt={content} className="object-cover" />
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
                      <Button size="icon" variant="primary" disabled={isLoading || !field.value}>
                        <SendHorizonal size={18} />
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