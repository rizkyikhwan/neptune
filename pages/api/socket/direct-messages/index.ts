import cloudinary from "@/lib/cloudinary";
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
    const { content, fileUrl } = req.body
    const { conversationId } = req.query

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is missing" })
    }

    if (!content) {
      return res.status(400).json({ error: "Content is missing" })
    }

    let msgImage

    if (fileUrl?.includes("base64")) {
      msgImage = await cloudinary.uploader.upload(fileUrl, {
        folder: `neptune/messages/${user.username}`,
        resource_type: "image",
        transformation: {
          quality: "auto"
        }
      })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        userIds: {
          hasSome: [user.id, user.id]
        }
      },
      include: {
        users: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" })
    }

    const currentUser = conversation.userIds[0].includes(user.id) ? conversation.users[0] : conversation.users[1]

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    let message

    if (content === fileUrl && msgImage) {
      message = await db.directMessage.create({
        data: {
          content: msgImage ? msgImage?.secure_url : "",
          fileUrl: msgImage ? msgImage.secure_url : undefined,
          conversationId: conversationId as string,
          senderId: currentUser.id,
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          sender: {
            select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
          }
        }
      })
    } else if (msgImage) {
      message = await db.directMessage.create({
        data: {
          content,
          fileUrl: msgImage ? msgImage.secure_url : undefined,
          conversationId: conversationId as string,
          senderId: currentUser.id,
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          sender: {
            select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
          }
        }
      })
    } else {
      message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId as string,
          senderId: currentUser.id,
          seen: {
            connect: {
              id: currentUser.id
            }
          }
        },
        include: {
          sender: {
            select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
          }
        }
      })

    }

    const updatedConversation = await db.conversation.upsert({
      where: {
        id: conversationId as string
      },
      create: {
        userIds: {
          set: conversation.userIds
        },
        directMessages: {
          connect: {
            id: message.id
          }
        }
      },
      update: {
        lastMessageAt: new Date()
      },
      include: {
        users: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        },
        directMessages: {
          include: {
            seen: true
          }
        }
      }
    })

    const channelKey = `chat:${conversationId}:messages`
    const channelKeyMsg = `chat:${conversationId}:messages:new`
    const conversationKeyMsg = `chat:${conversationId}:conversation:update`

    res.socket.server.io.emit(channelKey, message)
    res.socket.server.io.emit(channelKeyMsg, message)
    res.socket.server.io.emit(conversationKeyMsg, updatedConversation)
    res.socket.server.io.emit("chat:conversation:new", updatedConversation)

    return res.status(200).json({ message: "Message sended" })
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" })
  }
}