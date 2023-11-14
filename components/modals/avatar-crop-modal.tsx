import { useClientLayout } from "@/app/context/ClientLayoutContext"
import { useModal } from "@/app/hooks/useModalStore"
import { CustomWrapper } from "@/components/image-crop-components/CustomWrapper"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { formSchemaEditProfile } from "@/lib/type"
import { User } from "@prisma/client"
import { Dispatch, SetStateAction, useRef } from "react"
import { CircleStencil, FixedCropper, FixedCropperRef, ImageRestriction } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import { UseFormResetField, UseFormSetValue } from "react-hook-form"
import { z } from "zod"

interface AvatarCropModalProps {
  user: User,
  setValue: UseFormSetValue<z.infer<typeof formSchemaEditProfile>>
  resetField: UseFormResetField<z.infer<typeof formSchemaEditProfile>>
  setPreview: Dispatch<SetStateAction<string>>
}

const AvatarCropModal = ({ user, resetField, setPreview }: AvatarCropModalProps) => {
  const { isOpen, onClose, type, data } = useModal()

  const { image } = data

  const fixedCropperRef = useRef<FixedCropperRef>(null);

  const isModalOpen = isOpen && type === "avatarCrop"

  const handleSetImage = () => {
    if (fixedCropperRef.current) {
      setPreview(fixedCropperRef.current.getCanvas()?.toDataURL() || "")
    }

    onClose()
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        onClose()
        !user.avatar && setPreview("")
        resetField("avatar")
      }}>
      <DialogContent 
        onInteractOutside={() => {
          onClose()
          !user.avatar && setPreview("")
          resetField("avatar")
        }}
      >
        <DialogHeader>
          Change Avatar
        </DialogHeader>
        <FixedCropper
          src={image}
          ref={fixedCropperRef}
          className={"rounded-md h-96 border border-spacing-2"}
          stencilComponent={CircleStencil}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
            grid: true
          }}
          imageRestriction={ImageRestriction.stencil}
          stencilSize={{
            height: 300,
            width: 300
          }}
          wrapperComponent={CustomWrapper}
        />
        <DialogFooter>
          <Button 
            variant={"outline"} 
            type="reset" 
            onClick={() => {
              onClose()
              !user.avatar && setPreview("")
              resetField("avatar")
            }}>
              Cancel
            </Button>
          <Button type="button" variant={"primary"} onClick={() => handleSetImage()} className="px-6">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AvatarCropModal