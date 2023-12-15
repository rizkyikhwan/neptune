import Lottie from "lottie-react"
import WelcomeChatAnimation from "@/public/lottie/welcome-chat.json"

interface ChatWelcomeProps {
  name: string
}

const ChatWelcome = ({ name }: ChatWelcomeProps) => {
  return (
    <div className="px-4 mb-4 space-y-2">
      <Lottie animationData={WelcomeChatAnimation} loop className="w-32 md:w-44" />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        This is the start of your conversation with {name}
      </p>
    </div>
  )
}
export default ChatWelcome