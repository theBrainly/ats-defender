"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Calendar, TrendingUp, Eye, Trash2, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"

export default function HistoryPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory()
    }
  }, [isAuthenticated, pagination.page])

  const fetchHistory = async () => {
    console.log("[History] Fetching history...")
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/api/analysis/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[History] Fetch success:", data)

      if (data.success) {
        setHistoryItems(data.history || [])
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }))
      } else {
        throw new Error(data.message || "Failed to fetch history")
      }
    } catch (e) {
      console.error("[History] Fetch error:", e)
      setError(e.message)
    } finally {
      setLoading(false)
      console.log("[History] Fetch loading done.")
    }
  }

  const handleView = (id) => {
    console.log(`[History] View action for id: ${id}`)
    navigate(`/analysis/${id}`)
  }

  const handleDelete = async (id) => {
    console.log(`[History] Delete action for id: ${id}`)
    const confirmDelete = window.confirm("Are you sure you want to delete this scan?")
    if (!confirmDelete) {
      console.log("[History] Delete cancelled by user.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/api/analysis/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete")
      }

      const data = await response.json()
      if (data.success) {
        setHistoryItems((prev) => prev.filter((item) => item.id !== id))
        console.log(`[History] Deleted item with id: ${id}`)

        // Refresh history if current page becomes empty
        if (historyItems.length === 1 && pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
        } else {
          fetchHistory()
        }
      } else {
        throw new Error(data.message || "Failed to delete")
      }
    } catch (error) {
      alert("Error deleting item: " + error.message)
      console.error("[History] Error deleting item:", error)
    }
  }

  const getStatusColor = (status) => {
    const colorMap = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-yellow-100 text-yellow-800",
      "needs-improvement": "bg-red-100 text-red-800",
    }
    return colorMap[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status) => {
    const textMap = {
      excellent: "Excellent",
      good: "Good",
      "needs-improvement": "Needs Improvement",
    }
    return textMap[status] || "Unknown"
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

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
            <Card>
              <CardContent className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Loading history...</h3>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Error: {error}</h3>
                <Button onClick={fetchHistory} className="mt-4">
                  Try Again
                </Button>
              </CardContent>
            </Card>
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
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold">{item.jobTitle}</h3>
                            <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
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
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{item.score}% ATS Score</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(item.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
