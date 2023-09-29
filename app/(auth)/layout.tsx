import Image from "next/image"
import BG from "@/public/image/bg.png"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen md:p-12 bg-[#313338] md:bg-white bg-center bg-cover bg-repeat" style={{ backgroundImage: `url(${BG.src})` }}>
      {/* <Image 
        fill
        src={BG}
        alt="bg"
      /> */}

      {children}
    </main>
  )
}
export default AuthLayout