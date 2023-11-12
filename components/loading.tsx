import { cn } from "@/lib/utils"

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center space-x-1.5", className)}>
      <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
      <div className="w-2 h-2 delay-200 rounded-full bg-zinc-300 animate-pulse" />
      <div className="w-2 h-2 delay-500 rounded-full bg-zinc-300 animate-pulse" />
    </div>
  )
}
export default Loading