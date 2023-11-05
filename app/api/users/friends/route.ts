import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { prismaExclude } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const friendList = await db.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        friends: {
          select: {
            id: true,
            email: true,
            displayname: true,
            username: true,
            friends: {
              select: prismaExclude("User", ["password", "emailVerified", "resetPasswordToken", "resetPasswordTokenExpiry", "verifyToken", "verifyTokenExpiry", "userFriendIDs"])
            },
            friendIDs: true,
            hexColor: true,
            avatar: true,
            banner: true,
            bannerColor: true,
            bio: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            username: "asc"
          }
        }
      }
    })

    if (!friendList) {
      return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 })
    }

    return NextResponse.json({ data: friendList.friends, status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIENDS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}

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

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        friends: {
          connect: {
            id: userId
          }
        }
      }
    })

    await db.user.update({
      where: {
        id: userId
      },
      data: {
        friends: {
          connect: {
            id: user.id
          }
        }
      }
    })

    const userFriendRequest = await db.friendRequest.findFirst({
      where: {
        AND: [
          {
            userRequestId: userId
          },
          {
            userRequestToIDs: {
              has: user.id
            }
          }
        ]
      }
    })

    if (!userFriendRequest) {
      return NextResponse.json({ message: "Friend request not found", status: 404 }, { status: 404 })
    }

    if (userFriendRequest.userRequestToIDs.length === 1) {
      await db.friendRequest.delete({
        where: {
          userRequestId: userId
        }
      })
    } else {
      await db.friendRequest.update({
        where: {
          userRequestId: user.id
        },
        data: {
          userRequestToIDs: {
            set: userFriendRequest.userRequestToIDs.filter(id => id !== user.id)
          }
        }
      })
    }

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        friendsRequestIDs: {
          set: user.friendsRequestIDs.filter(id => id !== userId)
        }
      }
    })

    return NextResponse.json({ message: "OK", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIENDS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ message: "User ID is Missing" }, { status: 404 })
    }

    const userFriendAccount = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!userFriendAccount) {
      return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 })
    }

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        friends: {
          disconnect: {
            id: userId
          }
        }
      }
    })

    await db.user.update({
      where: {
        id: userId
      },
      data: {
        friends: {
          disconnect: {
            id: user.id
          }
        }
      }
    })

    return NextResponse.json({ message: "OK", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIENDS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}