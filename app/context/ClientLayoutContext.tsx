"use client"

import { User } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import React, { createContext, useContext, useEffect, useState } from "react"

const SplashScreen = dynamic(() => import('@/components/splash-screen'), {
  ssr: false,
})

interface ClientLayoutProps {
  children: React.ReactNode
  className?: string
  user?: User
}

interface ClientContextType {
  user: any
}

const ClientContext = createContext<ClientContextType>({
  user: {}
})

export const useClientLayout = () => {
  return useContext(ClientContext)
}

export default function ClientLayoutContext({ children, className, user }: ClientLayoutProps) {
  const { status } = useSession()
  const [isShown, setIsShown] = useState(true)

  useEffect(() => {
    if (status === "loading" || status === "authenticated") {
      const timer = setTimeout(() => {
        setIsShown(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <ClientContext.Provider value={{ user }}>
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
    </ClientContext.Provider>
  )
}