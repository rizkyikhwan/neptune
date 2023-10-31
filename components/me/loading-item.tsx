import { Skeleton } from "@/components/ui/skeleton"

const LoadingItem = () => {
  return (
    <div className="flex items-center justify-between px-2 py-2 mb-1 rounded-md cursor-pointer select-none border-zinc-200 dark:border-zinc-700 hover:bg-zinc-300/20 hover:dark:bg-zinc-400/10">
      <div className="flex items-start flex-grow space-x-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex flex-col py-1 space-y-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-32 h-3" />
        </div>
      </div>
    </div>
  )
}
export default LoadingItem