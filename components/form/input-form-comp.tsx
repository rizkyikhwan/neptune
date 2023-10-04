import React from "react"
import { Input, InputProps } from "../ui/input"

interface InputFormCompProps {
    title?: string
    required?: boolean
  }

const InputFormComp = React.forwardRef<HTMLInputElement, InputProps>(({ title, required, ...props}: InputFormCompProps, ref) => {
  return (
    <Input {...props} ref={ref} />
  )
})

export default InputFormComp