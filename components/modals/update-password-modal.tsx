import { useModal } from "@/app/hooks/useModalStore"
import FormInput from "@/components/form/form-input"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  current_password: z.string().min(5, "Enter at least 5 characters."),
  new_password: z.string().min(5, "Enter at least 5 characters."),
  confirm_password: z.string().min(1, "Must confirm your new password."),
}).refine(({ confirm_password, new_password }) => confirm_password === new_password, {
  path: ["confirm_password"],
  message: "Password doesn't match."
})

const UpdatePasswordModal = () => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === "updatePassword"

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.patch("/api/users/update-password", values)
      const data = res.data
      
      toast.success(data.message)

      onClose()
    } catch (error: any) {
      console.log(error)

      if (error.response.status !== 401) {
        toast.error("Something went wrong", {
          description: error.response.data.message
        })
      } else {
        form.setError("current_password", { message: error.response.data.message })
      }
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden dark:bg-dark-primary">
        <DialogHeader className="p-4">
          <DialogTitle className="text-2xl font-bold">
            Update Password
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Enter your current password and a new password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-4 space-y-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormInput title="current password" type="password" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" field={field} />
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormInput title="new password" type="password" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" field={field} />
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormInput title="confirm new Password" type="password" className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" field={field} />
                )}
              />
            </div>
            <DialogFooter className="flex-row justify-end p-4 mt-7 bg-zinc-50 dark:bg-dark-tertiary">
              <Button variant={"ghost"} type="reset" onClick={handleClose} disabled={isLoading}>Cancel</Button>
              <Button variant={"primary"} disabled={isLoading} className="px-5">
                {isLoading ? (
                  <Loading />
                ) : (
                  "Done"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default UpdatePasswordModal