import { useEffect, useState } from "react"

export default function useMobileView() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const windowWidth = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    windowWidth()

    window.addEventListener("resize", windowWidth)

    return() => window.removeEventListener("resize", windowWidth)
  }, [isMobile])

  return { isMobile }
}