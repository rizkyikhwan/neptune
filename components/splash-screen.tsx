import LogoNeptuneDark from "@/public/logo/logo-dark.svg"
import LogoNeptuneLight from "@/public/logo/logo-light.svg"
import { useTheme } from "next-themes"

const SplashScreen = () => {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen select-none">
      {theme === "dark" && <LogoNeptuneDark width={40} height={100} className="animate-logo-splash-screen" />}
      {theme === "light" && <LogoNeptuneLight width={40} height={100} className="animate-logo-splash-screen" />}
      <p className="font-semibold tracking-wide uppercase">Neptune</p>
      <p className="text-sm">You're on this planet.</p>
    </div>
  )
}
export default SplashScreen