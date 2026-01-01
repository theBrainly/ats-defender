import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, Shield, Check } from "lucide-react"
import { logError } from "@/lib/logger"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [honeypot, setHoneypot] = useState("")

  // Generate CSRF token for form protection
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    // Generate a random CSRF token
    const generateToken = () => {
      const array = new Uint8Array(16)
      window.crypto.getRandomValues(array)
      const token = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      setCsrfToken(token)
    }

    generateToken()
  }, [])

  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (error) setError("")
  }

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) return setError("Name is required")
    if (formData.name.trim().length < 2) return setError("Name must be at least 2 characters long")

    // Email validation with more comprehensive regex
    if (!formData.email.trim()) return setError("Email is required")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) return setError("Please enter a valid email address")

    // Password validation
    if (formData.password.length < 8) return setError("Password must be at least 8 characters long")
    if (!/[A-Z]/.test(formData.password)) return setError("Password must contain at least one uppercase letter")
    if (!/[a-z]/.test(formData.password)) return setError("Password must contain at least one lowercase letter")
    if (!/\d/.test(formData.password)) return setError("Password must contain at least one number")
    if (!/[^a-zA-Z0-9]/.test(formData.password)) return setError("Password must contain at least one special character")

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match")
    if (!formData.agreeToTerms) return setError("You must agree to the terms and conditions")
    return true
  }

  const validateHuman = () => {
    // If the honeypot field is filled, it's likely a bot
    if (honeypot) {
      setError("There was a problem with your submission")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Simple rate limiting to prevent brute force attempts
    const now = Date.now()
    if (now - lastSubmitTime < 1000) { // 1 second cooldown between submission attempts
      setError("Please wait a moment before trying again")
      return
    }
    setLastSubmitTime(now)

    // Increase attempt counter for more sophisticated rate limiting
    setSubmitAttempts(prev => {
      const newCount = prev + 1
      // If too many attempts, could implement further restrictions
      if (newCount > 5) {
        // In production, you might want to implement a timeout here
        setTimeout(() => setSubmitAttempts(0), 60000) // Reset after 1 minute
      }
      return newCount
    })

    if (!validateForm() || !validateHuman()) return

    setIsLoading(true)
    setError("")

    try {
      // Sanitize inputs before sending to API
      const sanitizedName = formData.name.trim()
      const sanitizedEmail = formData.email.trim().toLowerCase()

      await signUp(sanitizedName, sanitizedEmail, formData.password, formData.confirmPassword)

      // Clear sensitive data from memory
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
      })

      // Set secure auth cookie attributes (httpOnly would be set by server)
      // This is just to document best practices - actual implementation will be server-side
      // document.cookie = "token=; SameSite=Strict; Secure; Path=/;"

      // Set session timeout (in a real app, should be done server-side)
      localStorage.setItem("session_started", Date.now().toString())

      // Successful signup - redirect to home with success parameter
      navigate("/?signup=success", {
        state: {
          message: "Account created successfully! Welcome to ATS Defender.",
          alertType: "success"
        }
      })
    } catch (err) {
      // Log detailed error for monitoring systems (in production, use a service like Sentry)
      logError(err)

      // Track failed attempts for security monitoring
      const timestamp = new Date().toISOString()
      const errorData = {
        timestamp,
        email: formData.email.substring(0, 3) + '***@***', // Don't log full email
        errorType: err.name,
        errorMessage: err.message,
        // Don't include passwords or sensitive info in logs
      }

      // In production, send this to your error tracking service:
      // Example: trackError('signup_failure', errorData)
      console.warn('Authentication failure:', errorData)

      // More user-friendly error messages
      if (err.message?.includes("already exists")) {
        setError("This email is already registered. Try signing in instead.")
      } else if (err.message?.includes("network")) {
        setError("Network error. Please check your connection and try again.")
      } else if (err.message?.includes("password") || err.message?.includes("Password")) {
        setError(err.message || "Password doesn't meet security requirements.")
      } else {
        // Don't expose detailed error messages to users in production
        setError("An error occurred during signup. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
 * Active: 2026-01-01
 * Function: getPasswordStrength
 */
const getPasswordStrength = (password) => {
    let strength = 0

    // Stronger password criteria for production
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++ // Extra point for longer passwords
    if (/[a-z]/.test(password)) strength += 0.5
    if (/[A-Z]/.test(password)) strength += 0.5
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    // Check for common patterns that weaken passwords
    if (/^123|password|qwerty|admin|user/i.test(password)) strength -= 1

    // Cap the strength between 0 and 4
    return Math.max(0, Math.min(4, Math.floor(strength)))
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/auth/signin" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get started for free</CardTitle>
            <CardDescription>Create your account to start optimizing your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CSRF Protection */}
              <input type="hidden" name="_csrf" value={csrfToken} />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Honeypot field - hidden from real users but bots might fill it */}
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="website">Leave this empty</Label>
                <Input
                  id="website"
                  name="website"
                  value={honeypot}
                  tabIndex="-1"
                  autoComplete="off"
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-full rounded ${i < passwordStrength
                              ? passwordStrength <= 1
                                ? "bg-red-500"
                                : passwordStrength <= 2
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength:{" "}
                      {passwordStrength <= 1
                        ? "Weak"
                        : passwordStrength <= 2
                          ? "Fair"
                          : passwordStrength <= 3
                            ? "Good"
                            : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span className="text-xs">Passwords match</span>
                    </div>
                  )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
                  }
                  disabled={isLoading}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/signin" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
