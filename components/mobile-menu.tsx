import { Menu } from "lucide-react"
import MeSidebar from "./me/me-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import NavigationSidebar from "@/components/navigation/navigation-sidebar"
import { useClientContext } from "@/app/context/ClientContext"

const MobileMenu = () => {
  const { user, servers } = useClientContext()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-20">
          <NavigationSidebar user={user} servers={servers} />
        </div>
        <MeSidebar user={user} />
      </SheetContent>
    </Sheet>
  )
}
export default MobileMenu