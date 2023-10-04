"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { Variant } from "@/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import FormInput from "./form/form-input"

const formSchema = z.object({
  email: z.string().min(1, "This field has to be filled.").email("This is not a valid email."),
  password: z.string().min(1, "This field has to be filled.")
})

const FormLogin = ({ setVariant }: { setVariant: React.Dispatch<React.SetStateAction<Variant>> }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    console.log(value)
  }

  return (
    <Card className="w-full border-0 rounded-none sm:rounded-md sm:max-w-lg bg-[#313338] text-secondary z-10 min-h-screen sm:min-h-min shadow-none sm:shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-medium tracking-wide">Hi mate!</CardTitle>
        <CardDescription className="text-zinc-400">Let's meet new people and join the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormInput required title="email" type="email" field={field} />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormInput required title="password" type="password" field={field} />
                      <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2">Forgot your password?</button>
                    </div>
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Button variant="primary" className="w-full font-medium">Log In</Button>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-zinc-400">Didn't have an account?</p>
                  <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2" onClick={() => setVariant("SIGNUP")}>Sign Up</button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
export default FormLogin
