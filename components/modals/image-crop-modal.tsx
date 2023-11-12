import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { formSchemaEditProfile } from "@/lib/type"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { UseFormResetField, UseFormSetValue } from "react-hook-form"
import { z } from "zod"
import { CropperRef, Cropper, CircleStencil, ImageRestriction, FixedCropper, FixedCropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

interface ImageCropModalProps {
  setValue: UseFormSetValue<z.infer<typeof formSchemaEditProfile>>
  resetField: UseFormResetField<z.infer<typeof formSchemaEditProfile>>
  setPreview: Dispatch<SetStateAction<string>>
}

const ImageCropModal = ({ setValue, resetField, setPreview }: ImageCropModalProps) => {
  const { isOpen, onClose, type, data } = useModal()

  const { image } = data
  // console.log(image)

  // const { image } = useImageCropContext()
  // console.log(image)

  const fixedCropperRef = useRef<FixedCropperRef>(null);

  const isModalOpen = isOpen && type === "imageCrop"

  const handleSetAvatar = () => {
    if (fixedCropperRef.current) {
      setPreview(fixedCropperRef.current.getCanvas()?.toDataURL() || "")
      // console.log(cropperRef.current.getImage())
      // setValue("avatar", cropperRef.current.getCanvas()?.toDataURL())
      // console.log(cropperRef.current.getCanvas()?.toDataURL())
    }

    onClose()
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        onClose()
        setPreview("")
        resetField("avatar")
      }}>
      <DialogContent className="pt-10">
        <FixedCropper
          src={image}
          ref={fixedCropperRef}
          // ref={cropperRef}
          // onChange={onChange}
          className={"cropper rounded-md h-96"}
          stencilComponent={CircleStencil}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false
          }}
          imageRestriction={ImageRestriction.stencil}
          stencilSize={{
            height: 300,
            width: 300
          }}
        />
        <button type="button" onClick={() => handleSetAvatar()}>gass</button>
      </DialogContent>
    </Dialog>
  )
}
export default ImageCropModal