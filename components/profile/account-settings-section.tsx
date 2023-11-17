import { useModal } from "@/app/hooks/useModalStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { User } from "@prisma/client"

const AccountSettingsSection = ({ user }: { user: User }) => {
  const { onOpen } = useModal()

  return (
    <div className="relative mb-20 space-y-4">
      <p className="text-xl font-semibold tracking-wider">Account Settings</p>
      <div className="space-y-3">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase dark:text-zinc-300">
              Email
            </p>
            <div className="flex items-center w-full max-w-md space-x-3">
              <Input value={user.email} readOnly className="text-current border-0 rounded-sm read-only:cursor-default bg-muted dark:bg-zinc-800 dark:text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Button variant={"primary"} onClick={() => onOpen("changeEmail", { data: user })}>Edit</Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase dark:text-zinc-300">
              Password
            </p>
            <Button variant={"ghost"} className="text-white hover:text-white bg-emerald-600 hover:bg-emerald-700" onClick={() => onOpen("updatePassword")}>Update Password</Button>
          </div>
        </div>
        <Separator className="bg-zinc-300 dark:bg-zinc-700" />
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase dark:text-zinc-300">Account Removal</p>
          <p className="text-xs">Inactive accounts can still be recovered</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Button type="button" variant={"ghost"} className="border cursor-default border-rose-500" disabled>Deactive account</Button>
              <Button type="button" variant={"ghost"} className="text-white border cursor-default border-rose-500 bg-rose-500 hover:bg-rose-500 hover:text-white" disabled>Delete account</Button>
            </div>
            <p className="text-xs font-semibold tracking-wide text-zinc-400">Note: this feature is coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccountSettingsSection