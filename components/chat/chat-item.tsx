"use client"

import { User } from "@prisma/client"
import axios from "axios"
import qs from "query-string"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import UserAvatar from "../user/user-avatar"
import ActionTooltip from "../action-tooltip"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Edit, Trash } from "lucide-react"

interface ChatItemProps {
  id: string
  content: string
  user: User
  otherUser: User
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1)
})

const ChatItem = ({ id, content, user, otherUser, timestamp, fileUrl, deleted, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false)

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

  const isOwner = otherUser.id === user.id
  const canEditMessage = !deleted && isOwner && !fileUrl

  return (
    <div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
      <div className="flex items-start w-full group gap-x-2">
        <div className="transition cursor-pointer hover:drop-shadow-md">
          <UserAvatar initialName={otherUser.displayname || otherUser.username} bgColor={otherUser.hexColor} src={otherUser.avatar || ""} />
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
            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form className="flex items-center w-full pt-2 gap-x-2" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative w-full">
                          <Input 
                            className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">Press escape to cancel, enter to save</span>
            </Form>
          )}
        </div>
      </div>
      {isOwner && (
        <div className="absolute items-center hidden p-1 bg-white border rounded-sm group-hover:flex gap-x-2 -top-2 right-5 dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit onClick={() => setIsEditing(true)} className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300" />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300" 
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
export default ChatItem