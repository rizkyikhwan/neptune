import { useModal } from "@/app/hooks/useModalStore"
import FormInput from "@/components/form/form-input"
import Loading from "@/components/loading"
import AnimateLayoutProvider from "@/components/providers/animate-layout-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { AnimatePresence, Spring, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchemaCode = z.object({
  verification_code: z.string().min(8),
})

const formSchemaEmail = z.object({
  email: z.string().min(1, "Enter a email").email("This is not a valid email."),
})

const ChangeEmailModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { toast } = useToast()
  const router = useRouter()

  const { data: user } = data

  const [step, setStep] = useState(1)
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const onEnter = { x: -250, opacity: 0 }
	const animate = { x: 0, opacity: 1 }
	const onLeave = { x: 500, opacity: 0 }

  const transitionSpringPhysics: Spring = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 5,
  }

  const isModalOpen = isOpen && type === "changeEmail"
  
  const formCode = useForm({
    resolver: zodResolver(formSchemaCode),
    defaultValues: {
      verification_code: "",
    }
  })

  const formEmail = useForm({
    resolver: zodResolver(formSchemaEmail),
    defaultValues: {
      email: "",
    }
  })

  const handleClose = () => {
    formCode.reset()
    onClose()
  }

  const isLoadingCode = formCode.formState.isSubmitting
  const isLoadingEmail = formEmail.formState.isSubmitting

  const sendVerifyCode = async () => {
    try {
      setIsSending(true)

      await axios.post("/api/users/change-email/send-verify-code")

      setStep(2)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSending(false)
    }
  }

  const onSubmitCode = async (values: z.infer<typeof formSchemaCode>) => {
    try {
      await axios.get(`/api/users/change-email/verify-code/${values.verification_code.toLowerCase()}`)

      setStep(3)
    } catch (error: any) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error.response.data.message,
      })
    }
  }

  const onSubmitEmail = async (values: z.infer<typeof formSchemaEmail>) => {
    try {
      
      await axios.patch(`/api/users/change-email`, values)

      toast({
        variant: "success",
        title: "Email changed.",
        description: "Check your inbox for your newest email",
      })

      setIsSuccess(true)

      // router.refresh()
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
      <DialogContent 
        className="p-0 overflow-hidden dark:bg-dark-primary"
        onInteractOutside={e => {
          isSending && e.preventDefault()
        }}
      >
        <AnimateLayoutProvider>
          <AnimatePresence initial={false} mode="popLayout">
            {step === 1 && (
              <motion.div
                key={step}
                initial={onEnter}
                animate={animate}
                exit={onLeave}
                transition={transitionSpringPhysics}
                className="flex flex-col p-6 space-y-4"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold tracking-wide text-center">
                    Change Email
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    To complete email change you will be required to verify ownership of a new email address.
                  </DialogDescription>
                </DialogHeader>
                <Button
                  type="button"
                  variant={"primary"}
                  onClick={sendVerifyCode}
                  disabled={isSending}
                >
                  {isSending ? <Loading /> : "Send Verification Code"}
                </Button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key={step}
                initial={onEnter}
                animate={animate}
                exit={onLeave}
                transition={transitionSpringPhysics}
                className="flex flex-col space-y-4"
              >
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle className="text-2xl font-bold tracking-wide text-left">
                    Enter Verification Code
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    We sent a code to <b>{user?.email}</b>.<br /> Please enter received code to continue
                  </DialogDescription>
                </DialogHeader>
                <Form {...formCode}>
                  <form onSubmit={formCode.handleSubmit(onSubmitCode)} className="space-y-4">
                    <FormField
                      control={formCode.control}
                      name="verification_code"
                      render={({ field }) => (
                        <div className="px-6 space-y-2">
                          <FormInput className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" autoComplete="off" disabled={isSending} field={field} />
                          <div className="flex items-center space-x-1 text-xs">
                            <p className="text-zinc-300">Didn't receivce code?</p>
                            <button 
                              type="button" 
                              className="flex items-center text-sky-500 hover:underline underline-offset-2" 
                              onClick={sendVerifyCode} 
                              disabled={isSending}
                            >
                              <span>Click to resend</span>
                              {isSending && <Loader2 size={14} className="animate-spin" />}
                            </button>
                          </div>
                        </div>
                      )}
                    />
                    <DialogFooter className="flex-row justify-end p-4 mt-7 bg-zinc-50 dark:bg-dark-tertiary">
                      <Button
                        variant={"primary"}
                        disabled={isLoadingCode}
                      >
                        {isLoadingCode ? <Loading /> : "Next"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key={step}
                initial={onEnter}
                animate={animate}
                exit={onLeave}
                transition={transitionSpringPhysics}
                className="flex flex-col space-y-4"
              >
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle className="text-2xl font-bold tracking-wide text-left">
                    Enter New Email
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    Enter a  new email address below to start email change request. You will be receive verification email to confirm the new email before it will changed.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formEmail}>
                  <form onSubmit={formEmail.handleSubmit(onSubmitEmail)} className="space-y-4">
                    <FormField
                      control={formEmail.control}
                      name="email"
                      render={({ field }) => (
                        <div className="px-6 space-y-2">
                          <FormInput className="text-current bg-muted dark:bg-zinc-800 dark:text-zinc-300" autoComplete="off" disabled={isLoadingEmail || isSuccess} field={field} />
                          {isSuccess && <p className="text-xs text-emerald-500">Please verify your new email</p>}
                        </div>
                      )}
                    />
                    <DialogFooter className="flex-row justify-end p-4 mt-7 bg-zinc-50 dark:bg-dark-tertiary">
                      <Button
                        variant={"primary"}
                        disabled={isLoadingEmail || isSuccess}
                      >
                        {isLoadingEmail ? <Loading /> : isSuccess ? "Check your inbox email for verify email" : "Save"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimateLayoutProvider>
      </DialogContent>
    </Dialog>
  )
}
export default ChangeEmailModal