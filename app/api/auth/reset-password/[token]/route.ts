import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

interface ResetPasswordParams {
  params: {
    token: string
  }
}

export async function PATCH(req: Request, { params }: ResetPasswordParams) {
  try {
    const body = await req.json()
    const { password, userId } = body
    const { token } = params

    if (!token) {
      return NextResponse.json({ message: "Token is missing" }, { status: 404 })
    }

    if (!password) {
      return NextResponse.json({ message: "Please filled the form" }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    await db.user.update({
      where: {
        id: userId,
        resetPasswordToken: token
      },
      data: {
        password: hasedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null
      }
    })

    return NextResponse.json({ message: "Password Updated" }, { status: 201 })
  } catch (error) {
    console.log(error, "[RESET_PASSWORD_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}