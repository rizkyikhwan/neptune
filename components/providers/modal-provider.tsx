"use client"

import { useEffect, useState } from "react"
import ResetPasswordModal from "@/components/modals/reset-password-modal"

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <ResetPasswordModal />
    </>
  )
}
export default ModalProvider