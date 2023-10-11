import nodemailer from "nodemailer";
import { EmailType } from "./type";

interface SendEmailType {
  email: string,
  token: string | null,
  type: EmailType
}

export const sendEmail = async ({ email, token, type }: SendEmailType) => {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ab91858c2a722d",
        pass: "673e30d43a5599"
      }
    })

    const mailOptions = {
      from: "test@email.com",
      to: email,
      subject: type === "Verify Email" ? "Verify your email" : type === "Reset Password" ? "Reset your password" : "No reply",
      html: type === "Verify Email" ? `<p>Click this link http://localhost:3000/verification/${token} to verify your email` : type === "Reset Password" ? `<p>Follow the link . http://localhost:3000/reset-password/${token} to reset the password for your user before 30 minutes` : "No reply"
    }

    const mailResponse = await transport.sendMail(mailOptions)

    return mailResponse
  } catch (error) {
    console.log(error);
  }
}