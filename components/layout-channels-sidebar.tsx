import { ScrollArea } from "@/components/ui/scroll-area"

interface LayoutChannelsSidebarProps {
  children: React.ReactNode
  channelHeader: React.ReactNode
}

const LayoutChannelsSidebar = ({ children, channelHeader }: LayoutChannelsSidebarProps) => {
  return (
    <nav className="flex flex-col h-full text-primary w-full dark:bg-dark-tertiary bg-[#F2F3F5]">
      <div className="min-h-[48px] shadow p-2 border-b">
        {channelHeader}
      </div>
      <ScrollArea className="flex-1 px-2">
        {children}
      </ScrollArea>
    </nav>
  )
}
export default LayoutChannelsSidebar