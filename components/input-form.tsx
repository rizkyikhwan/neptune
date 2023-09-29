import React from "react"
import { Input, InputProps } from "./ui/input"

interface InputFormProps {
    title?: string
    required?: boolean
  }

const InputForm = React.forwardRef<HTMLInputElement, InputProps>(({ title, required, ...props}: InputFormProps, ref) => {
  return (
    <div className="relative space-y-1">
      {title && (
        <p className="text-xs font-bold tracking-wider uppercase text-zinc-300">
          {title}
          {required && <span className="ml-0.5 text-xs text-rose-500 align-top">*</span>}
        </p>
      )}
      <Input {...props} ref={ref} />
    </div>
  )
})

export default InputForm