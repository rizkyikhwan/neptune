import ClientContextProvider from "@/app/context/ClientContext";
import ClientLayout from "@/components/client-layout";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()

  if (!user?.emailVerified) {
    return redirect("/verification")
  }

  return (
    <ClientContextProvider user={user}>
      <ClientLayout className="h-full">
        <div className="hidden md:flex h-full w-[72px] flex-col fixed inset-y-0">
          <NavigationSidebar user={user} />
        </div>
        <div className="md:pl-[72px] h-full">
          {children}
        </div>
      </ClientLayout>
    </ClientContextProvider>
  )
}
export default MainLayout