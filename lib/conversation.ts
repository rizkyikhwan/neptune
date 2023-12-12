import { db } from "./db"
import { prismaExclude } from "./utils"

const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: {
              equals: [userOneId, userTwoId]
            }
          },
          {
            userIds: {
              equals: [userTwoId, userOneId]
            }
          }
        ]
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
  } catch (error) {
    return null
  }
}

const createNewConversation = async (userOneId: string, userTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: userOneId
            },
            {
              id: userTwoId
            },
          ]
        }
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
  } catch (error) {
    return null
  }
}

export const getOrCreateConversation = async (userOneId: string, userTwoId: string) => {
  let conversation = await findConversation(userOneId, userTwoId)

  if (!conversation) {
    conversation = await createNewConversation(userOneId, userTwoId)
  }

  return conversation
}