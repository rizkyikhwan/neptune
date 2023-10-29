"use client"

import { useSession } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  onlineUsers: any[]
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: []
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    let id: string

    const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false
    })
    // const socketInstance = new (io as any)("http://localhost:3001")

    socketInstance.on("connect", () => {
      if (data) {
        id = data.user.id
        socketInstance.emit("new-user-add", data.user.id)

        socketInstance.on("get-users", (user: []) => {
          setOnlineUsers(user)
        })

        setIsConnected(true)
      }
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })

    const handleFocusTab = () => {
      socketInstance.emit("new-user-add", id)
    }

    const handleCloseTab = () => {
      socketInstance.emit("offline", id)
    }

    setSocket(socketInstance)

    window.addEventListener("focus", handleFocusTab)
    window.addEventListener("beforeunload", handleCloseTab)

    return () => {
      socketInstance.disconnect()
      window.removeEventListener("focus", handleFocusTab)
      window.removeEventListener("beforeunload", handleCloseTab)
    }
  }, [data])

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}