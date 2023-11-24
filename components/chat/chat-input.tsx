"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useSocket } from "../providers/socket-provider"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: "conversation" | "channel"
}

const formSchema = z.object({
  content: z.string().min(1)
})

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const router = useRouter()
  const { socket } = useSocket()

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

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  }

  const handleKeyDown = () => {
    socket.emit("typing", "user is typing")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField 
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute flex items-center justify-center w-6 h-6 p-1 transition rounded-full top-7 left-8 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input 
                    className="py-6 break-words border-0 border-none px-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    autoComplete="off"
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
export default ChatInput