import { getAuthSession } from "@/lib/nextAuth"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const handleAuth = async () => {
  const session = await getAuthSession()

  if (!session) throw new Error("Unauthorized")
  return { userId: session.user.id }
}

export const ourFileRouter = {
  docUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => { })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter