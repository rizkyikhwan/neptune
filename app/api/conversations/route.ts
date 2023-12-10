import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { prismaExclude } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const conversation = await db.conversation.findMany({
      where: {
        OR: [
          {
            userOneId: user.id
          },
          {
            userTwoId: user.id
          },
        ]
      },
      include: {
        userOne: true,
        userTwo: true,
        directMessages: {
          include: {
            seen: {
              select: prismaExclude("User", ["password", "emailVerified", "resetPasswordToken", "resetPasswordTokenExpiry", "verifyToken", "verifyTokenExpiry", "userFriendIDs"])
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: "desc"
      }
    })

    if (!conversation) {
      return null
    }

    return NextResponse.json({ data: conversation }, { status: 200 })
  } catch (error) {
    console.log("[CONVERSATIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}