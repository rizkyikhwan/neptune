"use client"

import { useMessagesStore } from "@/app/hooks/useMessagesStore"
import { useModal } from "@/app/hooks/useModalStore"
import ActionTooltip from "@/components/action-tooltip"
import AnimateLayoutProvider from "@/components/providers/animate-layout-provider"
import { useSocket } from "@/components/providers/socket-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/type"
import { cn, convertBase64, removeNewlines } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { ImageIcon, Loader2, Plus, SendHorizonal, Trash, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  otherUser: Omit<User, "password" | "verifyToken" | "verifyTokenExpiry" | "friendsRequestIDs" | "resetPasswordToken" | "resetPasswordTokenExpiry">
  currentUser: User
  type: "conversation" | "channel"
}

const formSchema = z.object({
  content: z.string().optional().nullable(),
  fileUrl: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 2000000, `Max image size is 2MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""), "only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional()
    .nullable()
})

const ChatInput = ({ apiUrl, query, name, otherUser, currentUser, type }: ChatInputProps) => {
  const router = useRouter()
  const { socket } = useSocket()
  const { onOpen } = useModal()
  const { isLoading: loadingMessage } = useMessagesStore()

  const [typing, setTyping] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [msgImagePreview, setMsgImagePreview] = useState("")
  const [isOpen, setIsOpen] = useState(false)

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
      content: "",
      fileUrl: undefined
    }
  })

  const isError = form.formState.errors
  const isLoading = form.formState.isSubmitting

  const handleFileChange = async (files: FileList) => {
    const file = files && files[0];
    const imageDataUrl = await convertBase64(file);

    setMsgImagePreview(imageDataUrl as string)
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      if (value.content || value.fileUrl) {
        const url = qs.stringifyUrl({
          url: apiUrl,
          query
        })

        if (!value.content) {
          await axios.post(url, {
            ...value,
            content: value.fileUrl
          })
        } else {
          await axios.post(url, value)
        }

        socket.emit("set-notification", {
          message: value.content,
          receiver: otherUser,
          sender: currentUser
        })

        form.reset()
        router.refresh()

        const inputChat = document.getElementById("content")
        inputChat && inputChat.replaceChildren()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
      setMsgImagePreview("")
    }
  }

  const handleKeyDown = () => {
    socket.emit("typing", {
      receiverId: otherUser.id,
      typer: currentUser,
      conversationId: query.conversationId
    })
  }


  return (
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
      <AnimateLayoutProvider className={cn(msgImagePreview && "mb-2")}>
        {msgImagePreview && (
          <>
            <div className="relative flex items-center mb-1 overflow-hidden border rounded-md w-44 h-4w-44 aspect-square bg-secondary">
              <Image
                fill
                src={msgImagePreview}
                alt="message-image"
                className={cn(isError.fileUrl && "border border-rose-500", "object-cover shadow-md rounded-md cursor-pointer")}
                onClick={() => onOpen("messageImageView", { image: msgImagePreview })}
              />
              <ActionTooltip label="Remove Image">
                <button
                  type="button"
                  className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 p-px m-1 rounded-sm shadow bg-rose-500 disabled:opacity-50"
                  onClick={() => {
                    form.setValue("fileUrl", null, { shouldDirty: true })
                    form.clearErrors("fileUrl")
                    setMsgImagePreview("")
                  }}
                  disabled={loadingMessage || isLoading || isSubmitting}
                >
                  <Trash size={14} className="text-white" />
                </button>
              </ActionTooltip>
            </div>
            {isError.fileUrl && <p className="text-xs text-rose-500">{isError.fileUrl.message}</p>}
          </>
        )}
      </AnimateLayoutProvider>
      <div className="relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild disabled={loadingMessage || isLoading || isSubmitting}>
                    <button
                      type="button"
                      className="absolute flex items-center justify-center w-6 h-6 p-1 transition rounded-full top-3.5 left-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 cursor-pointer z-10 disabled:opacity-50 disabled:cursor-default"
                      disabled={loadingMessage || isLoading || isSubmitting}
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <FormLabel htmlFor="messageImage" className="flex items-center flex-1">
                        <ImageIcon size={18} className="mr-1.5" /> Image
                      </FormLabel>
                      <Input
                        id="messageImage"
                        accept="image/jpeg, image/jpg, image/png, image/gif"
                        type="file"
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          field.onChange(e.target.files ? e.target.files[0] : null)

                          if (e.target.files) {
                            setIsOpen(false)
                            handleFileChange(e.target.files)
                          }
                        }}
                        className="hidden"
                        ref={field.ref}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm" onClick={() => onOpen("messageFile", { apiUrl, query })}>
                      <Upload size={18} className="mr-1.5" /> Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field: { onChange, ...field }, formState: { isValid } }) => {
                const onInput = (e: FormEvent<HTMLElement>) => {
                  const value = (e.target as any).innerText
                  onChange(removeNewlines(value))
                }

                return (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        {!field.value && (
                          <div aria-hidden="true" className="absolute top-0 py-4 overflow-hidden text-sm pointer-events-none select-none left-14 text-ellipsis whitespace-nowrap text-zinc-400">
                            {`Message ${type === "conversation" ? name : "#" + name}`}
                          </div>
                        )}
                        <div
                          role="textbox"
                          aria-autocomplete="list"
                          spellCheck="true"
                          contentEditable={isSubmitting ? "false" : "true"}
                          id={field.name}
                          className={cn("py-[26px] pr-10 contentEditable:py-4 overflow-y-auto text-sm break-words border-0 border-none rounded-md max-h-56 pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-400 contentEditable:focus:border-none contentEditable:focus:outline-none contentEditable:active:border-none contentEditable:active:outline-none contentEditable:text-zinc-600 contentEditable:dark:text-zinc-200")}
                          onInput={onInput}
                          onKeyDown={(event) => {
                            handleKeyDown()

                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              isValid && !loadingMessage && onSubmit({ content: field.value, fileUrl: msgImagePreview ? msgImagePreview : undefined })
                            }
                          }}
                          {...field}
                        />
                        <div className="absolute flex items-center top-3 right-3">
                          <button type="submit" className="w-6 h-6 p-1" disabled={loadingMessage || isLoading || isSubmitting}>
                            {isLoading || isSubmitting ? <Loader2 size={20} className="animate-spin text-zinc-500 dark:text-zinc-400" /> : <SendHorizonal size={20} className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />}
                          </button>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
export default ChatInput