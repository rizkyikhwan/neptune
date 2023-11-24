"use client"

import { User } from "@prisma/client"
import React, { createContext, useContext } from "react"

interface ClientContextProps {
  children: React.ReactNode
  user?: User
  conversations?: any
}

interface ClientContextType {
  user: any
  conversations: any
}

const ClientContext = createContext<ClientContextType>({
  user: {},
  conversations: []
})

export const useClientContext = () => {
  return useContext(ClientContext)
}

export default function ClientContextProvider({ children, user, conversations }: ClientContextProps) {

  return (
    <ClientContext.Provider value={{ user, conversations }}>
      {children}
    </ClientContext.Provider>
  )
}