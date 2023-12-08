import { currentUserPages } from "@/lib/currentUserrPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/lib/type";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const user = await currentUserPages(req, res)
    const { directMessageId, conversationId } = req.query
    const { content } = req.body

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID Missing" })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            userOneId: user.id
          },
          {
            userTwoId: user.id
          }
        ]
      },
      include: {
        userOne: true,
        userTwo: true,
        directMessages: {
          include: {
            seen: true
          }
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
    }

    const currentUser = conversation.userOne.id === user.id ? conversation.userOne : conversation.userTwo

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" })
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string
      },
      include: {
        user: true
      }
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" })
    }

    const isMessageOwner = directMessage.userId === currentUser.id

    if (!isMessageOwner) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          user: true,
          seen: true
        }
      })
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          content,
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          user: true,
          seen: true
        }
      })
    }

    const updateKey = `chat:${conversation.id}:messages:update`
    const channelKeyMsg = `chat:${conversationId}:messages:new`

    res.socket.server.io.emit(updateKey, directMessage)
    res.socket.server.io.emit(channelKeyMsg, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" })
  }
}