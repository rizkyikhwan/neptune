"use client"

import InfoAppModal from "@/components/modals/info-app-modal"
import ProfileModalUser from "@/components/modals/profile-user-modal"
import RemoveFriendModal from "@/components/modals/remove-friend-modal"
import ResetPasswordModal from "@/components/modals/reset-password-modal"
import UpdatePasswordModal from "@/components/modals/update-password-modal"
import { useEffect, useState } from "react"
import ChangeEmailModal from "@/components/modals/change-email-modal"
import DeleteMessageModal from "@/components/modals/delete-message-modal"
import MessageFileModal from "@/components/modals/message-file-modal"
import ImageViewModal from "@/components/modals/image-view-modal"

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
      <DeleteMessageModal />
      <MessageFileModal />
      <ImageViewModal />
    </>
  )
}
export default ModalProvider