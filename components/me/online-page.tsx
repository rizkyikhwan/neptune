import InputFormComp from "@/components/form/input-form-comp"
import { Separator } from "@/components/ui/separator"
import { VariantFriend } from "@/lib/type"
import { capitalizeLetter } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react"

interface OnlinePageProps {
  id: number
  firstName: string
  online: boolean
}

const OnlinePage = ({ users, type }: { users: OnlinePageProps[], type: VariantFriend }) => {
  const [filteredUsers, setFilteredUsers] = useState(users)

  const onHandleChange = (e: string) => {
    const filteredItems = users.filter((user) =>
      user.firstName.toLowerCase().includes(e.toLowerCase())
    )
  
    setFilteredUsers(filteredItems)
  }

  return (
    <div className="mx-5 my-4 space-y-3">
      <div className="relative">
        <InputFormComp 
          className="pr-8 border-0 rounded-sm h-9 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-900/80 bg-zinc-200 placeholder:dark:text-zinc-400" 
          placeholder="Search" 
          autoComplete="off" 
          onChange={e => {
            onHandleChange(e.target.value)
          }} 
        />
        <Search className="absolute right-2 top-2 text-zinc-500 dark:text-zinc-300" size={20} />
      </div>
      <div className="flex items-center space-x-1 text-xs text-zinc-500 dark:text-zinc-400">
        <p className="uppercase">{capitalizeLetter(type)}</p>
        <Separator orientation="horizontal" className="w-3 h-[0.5px] bg-zinc-400" />
        <p>{filteredUsers.filter(user => user.online).length}</p>
      </div>
      <div className="space-y-2">
        {filteredUsers.filter(user => user.online).map(user => (
           <p key={user.id}>{user.firstName}</p>
          )
        )}
      </div>
    </div>
  )
}
export default OnlinePage