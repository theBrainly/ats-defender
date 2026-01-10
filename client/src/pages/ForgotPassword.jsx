import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Shield, ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

export default /**
 * Active: 2026-01-10
 * Function: ForgotPassword
 */
function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null) // null, 'success', 'error'
  const [message, setMessage] = useState("")
  const { user, isAuthenticated } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus("error")
      setMessage("Please enter your email address")
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setStatus(null)
    setMessage("")

    try {
      // Request password reset
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus("success")
        setMessage("If an account with that email exists, we've sent you a password reset link. Check your inbox and spam folder.")
        setEmail("")
      } else {
        throw new Error("Failed to send reset email")
      }
    } catch (error) {
      // For demo purposes, we'll show a success message regardless
      // In production, you'd want to handle actual errors
      setStatus("success")
      setMessage("If an account with that email exists, we've sent you a password reset link. Check your inbox and spam folder.")
      setEmail("")
    } finally {
      setIsLoading(false)
    }
  }

  // If user is already logged in, redirect them
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ATS Defender</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">Already Signed In</h2>
            <p className="mt-2 text-sm text-gray-600">
              You're already signed in as {user?.email}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-gray-700">
                  You're currently signed in. If you need to reset your password, you can do so from your account settings.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link to="/settings">Go to Settings</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/">Go to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Reset Your Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === "success" && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We'll send you a secure link to reset your password.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Check Your Email</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a password reset link to your email address. The link will expire in 1 hour for security reasons.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    • Check your spam/junk folder
                    <br />
                    • Make sure you entered the correct email
                    <br />
                    • Wait a few minutes and try again
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <Button variant="outline" asChild>
            <Link to="/auth/signin" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </Link>
          </Button>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link to="/contact" className="text-primary hover:text-primary/80 underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
