"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader, Loader2, Plus, SendHorizonal } from "lucide-react"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSocket } from "../providers/socket-provider"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { useMessagesStore } from "@/app/hooks/useMessagesStore"

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  otherUser: Omit<User, "password" | "verifyToken" | "verifyTokenExpiry" | "friendsRequestIDs" | "resetPasswordToken" | "resetPasswordTokenExpiry">
  currentUser: User
  type: "conversation" | "channel"
}

const formSchema = z.object({
  content: z.string().min(1)
})

const ChatInput = ({ apiUrl, query, name, otherUser, currentUser, type }: ChatInputProps) => {
  const text = useRef('')
  const router = useRouter()
  const { socket } = useSocket()
  const { isLoading: loadingMessage } = useMessagesStore()

  const [typing, setTyping] = useState("")

  useEffect(() => {
    let timer: NodeJS.Timeout

    socket.on("get-typing", (data: any) => {
      otherUser.id === data.typer.id && setTyping(`${data.typer.displayname || data.typer.username} is typing...`)

      clearTimeout(timer)

      timer = setTimeout(() => {
        setTyping("")
      }, 2000);

    })

    return () => socket.off("get-typing")
  }, [socket])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      })

      await axios.post(url, value)

      socket.emit("set-notification", {
        message: value.content,
        receiver: otherUser,
        sender: currentUser
      })

      form.reset()
      router.refresh()
      // console.log(value);
      const inputChat = document.getElementById("input-chat")
      inputChat?.firstChild && inputChat.removeChild(inputChat.firstChild)

    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDown = () => {
    socket.emit("typing", {
      receiverId: otherUser.id,
      typer: currentUser,
      conversationId: query.conversationId
    })
  }

  function removeNewlines(str: string) {
    // Remove leading and trailing newlines using trim()
    str = str.trim();

    // Remove newline from the beginning of the string
    if (str.startsWith('\n')) {
      str = str.slice(1);
    }

    // Remove newline from the end of the string
    if (str.endsWith('\n')) {
      str = str.slice(0, -1);
    }

    return str;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field: { onChange, ...field }, formState: { isValid, isSubmitting, isSubmitSuccessful } }) => {
            const onInput = (e: FormEvent<HTMLElement>) => {
              const value = (e.target as any).innerText
              onChange(removeNewlines(value))
            }

            return <FormItem>
              <FormControl>
                <div className="relative p-4 py-6 shadow-[0_-2px_2px_0_rgba(0,0,0,0.05)]">
                  <AnimatePresence initial={false} mode="popLayout">
                    {typing && (
                      <motion.div
                        key="user_typing"
                        initial={{ y: 3, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 3, opacity: 0 }}
                        transition={{ type: "keyframes" }}
                        className="absolute left-0 w-full px-4 top-1"
                      >
                        <p className="text-xs italic text-zinc-400">{typing}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { }}
                      className="absolute flex items-center justify-center w-6 h-6 p-1 transition rounded-full top-3 left-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300"
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    {/* <Input
                      className="py-6 pr-10 break-words border-0 border-none pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                      autoComplete="off"
                      disabled={loadingMessage || isLoading}
                      onKeyDown={handleKeyDown}
                      {...field}
                    /> */}
                    <div
                      role="textbox"
                      aria-autocomplete="list"
                      spellCheck="true"
                      contentEditable
                      id="input-chat"
                      className="py-6 pr-10 break-words border-0 border-none pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 contentEditable:focus:border-none contentEditable:focus:outline-none contentEditable:active:border-none contentEditable:active:outline-none"
                      onInput={onInput}
                      onKeyDown={(event) => {
                        handleKeyDown()

                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          isValid && onSubmit({ content: field.value })
                        }
                      }}
                      {...field}
                    />
                    <div className="absolute inset-y-0 flex items-center right-3">
                      <button type="submit" className="flex items-center justify-center w-6 h-6" disabled={loadingMessage || isLoading || isSubmitting}>
                        {isLoading || isSubmitting ? <Loader2 size={20} className="animate-spin text-zinc-500 dark:text-zinc-400" /> : <SendHorizonal size={20} className="text-zinc-500 dark:text-zinc-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          }}
        />
      </form>
    </Form>
  )
}
export default ChatInput