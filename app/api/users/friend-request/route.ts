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
    const pendingRequest = await db.user.findUnique({
      where: {
        id: user.id
      },
      include: {
        friendsRequest: {
          include: {
            userRequest: {
              select: prismaExclude("User", ["password", "friendsRequestIDs", "resetPasswordToken", "resetPasswordTokenExpiry", "verifyToken", "verifyTokenExpiry"]),
            }
          },
          orderBy: {
            userRequest: {
              createdAt: "desc"
            }
          }
        }
      }
    })

    if (!pendingRequest) {
      return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 })
    }

    return NextResponse.json({ data: pendingRequest.friendsRequest, status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIEND_REQUEST_ERROR]")
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

    const checkUserAlreadyFriend = await db.user.findFirst({
      where: {
        AND: [
          {
            id: user.id
          },
          {
            friendIDs: {
              has: userId
            }
          }
        ]
      }
    })

    if (checkUserAlreadyFriend) {     
      return NextResponse.json({ message: "Already become friends", status: 409 }, { status: 409 })
    }

    const checkUserAlreadyRequest = await db.friendRequest.findFirst({
      where: {
        AND: [
          {
            userRequestId: user.id
          },
          {
            userRequestToIDs: {
              has: userId
            }
          }
        ]
      }
    })

    if (checkUserAlreadyRequest) {     
      return NextResponse.json({ message: "Already send friend request to this user", status: 409 }, { status: 409 })
    }

    const checkUserHasRequest = await db.friendRequest.findFirst({
      where: {
        userRequestId: user.id
      }
    })

    if (checkUserHasRequest) {
      const friendRequest = await db.friendRequest.update({
        where: {
          userRequestId: checkUserHasRequest.userRequestId
        },
        data: {
          userRequestToIDs: {
            push: userId
          }
        }
      })

      await db.user.update({
        where: {
          id: userId
        },
        data: {
          friendsRequestIDs: {
            push: friendRequest.userRequestId
          }
        }
      })
    } else {
      const friendRequest = await db.friendRequest.create({
        data: {
          userRequestId: user.id,
          userRequestToIDs: {
            set: [userId]
          }
        }
      })

      await db.user.update({
        where: {
          id: userId
        },
        data: {
          friendsRequestIDs: {
            push: friendRequest.userRequestId
          }
        }
      })
    }

    return NextResponse.json({ message: "OK", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIEND_REQUEST_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
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
    console.log(error, "[FRIEND_REQUEST_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}