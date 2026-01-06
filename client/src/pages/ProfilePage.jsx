"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/Navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { getToken } from "@/lib/token"
import {
  User,
  Mail,
  Calendar,
  Loader2,
  Camera,
  Upload,
  X,
  Save,
  Edit,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth()
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    currentRole: "",
    company: "",
    experience: "",
    skills: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    education: "",
    certifications: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        currentRole: user.profile?.currentRole || "",
        company: user.profile?.company || "",
        experience: user.profile?.experience?.toString() || "",
        skills: user.profile?.skills?.join(", ") || "",
        location: user.profile?.location || "",
        bio: user.profile?.bio || "",
        website: user.profile?.website || "",
        github: user.profile?.github || "",
        linkedin: user.profile?.linkedin || "",
        twitter: user.profile?.twitter || "",
        education: user.profile?.education || "",
        certifications: user.profile?.certifications?.join(", ") || "",
      })
      setImagePreview(user.profile?.avatar || null)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage("Image size should be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file")
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!selectedFile) return null

    const formData = new FormData()
    formData.append("avatar", selectedFile)

    try {
      const token = getToken()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload image")
      }

      return data.avatarUrl
    } catch (error) {
      console.error("Image upload error:", error)
      throw error
    }
  }

  /**
 * Active: 2026-01-06
 * Function: handleSubmit
 */
const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      let avatarUrl = imagePreview

      // Upload image if a new one was selected
      if (selectedFile) {
        avatarUrl = await handleImageUpload()
      }

      const token = getToken()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          profile: {
            phone: profileData.phone,
            currentRole: profileData.currentRole,
            company: profileData.company,
            experience: profileData.experience ? Number.parseInt(profileData.experience) : undefined,
            skills: profileData.skills ? profileData.skills.split(",").map((s) => s.trim()) : [],
            location: profileData.location,
            bio: profileData.bio,
            website: profileData.website,
            github: profileData.github,
            linkedin: profileData.linkedin,
            twitter: profileData.twitter,
            education: profileData.education,
            certifications: profileData.certifications
              ? profileData.certifications.split(",").map((s) => s.trim())
              : [],
            avatar: avatarUrl,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      updateUser(data.user)
      await refreshUser() // Refresh user data to ensure navbar shows the updated avatar
      setSelectedFile(null)
      setIsEditing(false)
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage(error.message || "Failed to update profile")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedFile(null)
    setImagePreview(user?.profile?.avatar || null)
    // Reset form data
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        currentRole: user.profile?.currentRole || "",
        company: user.profile?.company || "",
        experience: user.profile?.experience?.toString() || "",
        skills: user.profile?.skills?.join(", ") || "",
        location: user.profile?.location || "",
        bio: user.profile?.bio || "",
        website: user.profile?.website || "",
        github: user.profile?.github || "",
        linkedin: user.profile?.linkedin || "",
        twitter: user.profile?.twitter || "",
        education: user.profile?.education || "",
        certifications: user.profile?.certifications?.join(", ") || "",
      })
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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <Alert
                className={message.includes("success") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
              >
                <AlertDescription className={message.includes("success") ? "text-green-800" : "text-red-800"}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={imagePreview || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="text-lg">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Change Photo</span>
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Account Info */}
                  <div className="space-y-4">
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
                    {profileData.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                    )}
                    {profileData.currentRole && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profileData.currentRole}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Subscription Info */}
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
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            disabled={true}
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px]"
                          disabled={!isEditing}
                        />
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Update your career and professional details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentRole">Current Role</Label>
                          <Input
                            id="currentRole"
                            name="currentRole"
                            value={profileData.currentRole}
                            onChange={handleChange}
                            placeholder="e.g., Software Engineer"
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            value={profileData.company}
                            onChange={handleChange}
                            placeholder="e.g., Google"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            name="education"
                            value={profileData.education}
                            onChange={handleChange}
                            placeholder="e.g., BS Computer Science"
                            disabled={!isEditing}
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
                          disabled={!isEditing}
                        />
                        <p className="text-xs text-muted-foreground">Separate skills with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                          id="certifications"
                          name="certifications"
                          value={profileData.certifications}
                          onChange={handleChange}
                          placeholder="Enter your certifications separated by commas"
                          disabled={!isEditing}
                        />
                        <p className="text-xs text-muted-foreground">Separate certifications with commas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Add your professional and social media profiles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Website</span>
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          value={profileData.website}
                          onChange={handleChange}
                          placeholder="https://yourwebsite.com"
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center space-x-2">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={profileData.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/username"
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center space-x-2">
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </Label>
                        <Input
                          id="github"
                          name="github"
                          value={profileData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center space-x-2">
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          value={profileData.twitter}
                          onChange={handleChange}
                          placeholder="https://twitter.com/username"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
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
