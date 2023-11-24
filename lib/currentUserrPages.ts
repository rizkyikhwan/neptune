import { getServerSession } from "next-auth"
import { db } from "./db"
import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "./nextAuth"

export const currentUserPages = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user.id) {
      return null
    }

    const currentUser = await db.user.findUnique({
      where: {
        id: session.user.id
      }
    })

    if (!currentUser) {
      return null
    }

    return currentUser
  } catch (error) {
    console.log(error)
  }
}