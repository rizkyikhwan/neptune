import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { EmailEnum } from "@/lib/type"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const hasVerifyCode = await db.emailVerifyCode.findUnique({
      where: {
        userId: user.id
      }
    })

    let code = uuidv4().split("-")[0]

    if (!hasVerifyCode) {
      await db.emailVerifyCode.create({
        data: {
          verifyCode: code,
          userId: user.id,
          userEmail: user.email,
          createdAt: new Date()
        }
      })
    }

    if (hasVerifyCode) {
      await db.emailVerifyCode.update({
        where: {
          userEmail: user.email
        },
        data: {
          verifyCode: code,
          createdAt: new Date()
        }
      })
    }

    await sendEmail({
      username: user.username, 
      code, 
      email: user.email,
      token: null,
      type: EmailEnum.VerifyCode,
    })


    return NextResponse.json({ message: "Verify Code sended" }, { status: 201 })
  } catch (error) {
    console.log(error, "[CHANGE_EMAIL_VERIFY_CODE_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}