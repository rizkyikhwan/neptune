import InputFormCom from "./input-form-comp"
import { FormControl, FormItem, FormLabel, FormMessage, useFormField } from "../ui/form"
import { InputProps } from "../ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps {
  field: any
  title?: string
  required?: boolean
}

const FormInput = ({ field, title, required, ...props }: FormInputProps & InputProps) => {
  const { error } = useFormField()

  return (
    <FormItem className="flex-1">
      <div className="relative flex items-end">
        {title && (
          <FormLabel className={cn(error ? "text-destructive" : "text-zinc-300", "text-xs font-bold tracking-wider uppercase")}>
            {title}
            {required && <span className="ml-0.5 text-xs text-rose-500 align-top">*</span>}
          </FormLabel>
        )}
      <FormMessage className="ml-auto text-xs" />
      </div>
      <FormControl>
        <InputFormCom className="border-0 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-800 text-zinc-300" {...props} {...field} />
      </FormControl>
    </FormItem>
  )
}
export default FormInput