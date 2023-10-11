"use client"

import useCountdown from "@/app/hooks/useCountdown"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import emailNotif from "@/public/lottie/notifEmail.json"
import axios from "axios"
import Lottie from "lottie-react"
import { Loader2, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import ActionTooltip from "../action-tooltip"

interface CardVerificationProps {
  email: string
}

const CardVerification = ({ email }: CardVerificationProps) => {
  const { secondsLeft, start } = useCountdown()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      await axios.patch("/api/auth/verifyemail/resend")
    } catch (error) {
      console.log(error)
    } finally {
      start(60)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full flex items-center flex-col md:flex-row border-0 rounded-md max-w-xl bg-[#313338] text-secondary z-10 shadow-none sm:shadow-md relative">
      <CardHeader>
        <Lottie animationData={emailNotif} loop className="w-40" />
      </CardHeader>
      <CardContent className="break-words overflow-hidden p-3">
        <div className="space-y-2.5">
          <h6 className="font-medium text-zinc-200 text-lg tracking-wide">Verification email sent!</h6>
          <p className="text-sm text-zinc-300 ">
            We have sent a confirmation link to <b>{email}</b> Check your email for a link to sign in. 
            Please confirm your email before 30 minutes or resend email verification.
          </p>
          <div>
            <p className="text-xs text-zinc-400">Didn't get a confirmation mail?</p>
            <p className="text-xs text-zinc-400">
              <span>
                Check your spam folder or
              </span> 
              <button 
                type="button" 
                className="text-xs text-sky-500 hover:underline underline-offset-2 disabled:opacity-75 disabled:hover:no-underline ml-1" 
                disabled={isLoading || secondsLeft > 0} 
                onClick={() => handleResendEmail()}
              >
                <p className="flex items-center">
                  <span>resend email</span> {isLoading && <Loader2 className="animate-spin w-3 h-3 ml-0.5" />} {secondsLeft > 0  && <span className="ml-0.5">{secondsLeft}s</span>}
                </p>
              </button>
            </p>
          </div>
        </div>
        <ActionTooltip side="right" label="Logout">
          <button className="absolute top-1 right-1 p-1.5 hover:bg-black rounded-md transition" type="button" onClick={() => signOut()}>
            <LogOut className="text-zinc-300  w-5 h-5 md:w-4 md:h-4" />
          </button>
        </ActionTooltip>
      </CardContent>
    </Card>
  )
}
export default CardVerification