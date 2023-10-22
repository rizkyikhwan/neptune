import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { randomHexColor } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, displayname, password } = body

    if (!email || !username || !password) {
      return NextResponse.json({ message: "Please filled the form", status: 400 }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    const checkEmailAlreadyUsed = await db.user.findUnique({
      where: {
        email
      }
    })

    if (checkEmailAlreadyUsed) {
      return NextResponse.json({ message: "Your account may already exist, try to login or reset your password", status: 409 }, { status: 409 })
    }

    const checkUsernameAlreadyUsed = await db.user.findUnique({
      where: {
        username
      }
    })

    if (checkUsernameAlreadyUsed) {
      return NextResponse.json({ message: "Username already exist, try to another username", status: 409 }, { status: 409 })
    }

    const user = await db.user.create({
      data: {
        email,
        username,
        displayname,
        password: hasedPassword,
        verifyToken: uuidv4().replace(/-/g, ""),
        hexColor: randomHexColor()
      }
    })

    await sendEmail({ username, email, token: user.verifyToken, type: "Verify Email" })

    return NextResponse.json({ message: "Successfully Sign Up", status: 200 }, { status: 200 })
  } catch (error) {
    console.log(error, "[SIGNUP_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}