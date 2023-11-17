import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mailer"
import { EmailEnum } from "@/lib/type"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 })
  }

  try {
    const { code } = params
    
    if (!code) {
      return NextResponse.json({ message: "Verify code is missing" }, { status: 404 })
    }

    const isVerifyCode = await db.emailVerifyCode.findFirst({
      where: {
        AND: [
          {
            verifyCode: code
          },
          {
            createdAt: {
              gt: new Date(Date.now() - 30 * 60 * 1000)
            }
          }
        ]
      }
    })

    if (!isVerifyCode) {
      return NextResponse.json({ message: "Verify code not found or expired" }, { status: 404 })
    }

    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (error) {
    console.log(error, "[CHANGE_EMAIL_VERIFY_CODE_ERROR]")
    return new NextResponse("Internal Error", { status: 500 })
  }
}