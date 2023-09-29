"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import InputForm from "./input-form"

const formSchema = z.object({
  email: z.string().min(1, "This field has to be filled.").email("This is not a valid email."),
  password: z.string().min(1, "This field has to be filled.")
})

const FormLogin = () => {
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
    <Card className="w-full border-0 rounded-none md:rounded-md md:max-w-lg bg-[#313338] text-secondary z-10 min-h-screen md:min-h-min">
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
                    <FormControl>
                      <InputForm required title="email" type="email" className="border-0 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-800 text-zinc-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputForm required title="password" type="password" className="border-0 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-800 text-zinc-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="primary" className="w-full font-medium">Log In</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
export default FormLogin
