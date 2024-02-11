import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { convertBase64 } from "@/lib/utils"
import { useState } from "react"
import Image from "next/image"
import { Plus, Trash } from "lucide-react"
import FormInput from "../form/form-input"
import { Button } from "../ui/button"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/type"
import axios from "axios"
import { useRouter } from "next/navigation"
import Loading from "../loading"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required."
  }),
  imageUrl: typeof window === "undefined" ? z.undefined() : z.instanceof(File)
    .refine((file) => file.size <= 2000000, `Max image size is 2MB.`)
    .refine((file) => file.type !== "" ? ACCEPTED_IMAGE_TYPES.includes(file.type) : new File([], ""), "only .jpg, .jpeg, .png and .gif formats are supported.")
    .transform(file => convertBase64(file))
    .optional()
    .nullable(),
})

const CreateServerModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()
  const [imagePreview, setImagePreview] = useState("")

  const isModalOpen = isOpen && type === "createServer"

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: undefined
    }
  })

  const { setValue, getValues, reset, handleSubmit, control, formState, resetField } = form

  const isLoading = formState.isSubmitting

  const handleFileChange = async (files: FileList) => {
    const file = files && files[0];
    const imageDataUrl = await convertBase64(file);

    setImagePreview(imageDataUrl as string)
  }

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", value)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
    setImagePreview("")
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden dark:bg-dark-primary">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-2xl font-bold text-center">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can always chane it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 pb-4 space-y-3">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-center flex-1 mx-auto w-28">
                      {imagePreview ? (
                        <div className="relative flex items-center rounded-full w-28 h-28 group">
                          <Image src={imagePreview} fill className="object-cover rounded-full" alt="server-image" priority />
                          <div
                            className="absolute top-0 right-0 z-10 flex-col items-center justify-center p-1 overflow-hidden text-white rounded-full cursor-pointer bg-rose-500"
                            onClick={() => {
                              if (!isLoading) {
                                setImagePreview("")
                                resetField("imageUrl")
                              }
                            }}
                            tabIndex={-1}
                          >
                            <Trash size={16} />
                          </div>
                        </div>
                      ) : (
                        <FormLabel htmlFor="messageImage">
                          <div className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center rounded-full w-28 h-28 bg-zinc-300 dark:bg-zinc-500">
                              <Plus />
                            </div>
                          </div>
                        </FormLabel>
                      )}
                    </div>
                    <Input
                      id="messageImage"
                      accept="image/jpeg, image/jpg, image/png, image/gif"
                      type="file"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        field.onChange(e.target.files ? e.target.files[0] : null)

                        if (e.target.files) {
                          handleFileChange(e.target.files)
                        }
                      }}
                      className="hidden"
                      ref={field.ref}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-center">
                    <div className="w-3/4 space-y-2">
                      <FormInput required placeholder="Server Name" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" field={field} />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="px-6 py-4 bg-zinc-50 dark:bg-dark-tertiary disabled:opacity-75">
              <Button variant={"primary"} disabled={isLoading}>
                {isLoading ? <Loading /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default CreateServerModal