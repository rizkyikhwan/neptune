import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { current_password, new_password } = body

    const isCorrectPassword = await bcrypt.compare(
      current_password,
      user.password
    )
    
    if (!isCorrectPassword) {
      return NextResponse.json({ message: "Your current password is incorrect" }, { status: 401 })
    }

    if (!new_password) {
      return NextResponse.json({ message: "New password is missing" }, { status: 404 })
    }

    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(new_password, salt)

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hasedPassword
      }
    })
    
    return NextResponse.json({ message: "Password Updated" }, { status: 201 })
  } catch (error) {
    console.log(error, "[UPDATE_PASSWORD_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}