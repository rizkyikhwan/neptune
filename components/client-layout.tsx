"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import React from "react"
import SplashScreen from "./splash-screen"

interface ClientLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const { status } = useSession()

  return (
    <AnimatePresence mode="wait">
      {status === "loading" ? (
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