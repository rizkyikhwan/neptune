import { db } from "./db"
import { getAuthSession } from "./nextAuth"

export const currentUser = async () => {
  try {
    const session = await getAuthSession()

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