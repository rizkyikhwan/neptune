import { useModal } from "@/app/hooks/useModalStore"
import FormInput from "@/components/form/form-input"
import Loading from "@/components/loading"
import AvatarCropModal from "@/components/modals/avatar-crop-modal"
import BannerCropModal from "@/components/modals/banner-crop-modal"
import AnimateLayoutProvider from "@/components/providers/animate-layout-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import UserAvatar from "@/components/user/user-avatar"
import { formSchemaEditProfile } from "@/lib/type"
import { convertBase64 } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, Spring, motion } from "framer-motion"
import { Edit } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ColorPicker, useColor } from "react-color-palette"
import "react-color-palette/css"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface ProfileSectionProps {
  user: User,
  isMobile: boolean
}

const ProfileSection = ({ user, isMobile }: ProfileSectionProps) => {
  const router = useRouter()
  const { onOpen } = useModal()

  const [color, setColor] = useColor(user.hexColor)
  const [colorBanner, setColorBanner] = useColor(user.bannerColor)

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState("")
  const [previewBanner, setPreviewBanner] = useState("")
  const [progress, setProgress] = useState(0)

  const onEnter = { y: 150 }
  const animate = { y: 0 }
  const onLeave = { y: 150 }

  const transitionSpringPhysics: Spring = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 5,
  }

  const form = useForm<z.infer<typeof formSchemaEditProfile>>({
    resolver: zodResolver(formSchemaEditProfile),
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

  const { setValue, getValues, reset, handleSubmit, control, formState, resetField } = form

  const onSubmit = async (value: z.infer<typeof formSchemaEditProfile>) => {
    try {
      setLoading(true)

      const dataSubmit = {
        ...value,
        avatar: value.avatar === null ? null : previewAvatar.includes("cloudinary") ? undefined : previewAvatar,
        banner: value.banner === null ? null : previewBanner.includes("cloudinary") ? undefined : previewBanner
      }

      const res = await axios.patch("/api/users", dataSubmit, {
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;

          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // const percentage = (loaded * 100) / total;
          // setProgress(+percentage.toFixed(2));
          setProgress(percentCompleted);
        }
      })
      const data = res.data

      toast({
        variant: "success",
        description: data.message,
      })

      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleFileChange = async (files: FileList, modal: string) => {
    const file = files && files[0];
    const imageDataUrl = await convertBase64(file);

    if (file.type === "image/gif") {
      modal === "avatar" && setPreviewAvatar(imageDataUrl as string)
      modal === "banner" && setPreviewBanner(imageDataUrl as string)
    } else {
      file ? onOpen(modal === "avatar" ? "avatarCrop" : "bannerCrop", { image: imageDataUrl as string }) : modal === "avatar" ? setPreviewAvatar("") : setPreviewBanner("")
    }
  }

  const handleResetEdit = () => {
    reset()

    user.avatar ? setPreviewAvatar(user.avatar) : setPreviewAvatar("")

    user.banner ? setPreviewBanner(user.banner) : setPreviewBanner("")
  }

  useEffect(() => {
    setPreviewAvatar(user.avatar || "")
    setPreviewBanner(user.banner || "")

    reset({
      avatar: undefined,
      banner: undefined,
      bannerColor: user.bannerColor,
      bio: user.bio || "",
      displayname: user.displayname || "",
      hexColor: user.hexColor,
      username: user.username
    })
  }, [user])

  return (
    <>
      <div className="relative mb-20 space-y-4">
        <p className="text-xl font-semibold tracking-wider">Profile</p>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-3 md:flex-row md:space-x-4 md:space-y-0">
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem className="flex-1 max-w-sm">
                      <div className="bg-[#F2F3F5] dark:bg-dark-tertiary max-w-sm rounded-md relative overflow-hidden flex-1">
                        {previewBanner ? (
                          <div className="absolute inset-0 w-full h-24">
                            <Image fill src={previewBanner} className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority alt="banner" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 w-full h-24" style={{ backgroundColor: getValues("bannerColor") }} />
                        )}
                        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                          <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"ghost"} className="absolute z-10 w-8 h-8 rounded-full right-2 top-2 focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/40" disabled={loading}>
                              <Edit size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="space-y-1" align="end">
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                              <FormLabel htmlFor="banner">
                                Change Banner
                              </FormLabel>
                              <Input
                                id="banner"
                                accept="image/jpeg, image/jpg, image/png, image/gif"
                                type="file"
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={(e) => {
                                  field.onChange(e.target.files ? e.target.files[0] : null)

                                  if (e.target.files) {
                                    setIsOpen(false)
                                    handleFileChange(e.target.files, "banner")
                                  }
                                }}
                                className="hidden"
                                ref={field.ref}
                                disabled={loading}
                              />
                            </DropdownMenuItem>
                            {user.banner && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setValue("banner", null, { shouldDirty: true })
                                  setPreviewBanner("")
                                }}
                                className="text-rose-500 focus:text-rose-500"
                                disabled={loading}
                              >
                                Remove Banner
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="z-10 px-5 pb-3 space-y-2 mt-14">
                          <UserAvatar
                            id={user.id}
                            initialName={user.displayname || user.username}
                            src={previewAvatar}
                            bgColor={getValues("hexColor")}
                            className="w-20 h-20 border-8 bg-[#F2F3F5] dark:bg-dark-tertiary border-[#F2F3F5] dark:border-dark-tertiary"
                            classNameFallback="text-lg md:text-2xl"
                          />
                          <div>
                            <p className="font-semibold tracking-wide md:text-lg">Your Avatar</p>
                            <p className="text-xs text-zinc-400">This will be displayed on your profile</p>
                          </div>
                        </div>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                {!user.banner && (
                  <div className="relative">
                    <div className="flex flex-col space-y-2">
                      <p className="text-xs font-extrabold uppercase dark:text-zinc-300">Banner Color</p>
                      <Popover>
                        <PopoverTrigger asChild disabled={loading}>
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
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar</p>
                <div className="flex items-start space-x-2">
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
                              if (e.target.files?.length) {
                                field.onChange(e.target.files ? e.target.files[0] : null)
                                handleFileChange(e.target.files, "avatar")
                              }
                            }}
                            className="hidden"
                            ref={field.ref}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {user.avatar && (
                    <Button
                      variant={"ghost"}
                      type="reset"
                      onClick={() => {
                        setValue("avatar", null, { shouldDirty: true })
                        setPreviewAvatar("")
                      }}
                      disabled={loading}
                    >
                      Remove Avatar
                    </Button>
                  )}
                </div>
              </div>
              {!user.avatar && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase dark:text-zinc-300">Avatar Color</p>
                  <div className="space-x-2">
                    <Popover>
                      <PopoverTrigger asChild disabled={loading}>
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
                  <FormInput title="displayname" field={field} autoComplete="off" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" disabled={loading} />
                )}
              />
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormInput title="username" field={field} autoComplete="off" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" disabled={loading} />
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
                        className="border-0 rounded-sm resize-none focus-visible-visible:ring-offset-0 bg-muted dark:bg-zinc-800 dark:text-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoComplete="off"
                        wrap="hard"
                        rows={5}
                        maxLength={150}
                        disabled={loading}
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
                      className="fixed bottom-5 max-w-sm md:max-w-2xl w-full p-1.5 pl-3 bg-zinc-50 dark:bg-dark-secondary rounded-md shadow-sm z-10 overflow-hidden"
                    >
                      <AnimateLayoutProvider>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs md:text-sm">Careful — you have unsaved changes!</p>
                            <div className="flex space-x-2">
                              <Button
                                type="reset"
                                variant={"ghost"}
                                onClick={handleResetEdit}
                                disabled={loading}
                              >
                                Reset
                              </Button>
                              <Button type="submit" variant={"ghost"} className="text-xs text-white bg-emerald-500 hover:bg-emerald-600 md:text-sm" disabled={loading}>
                                {loading ? <Loading className="mx-6" /> : "Save Changes"}
                              </Button>
                            </div>
                          </div>
                          {progress > 0 && (
                            <div className="py-0.5 pr-1.5">
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </AnimateLayoutProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <AvatarCropModal user={user} setValue={setValue} resetField={resetField} setPreview={setPreviewAvatar} />
      <BannerCropModal user={user} setValue={setValue} resetField={resetField} setPreview={setPreviewBanner} />
    </>
  )
}
export default ProfileSection