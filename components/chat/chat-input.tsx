"use client"

import { useMessagesStore } from "@/app/hooks/useMessagesStore"
import { convertBase64, removeNewlines } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { ImageIcon, Loader2, Plus, SendHorizonal, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { FormEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSocket } from "../providers/socket-provider"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useModal } from "@/app/hooks/useModalStore"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/type"
import { Input } from "../ui/input"
import Image from "next/image"

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  otherUser: Omit<User, "password" | "verifyToken" | "verifyTokenExpiry" | "friendsRequestIDs" | "resetPasswordToken" | "resetPasswordTokenExpiry">
  currentUser: User
  type: "conversation" | "channel"
}

const formSchema = z.object({
  content: z.string().min(1),
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

  const isLoading = form.formState.isSubmitting

  const handleFileChange = async (files: FileList) => {
    const file = files && files[0];
    const imageDataUrl = await convertBase64(file);

    if (file.type === "image/gif") {
      setMsgImagePreview(imageDataUrl as string)
    } else {
      file && onOpen("messageImage", { image: imageDataUrl as string })
    }
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
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

      const inputChat = document.getElementById("content")
      inputChat && inputChat.replaceChildren()

    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
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
      <div className="relative">
        <Form {...form}>
          <form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="absolute flex items-center justify-center w-6 h-6 p-1 transition rounded-full top-3.5 left-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 cursor-pointer z-10"
                >
                  <Plus className="text-white dark:text-[#313338]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem className="text-sm" onClick={e => e.preventDefault()}>
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="messageImage">
                          <ImageIcon size={18} className="mr-1.5" /> Image
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="messageImage"
                            className="hidden"
                            accept="image/jpeg, image/jpg, image/png, image/gif"
                            type="file"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={e => {
                              field.onChange(e.target.files ? e.target.files[0] : null)
                              console.log(e);

                              e.target.files && handleFileChange(e.target.files)
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => onOpen("messageFile", { apiUrl, query })}>
                  <Upload size={18} className="mr-1.5" /> Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <div className="relative"> */}
            {/* <FormField
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
                          <div aria-hidden="true" className="absolute py-4 overflow-hidden text-sm pointer-events-auto select-none top-4 left-14 text-ellipsis whitespace-nowrap text-zinc-400">
                            {`Message ${type === "conversation" ? name : "#" + name}`}
                          </div>
                        )}
                        {msgImagePreview && (
                          <div className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
                            <Image fill src={msgImagePreview} alt="message-image" className="object-cover" />
                          </div>
                        )}
                        <div
                          role="textbox"
                          aria-autocomplete="list"
                          spellCheck="true"
                          contentEditable={!isSubmitting}
                          id={field.name}
                          className="py-4 pr-10 overflow-y-auto text-sm break-words border-0 border-none rounded-md max-h-56 pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-400 contentEditable:focus:border-none contentEditable:focus:outline-none contentEditable:active:border-none contentEditable:active:outline-none contentEditable:text-zinc-600 contentEditable:dark:text-zinc-200"
                          onInput={onInput}
                          onKeyDown={(event) => {
                            handleKeyDown()

                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              isValid && !loadingMessage && onSubmit({ content: field.value })
                            }
                          }}
                          {...field}
                        />
                      </div>
                      <div className="absolute flex items-center top-3 right-3">
                        <button type="submit" className="w-6 h-6 p-1" disabled={loadingMessage || isLoading || isSubmitting}>
                          {isLoading || isSubmitting ? <Loader2 size={20} className="animate-spin text-zinc-500 dark:text-zinc-400" /> : <SendHorizonal size={20} className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )
              }}
            /> */}
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
                      <div>
                        <div className="relative">
                          {!field.value && (
                            <div aria-hidden="true" className="absolute top-0 py-4 overflow-hidden text-sm pointer-events-none select-none left-14 text-ellipsis whitespace-nowrap text-zinc-400">
                              {`Message ${type === "conversation" ? name : "#" + name}`}
                            </div>
                          )}
                          {msgImagePreview && (
                            <div className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
                              <Image fill src={msgImagePreview} alt="message-image" className="object-cover" />
                            </div>
                          )}
                          <div
                            role="textbox"
                            aria-autocomplete="list"
                            spellCheck="true"
                            contentEditable={!isSubmitting}
                            id={field.name}
                            className="py-4 pr-10 overflow-y-auto text-sm break-words border-0 border-none rounded-md max-h-56 pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-400 contentEditable:focus:border-none contentEditable:focus:outline-none contentEditable:active:border-none contentEditable:active:outline-none contentEditable:text-zinc-600 contentEditable:dark:text-zinc-200"
                            onInput={onInput}
                            onKeyDown={(event) => {
                              handleKeyDown()

                              if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault()
                                isValid && !loadingMessage && onSubmit({ content: field.value })
                              }
                            }}
                            {...field}
                          />
                        </div>
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
            {/* </div> */}
          </form>
        </Form>
      </div>
    </div>
  )

  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)}>
  //       <FormField
  //         control={form.control}
  //         name="content"
  //         render={({ field: { onChange, ...field }, formState: { isValid } }) => {
  //           const onInput = (e: FormEvent<HTMLElement>) => {
  //             const value = (e.target as any).innerText
  //             onChange(removeNewlines(value))
  //           }

  //           return (
  //             <FormItem>
  //               <FormControl>
  //                 <div className="relative p-4 py-6 shadow-[0_-2px_2px_0_rgba(0,0,0,0.05)]">
  //                   <AnimatePresence initial={false} mode="popLayout">
  //                     {typing && (
  //                       <motion.div
  //                         key="user_typing"
  //                         initial={{ y: 3, opacity: 0 }}
  //                         animate={{ y: 0, opacity: 1 }}
  //                         exit={{ y: 3, opacity: 0 }}
  //                         transition={{ type: "keyframes" }}
  //                         className="absolute left-0 w-full px-4 top-1"
  //                       >
  //                         <p className="text-xs italic text-zinc-400">{typing}</p>
  //                       </motion.div>
  //                     )}
  //                   </AnimatePresence>
  //                   <div className="relative">
  //                     <DropdownMenu>
  //                       <DropdownMenuTrigger asChild>
  //                         <button
  //                           type="button"
  //                           className="absolute flex items-center justify-center w-6 h-6 p-1 transition rounded-full top-3.5 left-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 cursor-pointer z-10"
  //                         >
  //                           <Plus className="text-white dark:text-[#313338]" />
  //                         </button>
  //                       </DropdownMenuTrigger>
  //                       <DropdownMenuContent align="start" className="w-40">
  //                         <DropdownMenuItem className="text-sm" onClick={e => e.preventDefault()}>
  //                           <FormField
  //                             control={form.control}
  //                             name="fileUrl"
  //                             render={({ field }) => (
  //                               <>
  //                                 <FormLabel htmlFor="message-image">
  //                                   <ImageIcon size={18} className="mr-1.5" /> Image
  //                                 </FormLabel>
  //                                 <Input
  //                                   id="message-image"
  //                                   className="hidden"
  //                                   accept="image/jpeg, image/jpg, image/png, image/gif"
  //                                   type="file"
  //                                   name={field.name}
  //                                   onBlur={field.onBlur}
  //                                   onChange={e => {
  //                                     field.onChange(e.target.files ? e.target.files[0] : null)
  //                                     console.log(e);

  //                                     e.target.files && handleFileChange(e.target.files)
  //                                   }}
  //                                 />
  //                               </>
  //                             )}
  //                           />
  //                         </DropdownMenuItem>
  //                         <DropdownMenuItem className="text-sm" onClick={() => onOpen("messageFile", { apiUrl, query })}>
  //                           <Upload size={18} className="mr-1.5" /> Document
  //                         </DropdownMenuItem>
  //                       </DropdownMenuContent>
  //                     </DropdownMenu>
  //                     <div className="relative">
  //                       {!field.value && (
  //                         <div aria-hidden="true" className="absolute top-0 py-4 overflow-hidden text-sm pointer-events-none select-none left-14 text-ellipsis whitespace-nowrap text-zinc-400">
  //                           {`Message ${type === "conversation" ? name : "#" + name}`}
  //                         </div>
  //                       )}
  //                       {msgImagePreview && (
  //                         <div className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
  //                           <Image fill src={msgImagePreview} alt="message-image" className="object-cover" />
  //                         </div>
  //                       )}
  //                       <div
  //                         role="textbox"
  //                         aria-autocomplete="list"
  //                         spellCheck="true"
  //                         contentEditable={!isSubmitting}
  //                         id={field.name}
  //                         className="py-4 pr-10 overflow-y-auto text-sm break-words border-0 border-none rounded-md max-h-56 pl-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-400 contentEditable:focus:border-none contentEditable:focus:outline-none contentEditable:active:border-none contentEditable:active:outline-none contentEditable:text-zinc-600 contentEditable:dark:text-zinc-200"
  //                         onInput={onInput}
  //                         onKeyDown={(event) => {
  //                           handleKeyDown()

  //                           if (event.key === 'Enter' && !event.shiftKey) {
  //                             event.preventDefault()
  //                             isValid && !loadingMessage && onSubmit({ content: field.value })
  //                           }
  //                         }}
  //                         {...field}
  //                       />
  //                     </div>
  //                     <div className="absolute flex items-center top-3 right-3">
  //                       <button type="submit" className="w-6 h-6 p-1" disabled={loadingMessage || isLoading || isSubmitting}>
  //                         {isLoading || isSubmitting ? <Loader2 size={20} className="animate-spin text-zinc-500 dark:text-zinc-400" /> : <SendHorizonal size={20} className="transition text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />}
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               </FormControl>
  //             </FormItem>
  //           )
  //         }}
  //       />
  //     </form>
  //   </Form>
  // )
}
export default ChatInput