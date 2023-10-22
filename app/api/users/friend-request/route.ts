import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ message: "User ID is Missing" }, { status: 404 })
    }

    await db.friendRequest.create({
      data: {
        userId,
        userIdRequest: user.id
      }
    })

    return NextResponse.json({ message: "Success send friend request", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIEND_REQUEST_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}