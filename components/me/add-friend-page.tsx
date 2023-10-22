import ActionTooltip from "@/components/action-tooltip"
import InputFormComp from "@/components/form/input-form-comp"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import UserAvatar from "@/components/user/user-avatar"
import { VariantFriend } from "@/lib/type"
import { capitalizeLetter } from "@/lib/utils"
import { motion } from "framer-motion"
import { UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"

interface AddFriendPageProps {
  type: VariantFriend
}

const AddFriendPage = ({ type }: AddFriendPageProps) => {
  const { register } = useForm()

  const onHandleChange = (e: string) => {

  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="mx-5 mt-4 space-y-4">
        <div>
          <p className="uppercase font-semibold tracking-wider">{capitalizeLetter(type.split("_").join(" "))}</p>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">Find your friends with their Neptune username.</p>
        </div>
        <div className="relative">
          <InputFormComp
            className="pr-32 md:pr-40 border-0 rounded-sm h-12 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-500"
            placeholder="Add friends with their Neptune username."
            autoComplete="off"
            {...register("search", {
              onChange: (event) => {
                onHandleChange(event.target.value)
              },
            })}
          />
          <Button variant={"ghost"} className="absolute right-1.5 top-1.5 rounded h-9 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white md:text-base text-xs">Search Friends</Button>
        </div>
      </div>
      <Separator className="bg-zinc-300 dark:bg-zinc-700" />
      <div className="flex flex-col ml-3 md:mx-5 h-[calc(100%-205px)]">
        <ScrollArea className="flex-1 pr-3">
          {[...Array(40)].map((_, i) => (
            <motion.div
              layout
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between py-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/10 hover:dark:bg-zinc-400/10 px-2 rounded-md cursor-pointer select-none mb-1"
              tabIndex={0}
            >
              <div className="flex items-start space-x-2 flex-grow">
                <UserAvatar initialName={`${i + 1}`} />
                <div className="flex flex-col">
                  <p>{i + 1}</p>
                  <p className="text-xs text-zinc-400">{i}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant={"ghost"} className="flex items-center justify-center bg-accent hover:bg-emerald-500 hover:text-white">
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