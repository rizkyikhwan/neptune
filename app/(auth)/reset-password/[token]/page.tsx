import FormResetPassword from "@/components/form-action/form-reset-password"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface ResetPasswordProps {
  params: {
    token: string
  }
}

const ResetPasswordPage = async ({ params }: ResetPasswordProps) => {
  const { token } = params

  if (!token) {
    redirect("/")
  }

  const checkTokenPassword = await db.user.findFirst({
    where: {
      AND: [
        {
          resetPasswordToken: token
        },
        {
          resetPasswordTokenExpiry: {
            gt: new Date(Date.now() - 30 * 60 * 1000)
          }
        }
      ],
    }
  })

  if (!checkTokenPassword) {
    redirect("/")
  }

  return (
    <>
      <FormResetPassword userId={checkTokenPassword.id} token={token} />
    </>
  )
}
export default ResetPasswordPage