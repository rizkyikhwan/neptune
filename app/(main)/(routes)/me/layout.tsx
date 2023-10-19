import MeSidebar from "@/components/me/me-sidebar"

const LayoutMe = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 flex-col hidden h-full md:flex w-60">
        <MeSidebar />
      </div>
      <div className="h-full md:pl-60">
        {children}
      </div>
    </div>
  )
}
export default LayoutMe