"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogIn, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check credentials
    if (username === "subhanashraf" && password === "password") {
      toast({
        title: "Login successful!",
        description: "Welcome to DarkStore Dashboard.",
      })

      // Store login state
      localStorage.setItem("darkstore-auth", "true")

      // Redirect to dashboard
      router.push("/dashboard")
    } else {
      setError("Invalid username or password. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>
            <strong>Username:</strong> subhanashraf
          </p>
          <p>
            <strong>Password:</strong> password
          </p>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter your username"
              className="transition-all focus:scale-105"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="transition-all focus:scale-105"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full hover:scale-105 transition-transform">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
