import { currentUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface EmailVerificationParams {
  params: {
    token: string
  }
}

const EmailVerification = async ({ params }: EmailVerificationParams) => {
  const user = await currentUser()

  const { token } = params

  if (!user) {
    redirect("/")
  }

  if (user.emailVerified) {
    redirect("/explore")
  }

  if (!token) {
    redirect("/verification")
  }

  const validationUser = await db.user.findFirst({
    where: {
      AND: [
        {
          id: user.id
        },
        {
          verifyTokenExpiry: {
            gt: new Date(Date.now() - 30 * 60 * 1000)
          }
        },
        {
          verifyToken: token
        }
      ],
    }
  })

  if (!validationUser) {
    redirect("/verification")
  }

  await db.user.update({
    where: {
      id: validationUser.id
    },
    data: {
      emailVerified: true
    }
  })

  redirect("/explore")
}
export default EmailVerification