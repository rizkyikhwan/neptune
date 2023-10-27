"use client"

import { useEffect, useState } from "react"
import ResetPasswordModal from "@/components/modals/reset-password-modal"
import InfoAppModal from "@/components/modals/info-app-modal"
import RemoveFriendModal from "@/components/modals/remove-friend-modal"

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
      <InfoAppModal />
      <RemoveFriendModal />
    </>
  )
}
export default ModalProvider