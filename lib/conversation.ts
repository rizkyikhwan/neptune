import { db } from "./db"
import { prismaExclude } from "./utils"

const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          { userOneId },
          { userTwoId }
        ]
      },
      include: {
        userOne: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        },
        userTwo: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
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
        userOneId,
        userTwoId
      },
      include: {
        userOne: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        },
        userTwo: {
          select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
        }
      }
    })
  } catch (error) {
    return null
  }
}

export const getOrCreateConversation = async (userOneId: string, userTwoId: string) => {
  let conversation = await findConversation(userOneId, userTwoId) || await findConversation(userTwoId, userOneId)

  if (!conversation) {
    conversation = await createNewConversation(userOneId, userTwoId)
  }

  return conversation
}