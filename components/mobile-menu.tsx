import { Menu } from "lucide-react"
import MeSidebar from "./me/me-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useClientLayout } from "@/app/context/ClientLayoutContext"
import NavigationSidebar from "@/components/navigation/navigation-sidebar"

const MobileMenu = () => {
  const { user } = useClientLayout()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-20">
          <NavigationSidebar user={user} />
        </div>
        <MeSidebar />
      </SheetContent>
    </Sheet>
  )
}
export default MobileMenu