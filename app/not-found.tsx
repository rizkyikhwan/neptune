"use client"

import Lottie from "lottie-react";
import NotFoundAnimation from "@/public/lottie/not-found.json"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-2">
      <Lottie animationData={NotFoundAnimation} loop className="w-[420px]" />
      <h6 className="text-base font-semibold tracking-wider ">Oops! Page Not Found</h6>
      <p className="text-center w-[500px] text-sm">Sorry, but it seems like the page you were looking for doesn't exist, has been moved, or is temporarily unavailable. Don't worry, i can help you get back on the planet.</p>
      <Button variant={"outline"} onClick={() => router.push("/me/channels")}>Back to the planet</Button>
    </div>
  )
}