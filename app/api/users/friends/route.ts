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
        userFriends: {
          include: {
            userProfile: {
              select: prismaExclude("User", ["password", "emailVerified", "resetPasswordToken", "resetPasswordTokenExpiry", "verifyToken", "verifyTokenExpiry"])
            }
          },
        }
      }
    })

    if (!friendList) {
      return NextResponse.json({ message: "User not found", status: 404 }, { status: 404 })
    }

    return NextResponse.json({ data: friendList.userFriends, status: 200 }, { status: 200 })
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

    const checkUserAlreadyFriend = await db.friends.findFirst({
      where: {
        AND: [
          {
            id: user.id
          },
          {
            userFriendsIDs: {
              has: userId
            }
          }
        ]
      }
    })

    if (checkUserAlreadyFriend) {     
      return NextResponse.json({ message: "Already become friends", status: 409 }, { status: 409 })
    }

    const userHasFriend = await db.friends.findFirst({
      where: {
        id: user.id
      }
    })

    if (userHasFriend) {
      await db.friends.update({
        where: {
          id: user.id
        },
        data: {
          userFriends: {
            connect: { 
              id: userId 
            }
          }
        }
      })

      await db.friends.upsert({
        where: {
          id: userId
        },
        create: {
          id: userId,
          userFriends: {
            connect: {
              id: user.id
            }
          }
        },
        update: {
          userFriendsIDs: {
            push: user.id
          }
        }
      })
    } else {
      await db.friends.create({
        data: {
          id: user.id,
          userFriends: {
            connect: {
              id: userId
            }
          }
        }
      })
  
      await db.friends.create({
        data: {
          id: userId,
          userFriends: {
            connect: {
              id: user.id
            }
          }
        }
      })
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
    
    const userFriends = await db.friends.findFirst({
      where: {
        AND: [
          {
            id: userId
          },
          {
            userFriendsIDs: {
              has: user.id
            }
          }
        ]
      }
    })

    if (!userFriends) {     
      return NextResponse.json({ message: "User friend not found", status: 404 }, { status: 404 })
    }
    

    if (userFriends.userFriendsIDs.length === 1) {
      await db.friends.delete({
        where: {
          id: userId
        }
      })

      if (user.userFriendsIDs.length === 1) {
        await db.friends.delete({
          where: {
            id: user.id
          }
        })
      } else {
        await db.friends.update({
          where: {
            id: user.id
          },
          data: {
            userFriends: {
              disconnect: {
                id: userId
              }
            },
            userFriendsIDs: {
              push: user.friendsRequestIDs.filter(id => id !== userId)
            }
          }
        })
      }
      
    } else {
      await db.friends.update({
        where: {
          id: user.id
        },
        data: {
          userFriends: {
            disconnect: {
              id: userId
            }
          }
        }
      })

      await db.friends.update({
        where: {
          id: userId
        },
        data: {
          userFriends: {
            disconnect: {
              id: user.id
            }
          }
        }
      })
    }

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        userFriendsIDs: {
          set: user.userFriendsIDs.filter(id => id !== userId)
        }
      }
    })

    await db.user.update({
      where: {
        id: userId
      },
      data: {
        userFriendsIDs: {
          set: userFriendAccount.userFriendsIDs.filter(id => id !== user.id)
        }
      }
    })

    return NextResponse.json({ message: "OK", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[FRIENDS_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}