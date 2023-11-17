import { useModal } from "@/app/hooks/useModalStore"
import { CustomWrapper } from "@/components/image-crop-components/CustomWrapper"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { formSchemaEditProfile } from "@/lib/type"
import { User } from "@prisma/client"
import { Dispatch, SetStateAction, useRef } from "react"
import { FixedCropper, FixedCropperRef, ImageRestriction, RectangleStencil } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import { UseFormResetField, UseFormSetValue } from "react-hook-form"
import { z } from "zod"

interface BannerCropModalProps {
  user: User,
  setValue: UseFormSetValue<z.infer<typeof formSchemaEditProfile>>
  resetField: UseFormResetField<z.infer<typeof formSchemaEditProfile>>
  setPreview: Dispatch<SetStateAction<string>>
}

const BannerCropModal = ({ user, resetField, setPreview }: BannerCropModalProps) => {
  const { isOpen, onClose, type, data } = useModal()

  const { image } = data

  const fixedCropperRef = useRef<FixedCropperRef>(null);

  const isModalOpen = isOpen && type === "bannerCrop"

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
        !user.banner && setPreview("")
        resetField("banner")
      }}>
      <DialogContent 
        onInteractOutside={() => {
          onClose()
          !user.banner && setPreview("")
          resetField("banner")
        }}
      >
        <DialogHeader>
          Change Banner
        </DialogHeader>
        <FixedCropper
          src={image}
          ref={fixedCropperRef}
          className={"rounded-md h-96 border border-spacing-2"}
          stencilComponent={RectangleStencil}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
            grid: true
          }}
          imageRestriction={ImageRestriction.stencil}
          stencilSize={{
            height: 160,
            width: 576
          }}
          wrapperComponent={CustomWrapper}
        />
        <DialogFooter className="space-y-2 space-y-reverse sm:space-y-0">
          <Button 
            variant={"outline"} 
            type="reset" 
            onClick={() => {
              onClose()
              !user.banner && setPreview("")
              resetField("banner")
            }}>
              Cancel
            </Button>
          <Button type="button" variant={"primary"} onClick={() => handleSetImage()} className="px-6">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default BannerCropModal