"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField } from "@/components/ui/form"
import { Variant } from "@/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import FormInput from "./form/form-input"

const formSchema = z.object({
  email: z.string().min(1, "Enter a email.").email("This is not a valid email."),
  displayname: z.string(),
  username: z.string().min(3, "Enter at least 3 characters."),
  password: z.string().min(5, "Enter at least 5 characters."),
  confirmPassword: z.string().min(1, "Must confirm your password."),
}).refine(({ confirmPassword, password }) => confirmPassword === password, {
  path: ["confirmPassword"],
  message: "Password doesn't match."
})

const FormSignup = ({ setVariant }: { setVariant: React.Dispatch<React.SetStateAction<Variant>> }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const { email, displayname, username, password } = value

    try {
      setIsLoading(true)
      await axios.post("/api/auth/signup", value)

      await signIn("credentials", {
        redirect: false,
        email,
        displayname,
        username,
        password
      })

      router.push("/home")
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 rounded-none sm:rounded-md sm:max-w-lg bg-[#313338] text-secondary z-10 min-h-screen sm:min-h-min shadow-none sm:shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-medium tracking-wide">Dischat</CardTitle>
        <CardDescription className="text-zinc-400">Created an account.</CardDescription>
      </CardHeader>
      <CardContent>
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
                  <FormInput required title="Confirm Password" type="password" field={field} />
                )}
              />
              <div className="space-y-2">
                <Button variant="primary" className="w-full font-medium" disabled={isLoading}>
                  {isLoading ? "Loading" : "Sign Up"}
                </Button>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-zinc-400">Already have an account?</p>
                  <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2" onClick={() => setVariant("LOGIN")} disabled={isLoading}>Login</button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
export default FormSignup
