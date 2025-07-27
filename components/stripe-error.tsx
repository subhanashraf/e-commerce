"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface StripeErrorProps {
  error: string
  onRetry?: () => void
}

export function StripeError({ error, onRetry }: StripeErrorProps) {
  const isConfigError = error.includes("not configured") || error.includes("STRIPE_SECRET_KEY")

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        {isConfigError && (
          <div className="text-sm">
            <p>To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>
                Go to{" "}
                <a
                  href="https://dashboard.stripe.com/test/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Stripe Dashboard
                </a>
              </li>
              <li>Copy your Secret key</li>
              <li>Add it to your .env.local file as STRIPE_SECRET_KEY</li>
              <li>Restart your development server</li>
            </ol>
          </div>
        )}
        {onRetry && !isConfigError && (
          <Button onClick={onRetry} size="sm" variant="outline">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
