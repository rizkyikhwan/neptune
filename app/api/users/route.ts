import cloudinary from "@/lib/cloudinary"
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

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { displayname, username, avatar, hexColor, banner, bannerColor, bio } = body
    
    let userAvatar
    let userBanner

    if (avatar?.includes("base64")) {
      user.pathAvatar && await cloudinary.uploader.destroy(user.pathAvatar)

      userAvatar = await cloudinary.uploader.upload(avatar, {
        folder: `neptune/users/${username}/avatar`,
        resource_type: "image",
        transformation: {
          quality: "auto"
        }
      })
    } else if (avatar === null) {
      userAvatar = null

      await cloudinary.uploader.destroy(user.pathAvatar || "")
    }

    if (banner?.includes("base64")) {
      user.pathBanner && await cloudinary.uploader.destroy(user.pathBanner)

      userBanner = await cloudinary.uploader.upload(banner, {
        folder: `neptune/users/${username}/banner`,
        resource_type: "image",
        transformation: {
          quality: "auto"
        }
      })
    } else if (banner === null) {
      userBanner = null

      await cloudinary.uploader.destroy(user.pathBanner || "")
    }

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        displayname,
        username,
        avatar: avatar ? userAvatar?.secure_url : avatar === null ? null : undefined,
        pathAvatar: avatar ? userAvatar?.public_id : avatar === null ? null : undefined,
        hexColor,
        banner: banner ? userBanner?.secure_url : banner === null ? null : undefined,
        pathBanner: banner ? userBanner?.public_id : banner === null ? null : undefined,
        bannerColor,
        bio
      }
    })

    return NextResponse.json({ message: "Update Success", status: 201 }, { status: 201 })
  } catch (error) {
    console.log(error, "[UPDATE_PROFILE_USER_ERROR]")
    return new NextResponse("Internal Error", { status: 500 }) 
  }
}