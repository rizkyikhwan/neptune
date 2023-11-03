import InputFormComp from "@/components/form/input-form-comp"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user/user-avatar"
import { SearchUser, VariantFriend } from "@/lib/type"
import { capitalizeLetter } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "../ui/use-toast"
import LoadingItem from "./loading-item"

interface AddFriendPageProps {
  type: VariantFriend
}

const formSchema = z.object({
  searchUser: z.string().min(1)
})

const AddFriendPage = ({ type }: AddFriendPageProps) => {
  const { toast } = useToast()

  const [dataSearch, setDataSearch] = useState<SearchUser[]>([])
  const [requestLoading, setRequestLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchUser: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleFriendRequest = async (id: string) => {
    try {
      setRequestLoading(true)

      await axios.post(`/api/users/friend-request`, { userId: id })
    } catch (error: any) {
      console.log(error)
      toast({
        variant: "destructive",
        description: error.response.data.message,
      })
    } finally {
      setRequestLoading(false)
    }
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.get(`/api/users?search=${value.searchUser}`)
      const data = await res.data
      setDataSearch(data.data)
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="mx-5 mt-4 space-y-4">
        <div>
          <p className="font-semibold tracking-wider uppercase">{capitalizeLetter(type.split("_").join(" "))}</p>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Find your friends with their Neptune username.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <FormField
              control={form.control}
              name="searchUser"
              render={({ field }) => (
                <InputFormComp
                  className="h-12 pr-32 border-0 rounded-sm md:pr-40 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  placeholder="Find friends with their Neptune username."
                  autoComplete="off"
                  onChange={e => {
                    field.onChange(e)
                    e.target.value === "" && setDataSearch([])
                  }}
                  disabled={isLoading}
                />
              )}
            />
            <Button variant={"ghost"} className="absolute right-1.5 top-1.5 rounded h-9 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white md:text-base text-xs" disabled={isLoading}>
              {isLoading ? <Loading /> : "Search Friends"}
            </Button>
          </form>
        </Form>
      </div>
      <Separator className="bg-zinc-300 dark:bg-zinc-700" />
      <div className="flex flex-col ml-3 md:mx-5 h-[calc(100%-205px)]">
        <ScrollArea className="flex-1 pr-3">
          {isLoading ? (
            <>
              {[...Array(10)].map((_, i) => (
                <LoadingItem key={i} />
              ))}
            </>
          ) : (
            <>
              {dataSearch.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between px-2 py-2 mb-1 rounded-md cursor-pointer select-none border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/20 hover:dark:bg-zinc-400/10"
                  tabIndex={0}
                >
                  <div className="flex items-start flex-grow space-x-2">
                    <UserAvatar bgColor={item.hexColor} initialName={item.displayname || item.username} />
                    <div className="flex flex-col">
                      <p>{item.displayname || item.username}</p>
                      <p className="text-xs text-zinc-400">{item.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant={"ghost"} onClick={() => handleFriendRequest(item.id)} disabled={requestLoading} className="flex items-center justify-center bg-accent hover:bg-emerald-500 hover:text-white disabled:cursor-pointer">
                      <UserPlus className="block md:hidden" size={20} />
                      <span className="hidden md:block">Send Friend Request</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
export default AddFriendPage