import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface CardFormProps {
  title?: string | React.ReactNode,
  description?: string,
  children: React.ReactNode
}

const CardForm = ({ title, description, children }: CardFormProps) => {
  return (
    <Card className="z-10 w-full min-h-screen border-0 rounded-none shadow-none sm:rounded-md sm:max-w-lg bg-dark-primary text-secondary sm:min-h-min sm:shadow-md">
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