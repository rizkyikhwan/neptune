import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { prismaExclude } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId } = params

    const user1 = await db.user.findUnique({
      where: { 
        id: user.id
      },
      include: { 
        friends: {
          select: prismaExclude("User", ["emailVerified", "friendsRequestIDs", "password", "resetPasswordToken", "resetPasswordTokenExpiry", "userFriendIDs", "verifyToken", "verifyTokenExpiry"])
        } 
      },
    })

    const user2 = await db.user.findUnique({
      where: { 
        id: userId 
      },
      include: { 
        friends: {
          select: prismaExclude("User", ["emailVerified", "friendsRequestIDs", "password", "resetPasswordToken", "resetPasswordTokenExpiry", "userFriendIDs", "verifyToken", "verifyTokenExpiry"])
        } 
      },
    })

    if (!user1 || !user2) {
      return NextResponse.json({ message: 'Users not found'}, { status: 404 });
    }

    const mutualFriends = user1.friends.filter(friend1 => user2.friends.some(friend2 => friend2.id === friend1.id))

    return NextResponse.json({ data: mutualFriends }, { status: 200 })
  } catch (error) {
    console.log(error, "[USERS_MUTUALS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}