"use client"

import { useModal } from "@/app/hooks/useModalStore"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { Variant } from "@/lib/type"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import CardForm from "@/components/card/card-form"
import FormInput from "@/components/form/form-input"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

const formSchema = z.object({
  email: z.string().min(1, "This field has to be filled.").email("This is not a valid email."),
  password: z.string().min(1, "This field has to be filled.")
})

const FormLogin = ({ setVariant }: { setVariant: React.Dispatch<React.SetStateAction<Variant>> }) => {
  const router = useRouter()
  const { toast } = useToast()
  const { onOpen } = useModal()

  const [isDisabled, setIsDisabled] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    const { email, password } = value

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: `${window.location.origin}/explore`
      })
      
      if (res?.error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: res.error,
        })
      }
      
      if (res?.url) {
        setIsDisabled(true)
        router.push(res.url)
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CardForm title="Hi mate!" description="Let's meet new people and join the community.">
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
                    <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2" onClick={() => onOpen("resetPassowrd")}>Forgot your password?</button>
                  </div>
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button variant="primary" className="w-full font-medium" disabled={isLoading || isDisabled}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
              <div className="flex items-center space-x-1">
                <p className="text-xs text-zinc-400">Didn't have an account?</p>
                <button type="button" className="text-xs text-sky-500 hover:underline underline-offset-2" disabled={isLoading || isDisabled} onClick={() => setVariant("SIGNUP")}>Sign Up</button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </CardForm>
  )
}
export default FormLogin
