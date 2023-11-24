import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input"
import ChatMessages from "@/components/chat/chat-messages"
import HeaderLayout from "@/components/header-layout"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentUser } from "@/lib/currentUser"
import { redirect } from "next/navigation"

interface UserIdConversationProps {
  params: {
    userId: string
  }
}

const UserIdConversation = async ({ params }: UserIdConversationProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect("/")
  }

  const conversation = await getOrCreateConversation(user.id, params.userId)

  if (!conversation) {
    return redirect("/me/channels")
  }

  const { userOne, userTwo } = conversation

  const otherUser = userOne.id === user.id ? userTwo : userOne

  return (
    <HeaderLayout>
      <ChatHeader user={otherUser} type="conversation" />
      <ChatMessages
        user={user}
        name={user.displayname || user.username}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id
        }}
      />
      <ChatInput 
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id
        }}
        name={otherUser.displayname || otherUser.username} 
        type="conversation" 
      />
    </HeaderLayout>
  )
}
export default UserIdConversation