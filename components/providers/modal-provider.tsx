"use client"

import InfoAppModal from "@/components/modals/info-app-modal"
import ProfileModalUser from "@/components/modals/profile-user-modal"
import RemoveFriendModal from "@/components/modals/remove-friend-modal"
import ResetPasswordModal from "@/components/modals/reset-password-modal"
import { useEffect, useState } from "react"

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
      <ProfileModalUser />
    </>
  )
}
export default ModalProvider