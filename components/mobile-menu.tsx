import { Menu } from "lucide-react"
import MeSidebar from "./me/me-sidebar"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-20">
          {/* <NavigationSidebar /> */}
          <p>tes</p>
        </div>
        <MeSidebar />
      </SheetContent>
    </Sheet>
  )
}
export default MobileMenu