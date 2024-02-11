import cloudinary from "@/lib/cloudinary";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json()
    const user = await currentUser()
    let serverImg

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (imageUrl.includes("base64")) {
      serverImg = await cloudinary.uploader.upload(imageUrl, {
        folder: `neptune/servers/${name}`,
        resource_type: "image",
        transformation: {
          quality: "auto"
        }
      })
    }

    await db.server.create({
      data: {
        userId: user.id,
        name,
        imageUrl: serverImg ? serverImg?.secure_url : undefined,
        inviteCode: uuidv4(),
        channels: {
          create: [
            { name: "general", userId: user.id }
          ]
        },
        members: {
          create: [
            { userId: user.id, role: MemberRole.ADMIN }
          ]
        }
      }
    })

    return NextResponse.json({ message: "Create Server Success" }, { status: 201 })
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}