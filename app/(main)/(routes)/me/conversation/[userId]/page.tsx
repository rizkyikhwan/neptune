import HeaderConversation from "@/components/conversation/header-conversation"
import HeaderLayout from "@/components/header-layout"

interface UserIdConversationProps {
  params: {
    userId: string
  }
}

const UserIdConversation = ({ params }: UserIdConversationProps) => {
  return (
    <HeaderLayout>
      <HeaderConversation userId={params.userId} />
    </HeaderLayout>
  )
}
export default UserIdConversation