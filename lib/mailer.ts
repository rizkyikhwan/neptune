import ResetPasswordEmail from "@/components/email/reset-password-email";
import VerifyCode from "@/components/email/verify-code";
import VerifyEmail from "@/components/email/verify-email";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { EmailEnum } from "./type";

interface SendEmailType {
  username: string
  email: string,
  token: string | null,
  code: string,
  type: EmailEnum
}

export const sendEmail = async (props: SendEmailType) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ed6057b9b8cdae",
        pass: "8782a6bbd15117"
      }
    })

    const EmailTemplate = {
      "Verify Email": {
        subject: "Verify Email",
        comp: VerifyEmail
      },
      "Reset Password": {
        subject: "Reset Password",
        comp: ResetPasswordEmail
      },
      "Verify Code": {
        subject: `Your Neptune email verification code is ${props.code.toUpperCase()}`,
        comp: VerifyCode
      },
      "New Email": {
        subject: `Verify New Email`,
        comp: VerifyEmail
      },
    }

    const mailOptions = {
      from: "noreply@neptune.com",
      to: props.email,
      subject: EmailTemplate[props.type].subject,
      html: render(EmailTemplate[props.type].comp(props))
    }

    const mailResponse = await transport.sendMail(mailOptions)

    return mailResponse
  } catch (error) {
    console.log(error);
  }
}