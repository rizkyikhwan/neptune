import { useSocket } from "@/components/providers/socket-provider"
import { ChatSocketProps, MessageWithProfile } from "@/lib/type"
import { useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useEffect } from "react"

export const useChatSocket = ({ addKey, updateKey, queryKey, chatId }: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.on(updateKey, (message: MessageWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithProfile) => {
              if (item.id === message.id) {
                return message
              }

              return item
            })
          }
        })

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    socket.on(addKey, (message: MessageWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message]
            }]
          }
        }

        axios.post(`/api/socket/conversations/${chatId}/seen`)

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [
            message,
            ...newData[0].items
          ]
        }

        return {
          ...oldData,
          pages: newData
        }
      })
    })

    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, updateKey, queryKey, socket])
}