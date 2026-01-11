import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
