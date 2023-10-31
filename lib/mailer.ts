import nodemailer from "nodemailer";
import { EmailType } from "./type";
import { render } from "@react-email/render";
import VerifyEmail from "@/components/email/verify-email";
import ResetPasswordEmail from "@/components/email/reset-password-email";

interface SendEmailType {
  username: string
  email: string,
  token: string | null,
  type: EmailType
}

export const sendEmail = async ({ username, email, token, type }: SendEmailType) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ed6057b9b8cdae",
        pass: "8782a6bbd15117"
      }
    })

    const mailOptions = {
      from: "noreply@neptune.com",
      to: email,
      subject: type === "Verify Email" ? "Verify your email" : type === "Reset Password" ? "Reset your password" : "No reply",
      html: type === "Verify Email" ? render(VerifyEmail({ username, token })) : type === "Reset Password" ? render(ResetPasswordEmail({ token })) : "No reply"
    }

    const mailResponse = await transport.sendMail(mailOptions)

    return mailResponse
  } catch (error) {
    console.log(error);
  }
}