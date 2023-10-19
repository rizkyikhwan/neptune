"use client"

import useCountdown from "@/app/hooks/useCountdown"
import CardForm from "@/components/card/card-form"
import FormInput from "@/components/form/form-input"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  password: z.string().min(5, "Enter at least 5 characters."),
  confirmPassword: z.string().min(1, "Must confirm your new password."),
}).refine(({ confirmPassword, password }) => confirmPassword === password, {
  path: ["confirmPassword"],
  message: "Password doesn't match."
})

interface FormResetPasswordProps {
  token: string
  userId: string
}

const FormResetPassword = ({ token, userId }: FormResetPasswordProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const { secondsLeft, start } = useCountdown()

  const [isDisabled, setIsDisabled] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/auth/reset-password/${token}`, { ...values, userId })

      toast({
        variant: "success",
        title: "Success update password",
        description: "Your password has been successfully update."
      })

      start(3)

      setIsDisabled(true)

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 3000)
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
    <CardForm title="Reset Password" description="Your password must be different from your previous one.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput title="new password" type="password" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput title="confirm new Password" type="password" field={field} />
              )}
            />
            <div className="space-y-2">
              <Button variant="primary" className="w-full font-medium" disabled={isLoading || isDisabled}>
                {secondsLeft > 0 ? `Go to login page in ${secondsLeft}` : isLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </CardForm>
  )
}
export default FormResetPassword