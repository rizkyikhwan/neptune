import BG from "@/public/image/bg.png"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="overflow-hidden bg-center bg-repeat bg-cover" style={{ backgroundImage: `url(${BG.src})` }}>
      <div className="flex flex-col min-h-0">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="relative w-[100vw] min-h-screen overflow-auto">
              <div className="absolute top-0 left-0 min-h-[580px] flex items-center justify-center w-full h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default AuthLayout