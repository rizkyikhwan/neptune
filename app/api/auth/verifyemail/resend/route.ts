import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
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

    await sendEmail({ email: user.email, token: emailVerify.verifyToken, type: "Verify Email" })

    return NextResponse.json(emailVerify)
  } catch (error) {
    console.log(error, "[RESEND_VERIFYEMAIL_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}