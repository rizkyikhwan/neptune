import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface CardFormProps {
  title?: string,
  description?: string,
  children: React.ReactNode
}

const CardForm = ({ title, description, children }: CardFormProps) => {
  return (
    <Card className="w-full border-0 rounded-none sm:rounded-md sm:max-w-lg bg-[#313338] text-secondary z-10 min-h-screen sm:min-h-min shadow-none sm:shadow-md">
      {title && (
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-wide text-zinc-200">{title}</CardTitle>
          {description && (
            <CardDescription className="text-zinc-400">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
export default CardForm