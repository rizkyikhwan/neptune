"use client"

import FrozenRouter from "@/components/providers/frozen-router"
import { AnimatePresence, motion } from "framer-motion"
import { useSelectedLayoutSegment } from "next/navigation"
import { ElementRef, forwardRef } from "react"

const Child = forwardRef<ElementRef<typeof motion.div>, { children: React.ReactNode }>((props, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <FrozenRouter>{props.children}</FrozenRouter>
    </motion.div>
  )
})

Child.displayName = "Child"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Child key={segment}>{children}</Child>
    </AnimatePresence>
  )
}