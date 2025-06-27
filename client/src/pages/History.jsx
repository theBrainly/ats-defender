import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { History, Calendar, TrendingUp, Eye, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"



export default function HistoryPage() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("[History] Fetching history...");
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:3000/api/history`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        console.log("[History] Fetch success:", data)
        setHistoryItems(data)
      } catch (e) {
        console.error("[History] Fetch error:", e)
        setError(e.message)
      } finally {
        setLoading(false)
        console.log("[History] Fetch loading done.")
      }
    }

    if (isLoggedIn) {
      fetchHistory()
    }
  }, [isLoggedIn])

  const handleView = (id) => {
    console.log(`[History] View action for id: ${id}`)
    navigate(`/analysis/${id}`)
  }

  const handleDelete = async (id) => {
    console.log(`[History] Delete action for id: ${id}`)
    const confirmDelete = window.confirm("Are you sure you want to delete this scan?")
    if (!confirmDelete) {
      console.log("[History] Delete cancelled by user.");
      return
    }

    try {
      const res = await fetch(`/api/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setHistoryItems((prev) => prev.filter((item) => item.id !== id))
      console.log(`[History] Deleted item with id: ${id}`)
    } catch (error) {
      alert("Error deleting item")
      console.error("[History] Error deleting item:", error)
    }
  }

  const getStatusColor = (status) => {
    const color = (() => {
      switch (status) {
        case "excellent":
          return "bg-green-100 text-green-800"
        case "good":
          return "bg-yellow-100 text-yellow-800"
        case "needs-improvement":
          return "bg-red-100 text-red-800"
        default:
          return "bg-gray-100 text-gray-800"
      }
    })();
    console.log(`[History] Status color for '${status}':`, color)
    return color;
  }

  const getStatusText = (status) => {
    const text = (() => {
      switch (status) {
        case "excellent":
          return "Excellent"
        case "good":
          return "Good"
        case "needs-improvement":
          return "Needs Improvement"
        default:
          return "Unknown"
      }
    })();
    console.log(`[History] Status text for '${status}':`, text)
    return text;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center space-x-2">
            <History className="h-8 w-8" />
            <span>Scan History</span>
          </h1>
          <p className="text-muted-foreground">View your previous resume scans and track your improvement over time.</p>
        </div>

        <ProtectedRoute>
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Loading history...</h3>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Error: {error}</h3>
              </CardContent>
            </Card>
          ) : historyItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scan history yet</h3>
                <p className="text-muted-foreground mb-4">Start by scanning your first resume to see results here.</p>
                <Button asChild>
                  <a href="/">Scan Resume</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold">{item.jobTitle}</h3>
                          <Badge
                            className={getStatusColor(item.status)}
                            title={`ATS match status: ${getStatusText(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </span>
                          <span>{item.company}</span>
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
                        <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ProtectedRoute>
      </main>
    </div>
  )
}
