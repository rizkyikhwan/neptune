import InputFormCom from "./input-form-comp"
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "../ui/form"
import { InputProps } from "../ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps {
  field: any
  title?: string
  required?: boolean
  className?: string
}

const FormInput = ({ field, title, required, className, ...props }: FormInputProps & InputProps) => {
  const { error } = useFormField()

  return (
    <FormItem className="flex-1 space-y-1">
      {title && (
        <FormLabel className={cn(error ? "text-red-500" : "text-zinc-300", "text-xs font-bold tracking-wider uppercase")}>
          {title}
          {required && <span className="ml-0.5 text-xs text-rose-500 align-top">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <InputFormCom 
          className={cn(
            "border-0 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-800 text-zinc-300", 
            className
          )} 
          {...props} 
          {...field} 
        />
      </FormControl>
      <FormMessage className="ml-auto text-xs" />
    </FormItem>
  )
}
export default FormInput