"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/Navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "react-router-dom"
import {
    Settings,
    Shield,
    Bell,
    Eye,
    Trash2,
    Download,
    Upload,
    AlertTriangle,
    CheckCircle,
    Info,
    Loader2,
    Save,
} from "lucide-react"
import { logError } from "@/lib/logger"
import { getToken } from "@/lib/token"

export default function SettingsPage() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("info")
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    // Settings state
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            analysisComplete: true,
            weeklyReport: false,
            securityAlerts: true,
        },
        privacy: {
            profileVisible: false,
            shareAnalytics: true,
            dataRetention: "1year",
        },
        preferences: {
            theme: "light",
            language: "en",
            timezone: "UTC",
            autoSave: true,
        },
        account: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const showMessage = (msg, type = "info") => {
        setMessage(msg)
        setMessageType(type)
        setTimeout(() => setMessage(""), 5000)
    }

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (settings.account.newPassword !== settings.account.confirmPassword) {
            showMessage("New passwords do not match", "error")
            return
        }
        if (settings.account.newPassword.length < 6) {
            showMessage("New password must be at least 6 characters long", "error")
            return
        }

        setIsLoading(true)
        try {
            const token = getToken()
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: settings.account.currentPassword,
                    newPassword: settings.account.newPassword,
                }),
            })

            if (response.ok) {
                showMessage("Password updated successfully", "success")
                setSettings(prev => ({
                    ...prev,
                    account: {
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }
                }))
            } else {
                const data = await response.json()
                showMessage(data.message || "Failed to update password", "error")
            }
        } catch (err) {
            logError("Password change error:", err)
            showMessage("An error occurred while updating password", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleExportData = async () => {
        setIsLoading(true)
        try {
            const token = getToken()
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/export-data`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `ats-defender-data-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
                showMessage("Data exported successfully", "success")
            } else {
                const errorData = await response.json().catch(() => ({}))
                logError("Export failed:", errorData);
                showMessage(errorData.message || "Failed to export data", "error")
            }
        } catch (err) {
            logError("Data export error:", err)
            showMessage("An error occurred while exporting data", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            const token = getToken()
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/delete-account`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                await signOut()
                navigate("/")
                showMessage("Account deleted successfully", "success")
            } else {
                const data = await response.json()
                showMessage(data.message || "Failed to delete account", "error")
            }
        } catch (err) {
            logError("Account deletion error:", err)
            showMessage("An error occurred while deleting account", "error")
        } finally {
            setIsLoading(false)
            setShowDeleteConfirmation(false)
        }
    }

    const handleSaveSettings = async () => {
        setIsLoading(true)
        try {
            const token = getToken()
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/auth/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    notifications: settings.notifications,
                    privacy: settings.privacy,
                    preferences: settings.preferences,
                }),
            })

            if (response.ok) {
                showMessage("Settings saved successfully", "success")
            } else {
                const data = await response.json()
                showMessage(data.message || "Failed to save settings", "error")
            }
        } catch (err) {
            logError("Settings save error:", err)
            showMessage("An error occurred while saving settings", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="h-8 w-8" />
                        <h1 className="text-3xl font-bold">Settings</h1>
                    </div>

                    {message && (
                        <Alert className={`${messageType === "error" ? "border-red-500 bg-red-50" : messageType === "success" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"}`}>
                            <div className="flex items-center gap-2">
                                {messageType === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                                {messageType === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                {messageType === "info" && <Info className="h-4 w-4 text-blue-500" />}
                                <AlertDescription className={`${messageType === "error" ? "text-red-700" : messageType === "success" ? "text-green-700" : "text-blue-700"}`}>
                                    {message}
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    {/* Notifications Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>
                                Manage how you receive notifications and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="email-notifications"
                                        checked={settings.notifications.email}
                                        onCheckedChange={(checked) => handleSettingChange("notifications", "email", checked)}
                                    />
                                    <Label htmlFor="email-notifications">Email notifications</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="push-notifications"
                                        checked={settings.notifications.push}
                                        onCheckedChange={(checked) => handleSettingChange("notifications", "push", checked)}
                                    />
                                    <Label htmlFor="push-notifications">Push notifications</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="analysis-complete"
                                        checked={settings.notifications.analysisComplete}
                                        onCheckedChange={(checked) => handleSettingChange("notifications", "analysisComplete", checked)}
                                    />
                                    <Label htmlFor="analysis-complete">Analysis completion alerts</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="weekly-report"
                                        checked={settings.notifications.weeklyReport}
                                        onCheckedChange={(checked) => handleSettingChange("notifications", "weeklyReport", checked)}
                                    />
                                    <Label htmlFor="weekly-report">Weekly progress reports</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="security-alerts"
                                        checked={settings.notifications.securityAlerts}
                                        onCheckedChange={(checked) => handleSettingChange("notifications", "securityAlerts", checked)}
                                    />
                                    <Label htmlFor="security-alerts">Security alerts</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy & Data
                            </CardTitle>
                            <CardDescription>
                                Control your privacy and data sharing preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="profile-visible"
                                        checked={settings.privacy.profileVisible}
                                        onCheckedChange={(checked) => handleSettingChange("privacy", "profileVisible", checked)}
                                    />
                                    <Label htmlFor="profile-visible">Make profile visible to other users</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="share-analytics"
                                        checked={settings.privacy.shareAnalytics}
                                        onCheckedChange={(checked) => handleSettingChange("privacy", "shareAnalytics", checked)}
                                    />
                                    <Label htmlFor="share-analytics">Share anonymous analytics to improve service</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Account Security
                            </CardTitle>
                            <CardDescription>
                                Update your password and security settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={settings.account.currentPassword}
                                        onChange={(e) => handleSettingChange("account", "currentPassword", e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={settings.account.newPassword}
                                        onChange={(e) => handleSettingChange("account", "newPassword", e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={settings.account.confirmPassword}
                                        onChange={(e) => handleSettingChange("account", "confirmPassword", e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !settings.account.currentPassword || !settings.account.newPassword}
                                    className="w-full"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Update Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Data Management
                            </CardTitle>
                            <CardDescription>
                                Export or delete your data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={handleExportData}
                                    disabled={isLoading}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export My Data
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <div className="flex items-start gap-2 p-4 bg-red-50 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-red-800">Danger Zone</h4>
                                        <p className="text-sm text-red-700 mt-1">
                                            Once you delete your account, there is no going back. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                                {!showDeleteConfirmation ? (
                                    <Button
                                        onClick={() => setShowDeleteConfirmation(true)}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Are you sure you want to delete your account? This action cannot be undone.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleDeleteAccount}
                                                disabled={isLoading}
                                                variant="destructive"
                                                className="flex-1"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : null}
                                                Yes, Delete My Account
                                            </Button>
                                            <Button
                                                onClick={() => setShowDeleteConfirmation(false)}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Settings */}
                    <Card>
                        <CardContent className="pt-6">
                            <Button
                                onClick={handleSaveSettings}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Save All Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    )
}
