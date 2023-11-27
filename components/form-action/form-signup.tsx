"use client"

import CardForm from "@/components/card/card-form"
import FormInput from "@/components/form/form-input"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { VariantAuth } from "@/lib/type"
import NeptuneLogoDark from "@/public/logo/logo-dark.svg"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().min(1, "Enter a email").email("This is not a valid email."),
  displayname: z.string(),
  username: z.string()
    .min(3, "This must be 3-15")
    .max(15, "This must be 3-15")
    .refine(value => /^(?=.*[a-zA-Z])(?!.*[^a-zA-Z_]).*[a-zA-Z_]+(?:[a-zA-Z_]*[ ]*)*[a-zA-Z_]*$/.test(value), "Please only use numbers, letters, undersocres, and must have a text"),
  password: z.string().min(5, "Enter at least 5 characters"),
  confirmPassword: z.string().min(1, "Must confirm your password"),
}).refine(({ confirmPassword, password }) => confirmPassword === password, {
  path: ["confirmPassword"],
  message: "Password doesn't match."
})

const FormSignup = ({ setVariant }: { setVariant: React.Dispatch<React.SetStateAction<VariantAuth>> }) => {
  const router = useRouter()

  const [isDisabled, setIsDisabled] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      displayname: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const { email, displayname, username, password } = value

    try {
      await axios.post("/api/auth/signup", value)

      await signIn("credentials", {
        redirect: false,
        email,
        displayname,
        username,
        password,
      })

      setIsDisabled(true)

      router.push("/verification")
      router.refresh()
    } catch (error: any) {
      console.log(error)
      toast.error("Something went error.", {
        description: error.response.data.message
      })
    }
  }

  return (
    <CardForm
      title={<NeptuneLogoDark width={40} height={40} />}
      description="Created an account."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput required title="email" type="email" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="displayname"
              render={({ field }) => (
                <FormInput title="display name" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormInput required title="username" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput required title="password" type="password" field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput required title="confirm password" type="password" field={field} />
              )}
            />
            <div className="space-y-2">
              <Button variant="primary" className="w-full font-medium" disabled={isLoading || isDisabled}>
                {isLoading || isDisabled ? <Loading /> : "Sign Up"}
              </Button>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-zinc-400">Already have an account?</p>
                <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2" onClick={() => setVariant("LOGIN")} disabled={isLoading || isDisabled}>Login</button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </CardForm>
  )
}
export default FormSignup
