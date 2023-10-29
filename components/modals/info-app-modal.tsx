import { useModal } from "@/app/hooks/useModalStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageInfoApp from "@/public/image/image-info.png"
import LogoLottieAnimation from "@/public/lottie/logo-lottie-animation.json"
import Lottie from "lottie-react"
import Image from "next/image"

const InfoAppModal = () => {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === "infoApp"

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[600px] h-full p-0 flex flex-col">
        <DialogHeader className="p-4 pb-0 space-y-1">
          <DialogTitle className="text-2xl font-bold">
            What's is this
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 pb-4 text-zinc-700 dark:text-zinc-300">
          <div className="relative my-3 pointer-events-none">
            <Lottie animationData={LogoLottieAnimation} loop className="absolute right-0 w-40 transform -translate-x-1/2 -translate-y-1/2 md:w-52 top-1/2 left-1/2" />
            <Image
              src={ImageInfoApp.src}
              width={ImageInfoApp.width}
              height={ImageInfoApp.height}
              blurDataURL={ImageInfoApp.blurDataURL}
              alt="Image Info App"
              className="rounded-md"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <p className="font-semibold tracking-wider uppercase text-emerald-500">Neptune</p>
              <div className="w-full h-px bg-emerald-500" />
            </div>
            <p>Neptune is a cutting-edge web chat application designed to facilitate the creation of vibrant communities, new friendships, and enable users to meet new people. It is a user-friendly and engaging platform that combines a range of features to create a welcoming and dynamic online environment.</p>
            <div className="flex items-center space-x-2">
              <p className="font-semibold tracking-wider uppercase text-sky-500">Featured</p>
              <div className="w-full h-px bg-sky-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 dark:bg-white bg-zinc-700 rounded-full flex-none" />
                <p className="-mt-2">Neptune allows users to create detailed profiles with photos, and bios.</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 dark:bg-white bg-zinc-700 rounded-full flex-none" />
                <p className="-mt-2">Neptune puts a strong emphasis on community building. Users can join or create various interest-based communities, such as hobby groups, book clubs, sports enthusiasts, and more. These communities serve as virtual gathering spaces for like-minded individuals.</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 dark:bg-white bg-zinc-700 rounded-full flex-none" />
                <p className="-mt-2">Users can send friend requests, follow others, and engage in private chats with people they meet in the communities.</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 dark:bg-white bg-zinc-700 rounded-full flex-none" />
                <p className="-mt-2">Neptune prioritizes user safety and enforces strict moderation policies to ensure a friendly and respectful atmosphere. Users can report any inappropriate behavior or content to the app's support team.</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 dark:bg-white bg-zinc-700 rounded-full flex-none" />
                <p className="-mt-2">Neptune's user interface is intuitive and visually appealing, ensuring that users of all backgrounds can navigate the app effortlessly.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
export default InfoAppModal