import { UploadDropzone } from "@/lib/uploadthing"
import axios from "axios"
import { File, Trash, X } from "lucide-react"
import { Dispatch, useState } from "react"

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string
  endpoint: "docUploader"
  setIsUpload: Dispatch<React.SetStateAction<boolean>>
}

const FileUpload = ({ value, endpoint, onChange, setIsUpload }: FileUploadProps) => {
  const fileType = value?.split(".").pop()
  const [file, setFile] = useState("")

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <File className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
          {value}
        </a>
        <button
          onClick={async () => {
            onChange("")

            await axios.delete("/api/uploadthing", {
              data: {
                url: file
              }
            })
          }}
          className="absolute p-1 text-white rounded shadow-sm -top-2 -right-2 bg-rose-500"
          type="button"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      appearance={{
        container: "border-dashed border-2 border-indigo-500 py-3",
        uploadIcon: "text-indigo-500",
        button: "px-3 bg-indigo-500 rounded-md"
      }}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)

        setFile(res?.[0].key)
        setIsUpload(false)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}
export default FileUpload