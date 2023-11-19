import { cn } from "@/lib/utils"

interface HeaderLayoutProps {
  children: React.ReactNode
  className?: string
}

const HeaderLayout = ({ children, className }: HeaderLayoutProps) => {
  return (
    <main className={cn("flex flex-col fixed inset-y-0 h-full w-full md:w-[calc(100%-313px)]", className)}>
      {children}
    </main>
  )
}
export default HeaderLayout