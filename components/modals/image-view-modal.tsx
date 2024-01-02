import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

const ImageViewModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === "messageImageView"
  const { image } = data

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="p-0 border-0">
        {image ? (
          <Image
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto rounded-md"
            src={image}
            blurDataURL={image}
            alt="image"
            priority
          />
        ) : (
          <div className="w-full rounded-md h-[520px] bg-muted animate-pulse" />
        )}
      </DialogContent>
    </Dialog>
  )
}
export default ImageViewModal