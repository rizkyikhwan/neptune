"use client"

import { useEffect, useState } from "react"
import ResetPasswordModal from "@/components/modals/reset-password-modal"
import InfoAppModal from "@/components/modals/info-app-modal"
import RemoveFriendModal from "@/components/modals/remove-friend-modal"
import ProfileModalUser from "@/components/modals/profile-user-modal"

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