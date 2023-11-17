import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { EmailEnum } from "@/lib/type"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { email } = body

    if (user.email === email) {
      return NextResponse.json({ message: "This email is the same as the previous one" }, { status: 403 })
    }

    const userEmail = await db.user.update({
      where: {
        email: user.email
      },
      data: {
        email,
        emailVerified: false,
        verifyToken: uuidv4().replace(/-/g, ""),
        verifyTokenExpiry: new Date()
      }
    })

    if (!userEmail) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 })
    }

    await db.emailVerifyCode.delete({
      where: {
        userId: user.id
      }
    })

    await sendEmail({ username: userEmail.username, email: userEmail.email, code: "", token: userEmail.verifyToken, type: EmailEnum.NewEmail })

    return NextResponse.json({ message: "Email changed" }, { status: 201 })
  } catch (error) {
    console.log(error, "[CHANGE_EMAIL_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}