"use client"

import MobileMenu from "@/components/mobile-menu"

const HeaderConversation = ({ userId }: { userId: string }) => {
  return (
    <section className="min-h-[48px] shadow py-2 px-4 border-b flex items-center relative">
      <div className="md:hidden">
        <MobileMenu />
      </div>
      <div>User id {userId}</div>
    </section>
  )
}
export default HeaderConversation