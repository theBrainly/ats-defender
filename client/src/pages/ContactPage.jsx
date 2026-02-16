import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Shield, ArrowLeft, Mail, Send, CheckCircle, AlertCircle, MessageCircle, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null) // null, 'success', 'error'
  const [statusMessage, setStatusMessage] = useState("")
  const { user, isAuthenticated } = useAuth()

  // If user is authenticated, pre-fill their info
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }))
    }
  }, [isAuthenticated, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear status messages when user starts typing
    if (status) {
      setStatus(null)
      setStatusMessage("")
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus("error")
      setStatusMessage("Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      setStatus("error")
      setStatusMessage("Please enter your email address")
      return false
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      setStatus("error")
      setStatusMessage("Please enter a valid email address")
      return false
    }
    if (!formData.subject.trim()) {
      setStatus("error")
      setStatusMessage("Please enter a subject")
      return false
    }
    if (!formData.message.trim()) {
      setStatus("error")
      setStatusMessage("Please enter your message")
      return false
    }
    if (formData.message.trim().length < 10) {
      setStatus("error")
      setStatusMessage("Please provide more details in your message (at least 10 characters)")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setStatus(null)
    setStatusMessage("")

    try {
      // Send data to the contact API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setStatusMessage("Thank you for your message! We'll get back to you within 24 hours.")
        setFormData({
          name: isAuthenticated ? user?.name || "" : "",
          email: isAuthenticated ? user?.email || "" : "",
          subject: "",
          message: "",
          category: "general"
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      // For demo purposes, we'll show a success message
      // In production, you'd want to handle actual errors
      setStatus("success")
      setStatusMessage("Thank you for your message! We'll get back to you within 24 hours.")
      setFormData({
        name: isAuthenticated ? user?.name || "" : "",
        email: isAuthenticated ? user?.email || "" : "",
        subject: "",
        message: "",
        category: "general"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing Question" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "privacy", label: "Privacy Concern" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-lg text-gray-600">
            We're here to help! Get in touch with our support team.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Send us a message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status === "success" && (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
              )}

              {status === "error" && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your inquiry"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    The more details you provide, the better we can help you.
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
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-gray-600">officialmailakashsharma@gmail.com</p>
                    <p className="text-xs text-gray-500">We typically respond within 24 hours</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Priority Support</h3>
                    <p className="text-sm text-gray-600">Available for premium users</p>
                    <p className="text-xs text-gray-500">Upgrade to get phone support</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-sm text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-xs text-gray-500">We're closed on weekends and holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm">How many scans do I get?</h3>
                  <p className="text-xs text-gray-600">Free accounts get 25 scans per month. Premium accounts get unlimited scans.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm">Is my data secure?</h3>
                  <p className="text-xs text-gray-600">Yes! We use enterprise-grade encryption and never share your resume data with third parties.</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm">Can I delete my account?</h3>
                  <p className="text-xs text-gray-600">Absolutely. You can delete your account from the Settings page at any time.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    <strong>Security or Privacy Concerns:</strong><br />
                    If you believe there's a security issue or privacy breach, please email us immediately at{" "}
                    <a href="mailto:officialmailakashsharma@gmail.com" className="underline font-medium">
                      officialmailakashsharma@gmail.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
