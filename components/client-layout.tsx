"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import { useSocket } from "./providers/socket-provider"
import ToastNotifocation from "./toast-notification"
import { variants } from "@/lib/variantMotions"

const SplashScreen = dynamic(() => import('@/components/splash-screen'), {
  ssr: false,
})

interface ClientLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ClientLayoutContext({ children, className }: ClientLayoutProps) {
  const { status } = useSession()
  const { socket } = useSocket()
  const [isShown, setIsShown] = useState(true)

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on("get-notification", (data: any) => {
      ToastNotifocation({ user: data.sender, message: data.message })
    })
  }, [socket])

  useEffect(() => {
    if (status === "loading" || status === "authenticated") {
      const timer = setTimeout(() => {
        setIsShown(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence initial={false} mode="wait">
      {isShown ? (
        <SplashScreen />
      ) : (
        <motion.main
          variants={variants}
          initial="onFadeEnter"
          animate="fadeAnimate"
          exit="onFadeExit"
          className={className}
        >
          {children}
        </motion.main>
      )}
    </AnimatePresence>
  )
}