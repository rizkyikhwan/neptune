import ActionTooltip from "@/components/action-tooltip"
import FormInput from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import UserAvatar from "@/components/user/user-avatar"
import { convertBase64 } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { AnimatePresence, Spring, motion } from "framer-motion"
import { Edit } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { ColorPicker, useColor } from "react-color-palette"
import "react-color-palette/css"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"

interface ProfileSectionProps {
  user: User,
  isMobile: boolean
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

const formSchema = z.object({
  displayname: z.string().optional(),
  username: z.string().min(3).max(15),
  avatar: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 5000000, `Max image size is 5MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""),"Only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional(),
  hexColor: z.string(),
  banner: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 5000000, `Max image size is 5MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""),"Only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional(),
  bannerColor: z.string(),
  bio: z.string().max(32)
})

const ProfileSection = ({ user, isMobile }: ProfileSectionProps) => {
  const [color, setColor] = useColor(user.hexColor)
  const [colorBanner, setColorBanner] = useColor(user.bannerColor)

  const [isOpen, setIsOpen] = useState(false)

  const onEnter = { y: 150 }
  const animate = { y: 0 }
  const onLeave = { y: 150 }

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
      avatar: undefined,
      hexColor: user.hexColor,
      banner: undefined,
      bannerColor: user.bannerColor,
      bio: user.bio || ""
    }
  })

  const { setValue, getValues, reset, handleSubmit, control, formState } = form

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value)
  }

  return (
    <div className="relative mb-20 space-y-4">
      <p className="text-xl font-semibold tracking-wider">Profile</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-3 md:flex-row md:space-x-4 md:space-y-0">
              <div className="bg-[#F2F3F5] dark:bg-dark-tertiary max-w-sm rounded-md relative overflow-hidden flex-1">
                <div className="absolute inset-0 w-full h-20" style={{ backgroundColor: getValues("bannerColor") }} />
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <ActionTooltip label="Edit Banner" side="left">
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"} className="absolute z-10 w-8 h-8 rounded-full right-2 top-2 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <Edit size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                  </ActionTooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <FormField
                        control={form.control}
                        name="banner"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="banner">
                              Change Banner
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="banner"
                                accept="image/jpeg, image/jpg, image/png, image/gif"
                                type="file"
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  field.onChange(e.target.files ? e.target.files[0] : null)
                                  e.target.files && setIsOpen(false)
                                }}
                                className="hidden"
                                ref={field.ref}
                              />
                            </FormControl>
                          </FormItem>
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
                <div className="z-10 px-5 pb-3 mt-10 space-y-2">
                  <UserAvatar
                    initialName={user.displayname || user.username}
                    src={user.avatar || ""}
                    bgColor={getValues("hexColor")}
                    className="w-20 h-20 border-8 border-[#F2F3F5] dark:border-dark-tertiary"
                    classNameFallback="text-lg md:text-2xl"
                  />
                  <div>
                    <p className="font-semibold tracking-wide md:text-lg">Your Avatar</p>
                    <p className="text-xs text-zinc-400">This will be displayed on your profile</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col space-y-2">
                  <p className="text-xs font-extrabold uppercase dark:text-zinc-300">Banner Color</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="w-20 h-10 rounded cursor-pointer md:w-full" style={{ backgroundColor: getValues("bannerColor") }} />
                    </PopoverTrigger>
                    <PopoverContent side={isMobile ? "right" : "bottom"} sideOffset={10} className="w-full p-0 rounded-lg">
                      <ColorPicker
                        color={colorBanner}
                        hideInput={["rgb", "hsv"]}
                        hideAlpha
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
                      <FormInput id="bannerColor" className="absolute invisible" field={field} />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar</p>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="avatar" className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md cursor-pointer disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground bg-zinc-200 dark:bg-dark-secondary">
                        Change Avatar
                      </FormLabel>
                      <FormMessage className="text-xs" />
                      <FormControl>
                        <Input
                          id="avatar"
                          accept="image/jpeg, image/jpg, image/png, image/gif"
                          type="file"
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            field.onChange(e.target.files ? e.target.files[0] : null)
                          }}
                          className="hidden"
                          ref={field.ref}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {user.avatar && (
                  <Button variant={"ghost"} type="reset">Remove Avatar</Button>
                )}
              </div>
            </div>
            {!user.avatar && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar Color</p>
                <div className="space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="w-20 h-10 rounded cursor-pointer" style={{ backgroundColor: getValues("hexColor") }} />
                    </PopoverTrigger>
                    <PopoverContent side={isMobile ? "right" : "bottom"} sideOffset={10} className="w-full p-0 rounded-lg">
                      <ColorPicker
                        color={color}
                        hideInput={["rgb", "hsv"]}
                        hideAlpha
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
                      <FormInput id="hexColor" className="absolute invisible" field={field} />
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
                <FormInput title="displayname" field={field} autoComplete="off" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" />
              )}
            />
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormInput title="username" field={field} autoComplete="off" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" />
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
            <div className="flex justify-center px-5">
              <AnimatePresence mode="wait">
                {formState.isDirty && (
                  <motion.div
                    initial={onEnter}
                    animate={animate}
                    exit={onLeave}
                    transition={transitionSpringPhysics}
                    className="fixed bottom-5 max-w-sm md:max-w-2xl w-full flex items-center justify-between p-1.5 pl-3 bg-zinc-50 dark:bg-dark-secondary rounded-md shadow-sm z-10"
                  >
                    <p className="text-xs md:text-sm">Careful — you have unsaved changes!</p>
                    <div className="flex space-x-2">
                      <Button type="reset" variant={"ghost"} onClick={() => reset()}>Reset</Button>
                      <Button type="submit" variant={"ghost"} className="text-xs text-white bg-emerald-500 hover:bg-emerald-600 md:text-sm">Save Changes</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
export default ProfileSection