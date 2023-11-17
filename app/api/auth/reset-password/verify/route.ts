import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { EmailEnum } from "@/lib/type"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: "Email is missing" }, { status: 404 })
    }

    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const createToken = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        resetPasswordToken: uuidv4().replace(/-/g, ""),
        resetPasswordTokenExpiry: new Date()
      }
    })

    await sendEmail({ username: user.username, email: createToken.email, token: createToken.resetPasswordToken, code: "", type: EmailEnum.ResetPassword })

    return NextResponse.json({ message: "Email successfully sended" }, { status: 201 })
  } catch (error) {
    console.log(error, "[RESET_PASSWORD_VERIFY_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}