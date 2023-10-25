import { db } from "./db"
import { getAuthSession } from "./nextAuth"
import { prismaExclude } from "./utils"

export const currentUser = async () => {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email
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