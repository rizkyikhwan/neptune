"use client"

import useCountdown from "@/app/hooks/useCountdown"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import emailNotif from "@/public/lottie/notifEmail.json"
import axios from "axios"
import Lottie from "lottie-react"
import { Loader2, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import ActionTooltip from "../action-tooltip"
import { toast } from "sonner"

interface CardVerificationProps {
  email: string
}

const CardVerification = ({ email }: CardVerificationProps) => {
  const { secondsLeft, start } = useCountdown()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    start(60)
  }, [])

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      await axios.patch("/api/auth/verifyemail/resend")
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      start(60)
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative z-10 flex flex-col items-center w-full max-w-xl border-0 rounded-md shadow-none md:flex-row bg-dark-primary text-secondary sm:shadow-md">
      <CardHeader>
        <Lottie animationData={emailNotif} loop className="w-40" />
      </CardHeader>
      <CardContent className="p-3 overflow-hidden break-words">
        <div className="space-y-2.5">
          <h6 className="text-lg font-medium tracking-wide text-zinc-200">Verification email sent!</h6>
          <p className="text-sm text-zinc-300 ">
            We have sent a confirmation link to <b>{email}</b> Check your email for a link to sign in. This token is extremely sensitive, treat it like a password and do not share it with anyone.
          </p>
          <div>
            <p className="text-xs text-zinc-400">Didn't get a confirmation mail?</p>
            <p className="text-xs text-zinc-400">
              <span>
                Check your spam folder or
              </span>
              <button
                type="button"
                className="ml-1 text-xs text-sky-500 hover:underline underline-offset-2 disabled:opacity-75 disabled:hover:no-underline"
                disabled={isLoading || secondsLeft > 0}
                onClick={() => handleResendEmail()}
              >
                <p className="flex items-center">
                  <span>resend email</span> {isLoading && <Loader2 className="animate-spin w-3 h-3 ml-0.5" />} {secondsLeft > 0 && <span className="ml-0.5">{secondsLeft}s</span>}
                </p>
              </button>
            </p>
          </div>
        </div>
        <ActionTooltip side="right" label="Logout">
          <button className="absolute top-1 right-1 p-1.5 hover:bg-black rounded-md transition" type="button" onClick={() => signOut()}>
            <LogOut className="w-5 h-5 text-zinc-300 md:w-4 md:h-4" />
          </button>
        </ActionTooltip>
      </CardContent>
    </Card>
  )
}
export default CardVerification