"use client"

import InfoAppModal from "@/components/modals/info-app-modal"
import ProfileModalUser from "@/components/modals/profile-user-modal"
import RemoveFriendModal from "@/components/modals/remove-friend-modal"
import ResetPasswordModal from "@/components/modals/reset-password-modal"
import UpdatePasswordModal from "@/components/modals/update-password-modal"
import { useEffect, useState } from "react"
import ChangeEmailModal from "../modals/change-email-modal"

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
      <UpdatePasswordModal />
      <ChangeEmailModal />
    </>
  )
}
export default ModalProvider