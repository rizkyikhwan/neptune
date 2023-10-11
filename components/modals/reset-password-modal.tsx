import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem } from "../ui/form"
import FormInput from "../form/form-input"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import axios from "axios"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().min(1, "This field has to be filled.").email("This is not a valid email.")
})

const ResetPasswordModal = () => {
  const { isOpen, onClose, type } = useModal()
  const { toast } = useToast()

  const isModalOpen = isOpen && type === "resetPassowrd"

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch("/api/auth/reset-password/verify", values)
      toast({
        variant: "success",
        title: "Check your email",
        description: "We sent you instructions to reset your password."
      })
    } catch (error: any) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error.response.data.message,
      })
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle className="text-2xl font-bold">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Include the email address associated with your account and we’ll send you an email with instructions to reset your password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 space-y-4">
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormInput title="email" type="email" field={field} />
                </FormItem>
              )}
            />
            <Button variant={"outline"} disabled={isLoading}>Send reset instructions {isLoading && <Loader2 className="w-3 h-3 ml-1.5 animate-spin" />}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default ResetPasswordModal