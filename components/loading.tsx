import { cn } from "@/lib/utils"

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center space-x-1.5", className)}>
      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse" />
      <div className="w-2 h-2 delay-200 bg-indigo-300 rounded-full animate-pulse" />
      <div className="w-2 h-2 delay-500 bg-indigo-300 rounded-full animate-pulse" />
    </div>
  )
}
export default Loading