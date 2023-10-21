"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"

interface ClientLayoutProps {
  children: React.ReactNode
  className?: string
}

const SplashScreen = dynamic(() => import('./splash-screen'), {
  ssr: false,
})

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const { status } = useSession()
  const [isShown, setIsShown] = useState(true)


  useEffect(() => {
    if (status === "loading") {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {children}
        </motion.main>
      )}
    </AnimatePresence>
  )
}