import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { EmailEnum } from "@/lib/type"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: "User already verified" }, { status: 405 })
  }

  try {
    const emailVerify = await db.user.update({
      where: {
        id: user.id,
        email: user.email,
        verifyToken: user.verifyToken
      },
      data: {
        verifyToken: uuidv4().replace(/-/g, ""),
        verifyTokenExpiry: new Date()
      }
    })

    await sendEmail({ username: user.username, email: user.email, token: emailVerify.verifyToken, code: "", type: EmailEnum.VerifyEmail })

    return NextResponse.json({ message: "Email successfully resended" }, { status: 200 })
  } catch (error) {
    console.log(error, "[RESEND_VERIFYEMAIL_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}