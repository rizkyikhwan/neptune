import React, { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimateLayoutProviderProps {
  children: React.ReactNode
  className?: string
}

const AnimateLayoutProvider = React.forwardRef<HTMLDivElement, AnimateLayoutProviderProps>(({ children, className }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')
  const [width, setWidth] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0].contentRect.height
        const observedWidth = entries[0].contentRect.width
        setHeight(observedHeight)
        setWidth(observedWidth)
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div 
        className={cn("overflow-hidden", className)} 
        style={{ height }} 
        animate={{ height }} 
        transition={{ duration: 0.15 }} 
        ref={ref}
      >
        <div ref={containerRef}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

export default AnimateLayoutProvider