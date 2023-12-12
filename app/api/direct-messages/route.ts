import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { prismaExclude } from "@/lib/utils"
import { DirectMessage } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGES_BATCH = 15

export async function GET(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get("cursor")
    const conversationId = searchParams.get("conversationId")

    if (!conversationId) {
      return NextResponse.json({ message: "Conversation Id missing" }, { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          conversationId
        },
        include: {
          sender: {
            select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId
        },
        include: {
          sender: {
            select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({ items: messages, nextCursor }, { status: 200 })
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}