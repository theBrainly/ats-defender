"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  History,
  Calendar,
  TrendingUp,
  Eye,
  Trash2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { logError } from "@/lib/logger"
import { getToken, removeToken } from "@/lib/token"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

export default function HistoryPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Memoize the fetchHistory function to prevent unnecessary re-renders
  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(
        `${API_BASE_URL}/analysis/history?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Adding a cache control directive
          cache: "no-store"
        },
      )

      if (response.status === 401) {
        // Handle expired token
        toast.error("Your session has expired. Please log in again.")
        removeToken()
        navigate("/signin")
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setHistoryItems(data.history || [])
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
          page: data.pagination?.page || prev.page,
        }))
      } else {
        throw new Error(data.message || "Failed to fetch history")
      }

      // Track page view analytics
      try {
      } catch (analyticsError) {
        logError("[Analytics] Error:", analyticsError)
      }
    } catch (e) {
      logError("[History] Fetch error:", e)
      setError(e.message)
      toast.error(`Failed to load history: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, navigate, user?.id])

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory()
    }
  }, [isAuthenticated, fetchHistory])

  const openDeleteDialog = (item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)

    try {
      const token = getToken()
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${API_BASE_URL}/analysis/${itemToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        toast.error("Your session has expired. Please log in again.")
        removeToken()
        navigate("/signin")
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setHistoryItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
        toast.success("Scan record deleted successfully")
        // Refresh history if current page becomes empty
        if (historyItems.length === 1 && pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
        } else if (historyItems.length === 1) {
          // If it's the last item on the first page
          fetchHistory()
        }

        // Track deletion analytics
        try {
        } catch (analyticsError) {
          logError("[Analytics] Error:", analyticsError)
        }
      } else {
        throw new Error(data.message || "Failed to delete")
      }
    } catch (error) {
      toast.error(`Error deleting scan: ${error.message}`)
      logError("[History] Error deleting item:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleView = (id) => {
    navigate(`/analysis/${id}`)

    // Track view analytics
    try {
    } catch (analyticsError) {
      logError("[Analytics] Error:", analyticsError)
    }
  }

  const getStatusColor = (status) => {
    const colorMap = {
      excellent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      good: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "needs-improvement": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }

  /**
 * Active: 2026-01-09
 * Function: getStatusText
 */
const getStatusText = (status) => {
    const textMap = {
      excellent: "Excellent",
      good: "Good",
      "needs-improvement": "Needs Improvement",
    }
    return textMap[status] || "Unknown"
  }

  const handlePageChange = (newPage) => {
    // Ensure the page is within valid bounds
    if (newPage < 1 || newPage > pagination.pages) return

    setPagination((prev) => ({ ...prev, page: newPage }))

    // Scroll to top when changing pages for better UX
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    return (
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(1)}
          disabled={pagination.page <= 1}
          aria-label="First page"
        >
          <ChevronLeft className="h-4 w-4" />
          <ChevronLeft className="h-4 w-4 -ml-2" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.pages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.pages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(pagination.pages)}
          disabled={pagination.page >= pagination.pages}
          aria-label="Last page"
        >
          <ChevronRight className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 -ml-2" />
        </Button>
      </div>
    )
  }

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-2">
              <History className="h-8 w-8" />
              <span>Scan History</span>
            </h1>
            <p className="text-muted-foreground">
              View your previous resume scans and track your improvement over time.
            </p>
          </div>

          {loading ? (
            renderSkeleton()
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button
                  onClick={fetchHistory}
                  variant="outline"
                  size="sm"
                  className="mt-2 ml-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          ) : historyItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scan history yet</h3>
                <p className="text-muted-foreground mb-4">Start by scanning your first resume to see results here.</p>
                <Button onClick={() => navigate("/")}>Scan Resume</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <Card key={item.id} className="transition-shadow hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{item.jobTitle}</h3>
                            <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                          </div>
                          <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(item.date).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </span>
                            {item.company && <span>{item.company}</span>}
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{item.score}% ATS Score</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(item.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(item)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Improved Pagination */}
              {renderPagination()}
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the scan record for "{itemToDelete?.jobTitle}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  )
}
