import ActionTooltip from "@/components/action-tooltip"
import FormInput from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import UserAvatar from "@/components/user/user-avatar"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { AnimatePresence, Spring, motion } from "framer-motion"
import { Edit } from "lucide-react"
import { ColorPicker, useColor } from "react-color-palette"
import "react-color-palette/css"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"

const formSchema = z.object({
  displayname: z.string(),
  username: z.string().min(3).max(15),
  avatar: z.string(),
  hexColor: z.string(),
  banner: z.string(),
  bannerColor: z.string(),
  bio: z.string().max(32)
})

const ProfileSection = ({ user }: { user: User }) => {
  const [color, setColor] = useColor(user.hexColor)
  const [colorBanner, setColorBanner] = useColor(user.bannerColor)

  const onEnter = { y: 100 }
  const animate = { y: 0 }
  const onLeave = { y: 100 }

  const transitionSpringPhysics: Spring = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 5,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayname: user.displayname || "",
      username: user.username,
      avatar: user.avatar || "",
      hexColor: user.hexColor,
      banner: user.banner || "",
      bannerColor: user.bannerColor,
      bio: user.bio || ""
    }
  })

  const { setValue, getValues, reset, handleSubmit, control, formState } = form

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value)
  }

  return (
    <div className="relative space-y-4 min-h-screen">
      <p className="text-xl font-semibold tracking-wider">Profile</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3 flex flex-col">
            <div className="flex space-x-4">
              <div className="bg-[#F2F3F5] dark:bg-dark-tertiary max-w-sm rounded-md relative overflow-hidden flex-1">
                <div className="absolute inset-0 w-full h-20" style={{ backgroundColor: getValues("bannerColor") }} />
                <DropdownMenu>
                  <ActionTooltip label="Edit Banner" side="bottom">
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"} className="z-10 absolute right-2 top-2 rounded-full w-8 h-8">
                        <Edit size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                  </ActionTooltip>
                  <DropdownMenuContent side="left" align="start">
                    <DropdownMenuItem>
                      <label htmlFor="banner">
                        Change Banner
                      </label>
                      <FormField
                        control={control}
                        name="banner"
                        render={({ field }) => (
                          <FormInput id="banner" className="invisible absolute" type="file" accept="image/jpg, image/jpeg, image/png, image/gif" field={field} />
                        )}
                      />
                    </DropdownMenuItem>
                    {user.banner && (
                      <DropdownMenuItem>
                        Remove Banner
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="z-10 mt-10 px-5 pb-3 space-y-2">
                  <UserAvatar
                    initialName={user.displayname || user.username}
                    bgColor={getValues("hexColor")}
                    className="w-20 h-20 border-8 border-[#F2F3F5] dark:border-dark-tertiary"
                    classNameFallback="text-lg md:text-2xl"
                  />
                  <div>
                    <p className="text-lg font-semibold tracking-wide">Your Avatar</p>
                    <p className="text-xs text-zinc-400">This will be displayed on your profile</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col space-y-2">
                  <p className="text-xs font-extrabold uppercase dark:text-zinc-300">Banner Color</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="h-10 w-full rounded cursor-pointer" style={{ backgroundColor: getValues("bannerColor") }} />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-lg p-0">
                      <ColorPicker
                        color={colorBanner}
                        hideInput={["rgb", "hsv"]}
                        onChange={(e) => {
                          setColorBanner(e)
                          setValue("bannerColor", e.hex, { shouldDirty: true })
                        }}
                        height={100}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormField
                    control={control}
                    name="bannerColor"
                    render={({ field }) => (
                      <FormInput id="bannerColor" className="invisible absolute" field={field} />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar</p>
              <div className="space-x-2">
                <label htmlFor="avatar"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 dark:bg-dark-secondary cursor-pointer"
                >
                  Change Avatar
                </label>
                <div className="invisible absolute">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormInput id="avatar" type="file" accept="image/jpg, image/jpeg, image/png, image/gif" field={field} />
                    )}
                  />
                </div>
                {user.avatar && (
                  <Button variant={"ghost"}>Remove Avatar</Button>
                )}
              </div>
            </div>
            {!user.avatar && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar Color</p>
                <div className="space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="h-10 w-20 rounded cursor-pointer" style={{ backgroundColor: getValues("hexColor") }} />
                    </PopoverTrigger>
                    <PopoverContent className="rounded-lg p-0">
                      <ColorPicker
                        color={color}
                        hideInput={["rgb", "hsv"]}
                        onChange={(e) => {
                          setColor(e)
                          setValue("hexColor", e.hex, { shouldDirty: true })
                        }}
                        height={100}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormField
                    control={control}
                    name="hexColor"
                    render={({ field }) => (
                      <FormInput id="hexColor" className="invisible absolute" field={field} />
                    )}
                  />
                </div>
              </div>
            )}
            <Separator className="bg-zinc-300 dark:bg-zinc-700" />
            <FormField
              control={control}
              name="displayname"
              render={({ field }) => (
                <FormInput title="displayname" field={field} className="bg-muted dark:bg-zinc-800 dark:text-zinc-300 text-current" />
              )}
            />
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormInput title="username" field={field} className="bg-muted dark:bg-zinc-800 dark:text-zinc-300 text-current" />
              )}
            />
            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold tracking-wider uppercase dark:text-zinc-300">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-0 rounded-sm focus-visible-visible:ring-offset-0 bg-muted dark:bg-zinc-800 dark:text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoComplete="off"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-auto text-xs" />
                </FormItem>
              )}
            />
            <AnimatePresence mode="wait">
              {formState.isDirty && (
                <motion.div
                  initial={onEnter}
                  animate={animate}
                  exit={onLeave}
                  transition={transitionSpringPhysics}
                  className="fixed bottom-5 mx-auto max-w-2xl w-full flex items-center justify-between p-1.5 pl-3 bg-zinc-50 dark:bg-dark-secondary rounded-md shadow-sm z-10"
                >
                  <p className="text-sm">Careful — you have unsaved changes!</p>
                  <div className="space-x-2">
                    <Button type="reset" variant={"ghost"} onClick={() => reset()}>Reset</Button>
                    <Button type="submit" variant={"ghost"} className="bg-emerald-500 hover:bg-emerald-600 text-white">Save Changes</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Form>
    </div>
  )
}
export default ProfileSection