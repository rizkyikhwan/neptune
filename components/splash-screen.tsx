import LogoNeptuneDark from "@/public/logo/logo-dark.svg"

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-primary text-zinc-200">
      <LogoNeptuneDark width={40} height={100} className="animate-logo-splash-screen" />
      <p className="font-semibold tracking-wide uppercase">Neptune</p>
      <p className="text-sm">You're on this planet.</p>
    </div>
  )
}
export default SplashScreen