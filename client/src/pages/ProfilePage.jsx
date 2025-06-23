"use client"

import  React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { User, Mail, Calendar, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    currentRole: "",
    experience: "",
    skills: "",
    location: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        currentRole: user.profile?.currentRole || "",
        experience: user.profile?.experience?.toString() || "",
        skills: user.profile?.skills?.join(", ") || "",
        location: user.profile?.location || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${"http://localhost:3000/api/auth/profile"}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          profile: {
            currentRole: profileData.currentRole,
            experience: profileData.experience ? Number.parseInt(profileData.experience) : undefined,
            skills: profileData.skills ? profileData.skills.split(",").map((s) => s.trim()) : [],
            location: profileData.location,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      updateUser(data.user)
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const getSubscriptionBadgeColor = (type) => {
    switch (type) {
      case "premium":
        return "bg-yellow-100 text-yellow-800"
      case "enterprise":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Account Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Subscription</span>
                      <Badge className={getSubscriptionBadgeColor(user?.subscription?.type || "free")}>
                        {user?.subscription?.type?.charAt(0).toUpperCase() + user?.subscription?.type?.slice(1) ||
                          "Free"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Scans used</span>
                      <span className="text-sm">
                        {user?.subscription?.scansUsed || 0} / {user?.subscription?.scansLimit || 5}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and professional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {message && (
                        <Alert>
                          <AlertDescription>{message}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentRole">Current Role</Label>
                          <Input
                            id="currentRole"
                            name="currentRole"
                            value={profileData.currentRole}
                            onChange={handleChange}
                            placeholder="e.g., Software Engineer"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            name="experience"
                            type="number"
                            min="0"
                            max="50"
                            value={profileData.experience}
                            onChange={handleChange}
                            placeholder="e.g., 5"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location}
                            onChange={handleChange}
                            placeholder="e.g., San Francisco, CA"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills</Label>
                        <Textarea
                          id="skills"
                          name="skills"
                          value={profileData.skills}
                          onChange={handleChange}
                          placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js)"
                          className="min-h-[100px]"
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">Separate skills with commas</p>
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
