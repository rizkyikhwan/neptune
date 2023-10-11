"use client"

import FormLogin from "@/components/form-action/form-login"
import FormSignup from "@/components/form-action/form-signup"
import { Variant } from "@/lib/type"
import { AnimatePresence, Spring, motion } from "framer-motion"
import { useState } from "react"

const AuthPage = () => {
  const [variant, setVariant] = useState<Variant>("LOGIN")

  const onEnter = { opacity: 0, scale: 1.1 }
	const animate = { opacity: 1, scale: 1 }
	const onLeave = { opacity: 0, scale: 0.95 }

  const transitionSpringPhysics: Spring = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 5,
  }

  const onExitComplete = () => {
    window.scrollTo({ top: 0 })
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete} mode="wait">
      {variant === "LOGIN" && (
        <motion.div
          key="one"
          initial={onEnter}
          animate={animate}
          exit={onLeave}
          transition={transitionSpringPhysics}
          className="w-full sm:max-w-lg"
        >
          <FormLogin setVariant={setVariant} />
        </motion.div>
      )}
      {variant === "SIGNUP" && (
        <motion.div
          key="two"
          initial={onEnter}
          animate={animate}
          exit={onLeave}
          transition={transitionSpringPhysics}
          className="w-full sm:max-w-lg"
        >
          <FormSignup setVariant={setVariant} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default AuthPage
