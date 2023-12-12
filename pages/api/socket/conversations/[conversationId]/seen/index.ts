import { currentUserPages } from "@/lib/currentUserrPages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/lib/type";
import { prismaExclude } from "@/lib/utils";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const user = await currentUserPages(req, res)
    const { conversationId } = req.query

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID Missing" })
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId as string
      },
      include: {
        users: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        },
        directMessages: {
          include: {
            seen: true
          }
        },
      }
    })

    if (!conversation) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const lastMessage = conversation.directMessages[conversation.directMessages.length - 1]

    if (!lastMessage) {
      return res.json({ message: "OK" })
    }

    const updatedMessage = await db.directMessage.update({
      where: {
        id: lastMessage.id
      },
      include: {
        seen: true,
        sender: true
      },
      data: {
        seen: {
          connect: {
            id: user.id
          }
        }
      }
    })

    await db.directMessage.updateMany({
      where: {
        conversationId: conversationId as string,
        NOT: {
          seenIds: {
            has: user.id
          }
        }
      },
      data: {
        seenIds: {
          push: user.id
        },
      }
    })

    if (lastMessage.seenIds.indexOf(user.id) !== -1) {
      return res.json({ message: "OK" })
    }

    const channelKey = `chat:messages:seen`

    res.socket.server.io.emit(channelKey, updatedMessage)

    return res.json({ message: "OK" })
  } catch (error) {
    console.log("[DIRECT_MESSAGES_SEEN_POST]", error);
    return res.status(500).json({ message: "Internal Error" })
  }
}