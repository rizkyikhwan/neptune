import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, displayname, password } = body

    if (!email || !username || !password) {
      return new NextResponse("Please filled the form", { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(password, salt)

    const user = await db.user.create({
      data: {
        email,
        username,
        displayname,
        password: hasedPassword
      }
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.log(error, "[SIGNUP_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}