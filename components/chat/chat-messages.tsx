"use client"

import { useChatQuery } from "@/app/hooks/useChatQuery"
import useChatScroll from "@/app/hooks/useChatScroll"
import { useChatSocket } from "@/app/hooks/useChatSocket"
import { DirectMessage, User } from "@prisma/client"
import { formatDistance } from "date-fns"
import { Loader2, ServerCrash } from "lucide-react"
import { ElementRef, Fragment, useEffect, useRef } from "react"
import ChatItem from "./chat-item"
import axios from "axios"
import { useMessagesStore } from "@/app/hooks/useMessagesStore"
import ChatWelcome from "./chat-welcome"

const DATE_FORMAT = "d MMM yyyy, HH:mm"

type MessageWithProfile = DirectMessage & {
  sender: User
}

interface ChatMessagesProps {
  name: string
  user: User
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: "channelId" | "conversationId"
  paramValue: string
  type: "channel" | "conversation"
}

const ChatMessages = ({ name, user, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)

  const { setIsLoading } = useMessagesStore()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue })
  useChatSocket({ addKey, updateKey, queryKey, chatId })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0].items?.length ?? 0
  })

  useEffect(() => {
    axios.post(`/api/socket/conversations/${chatId}/seen`)

    status === "pending" ? setIsLoading(true) : setIsLoading(false)
  }, [chatId, status])

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex flex-col flex-1 pt-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
          ) : (
            <button onClick={() => fetchNextPage()} className="my-4 text-xs transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300">
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => {
          const newFirstMessage = group.items.filter((item: MessageWithProfile) => !item.seenIds.includes(user.id) && item)

          return (
            <Fragment key={i}>
              {group.items.map((message: MessageWithProfile) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  user={user}
                  otherUser={message.sender}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={formatDistance(new Date(message.createdAt), new Date())}
                  isUpdated={message.messageUpdatedAt !== message.createdAt}
                  markNewMessage={newFirstMessage[newFirstMessage.length - 1]?.id === message.id}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ))}
            </Fragment>
          )
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
export default ChatMessages