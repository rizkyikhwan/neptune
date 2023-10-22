import InputFormComp from "@/components/form/input-form-comp"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user/user-avatar"
import { SearchUser, VariantFriend } from "@/lib/type"
import { capitalizeLetter, initialText } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader2, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface AddFriendPageProps {
  type: VariantFriend
}

const formSchema = z.object({
  searchUser: z.string().min(1)
})

const AddFriendPage = ({ type }: AddFriendPageProps) => {
  const [dataSearch, setDataSearch] = useState<SearchUser[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchUser: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const handleFriendRequest = async (id: string) => {
    try {
      const res = await axios.post(`/api/users/friend-request`, { userId: id })
      const data = await res.data
      console.log(data)
    } catch (error) {
      console.log(error)
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
    <div className="flex flex-col space-y-4 h-full">
      <div className="mx-5 mt-4 space-y-4">
        <div>
          <p className="uppercase font-semibold tracking-wider">{capitalizeLetter(type.split("_").join(" "))}</p>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Find your friends with their Neptune username.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <FormField
              control={form.control}
              name="searchUser"
              render={({ field }) => (
                <InputFormComp
                  className="pr-32 md:pr-40 border-0 rounded-sm h-12 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-500"
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
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Search Friends"}
            </Button>
          </form>
        </Form>
      </div>
      <Separator className="bg-zinc-300 dark:bg-zinc-700" />
      <div className="flex flex-col ml-3 md:mx-5 h-[calc(100%-205px)]">
        <ScrollArea className="flex-1 pr-3">
          {dataSearch.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between py-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/10 hover:dark:bg-zinc-400/10 px-2 rounded-md cursor-pointer select-none mb-1"
              tabIndex={0}
            >
              <div className="flex items-start space-x-2 flex-grow">
                <UserAvatar bgColor={item.hexColor} initialName={`${initialText(item.username)}`} />
                <div className="flex flex-col">
                  <p>{item.displayname || item.username}</p>
                  <p className="text-xs text-zinc-400">{item.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant={"ghost"} onClick={() => handleFriendRequest(item.id)} className="flex items-center justify-center bg-accent hover:bg-emerald-500 hover:text-white">
                  <UserPlus className="md:hidden block" size={20} />
                  <span className="hidden md:block">Send Friend Request</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
export default AddFriendPage