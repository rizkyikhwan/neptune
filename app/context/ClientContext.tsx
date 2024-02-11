"use client"

import { Server, User } from "@prisma/client"
import React, { createContext, useContext } from "react"

interface ClientContextProps {
  children: React.ReactNode
  user?: User
  conversations?: any
  servers?: Server[]
}

interface ClientContextType {
  user: any
  conversations: any
  servers: any
}

const ClientContext = createContext<ClientContextType>({
  user: {},
  conversations: [],
  servers: []
})

export const useClientContext = () => {
  return useContext(ClientContext)
}

export default function ClientContextProvider({ children, user, conversations, servers }: ClientContextProps) {

  return (
    <ClientContext.Provider value={{ user, conversations, servers }}>
      {children}
    </ClientContext.Provider>
  )
}