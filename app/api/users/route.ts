import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { prismaExclude } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const search = url.searchParams.get("search")

    const allUsers = await db.user.findMany({
      where: {
        username: {
          contains: search ? search : undefined
        }
      },
      select: prismaExclude("User", ["password", "verifyToken", "verifyTokenExpiry", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry"])
    })

    const filterUser = allUsers.filter(item => item.id !== user.id)

    if (filterUser.length === 0) {
      return NextResponse.json({ message: "User not found.", status: 404 }, { status: 404 })
    }

    return NextResponse.json({ data: filterUser, status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[ALL_USERS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}