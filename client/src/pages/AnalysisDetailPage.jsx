"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Share,
  FileText,
  Copy,
  Mail,
  Printer,
  ChevronDown,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { getToken } from "@/lib/token"

export default /**
 * Active: 2026-01-13
 * Function: AnalysisDetailPage
 */
function AnalysisDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareAlert, setShareAlert] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchAnalysisDetail()
    }
  }, [isAuthenticated, id])

  const fetchAnalysisDetail = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = getToken()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/analysis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Analysis not found")
        } else if (response.status === 403) {
          throw new Error("You don't have permission to view this analysis")
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        throw new Error(data.message || "Failed to fetch analysis")
      }
    } catch (e) {
      console.error("Error fetching analysis detail:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Share functionality
  const handleCopyLink = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setShareAlert({ type: "success", message: "Link copied to clipboard!" })
      setTimeout(() => setShareAlert(null), 3000)
    } catch (err) {
      console.error("Error copying link:", err)
      setShareAlert({ type: "error", message: "Failed to copy link" })
      setTimeout(() => setShareAlert(null), 3000)
    }
  }

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`ATS Analysis Results - ${analysis.jobDetails.title}`)
    const body = encodeURIComponent(`
Hi,

I wanted to share my ATS analysis results with you:

Job Title: ${analysis.jobDetails.title}
${analysis.jobDetails.company ? `Company: ${analysis.jobDetails.company}` : ""}
ATS Score: ${analysis.results.overallScore}%
Analysis Date: ${new Date(analysis.createdAt).toLocaleDateString()}

View full analysis: ${window.location.href}

Best regards
    `)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handlePrint = () => {
    window.print()
  }

  // Export functionality
  const exportAsJSON = () => {
    const exportData = {
      analysisId: analysis.id,
      jobDetails: analysis.jobDetails,
      results: analysis.results,
      metadata: analysis.metadata,
      createdAt: analysis.createdAt,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ats-analysis-${analysis.jobDetails.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const csvData = [
      ["Field", "Value"],
      ["Job Title", analysis.jobDetails.title],
      ["Company", analysis.jobDetails.company || "N/A"],
      ["Location", analysis.jobDetails.location || "N/A"],
      ["Analysis Date", new Date(analysis.createdAt).toLocaleDateString()],
      ["Overall Score", `${analysis.results.overallScore}%`],
      ["Skills Score", `${analysis.results.sectionAnalysis?.skills?.score || 0}%`],
      ["Experience Score", `${analysis.results.sectionAnalysis?.experience?.score || 0}%`],
      ["Education Score", `${analysis.results.sectionAnalysis?.education?.score || 0}%`],
      ["Formatting Score", `${analysis.results.sectionAnalysis?.formatting?.score || 0}%`],
      ["Matched Keywords", (analysis.results.keywordAnalysis?.matched || []).join("; ")],
      ["Missing Keywords", (analysis.results.keywordAnalysis?.missing || []).join("; ")],
      [
        "Suggestions",
        (analysis.results.suggestions || [])
          .map((s) => (typeof s === "string" ? s : s.text || s.description))
          .join("; "),
      ],
      ["Strengths", (analysis.results.strengths || []).join("; ")],
      ["Weaknesses", (analysis.results.weaknesses || []).join("; ")],
    ]

    const csvContent = csvData
      .map((row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ats-analysis-${analysis.jobDetails.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportAsPDF = async () => {
    setExportLoading(true)
    try {
      // Create a clean version of the page for PDF
      const printContent = document.createElement("div")
      printContent.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">ATS Analysis Report</h1>
            <h2 style="color: #4b5563; margin-bottom: 5px;">${analysis.jobDetails.title}</h2>
            ${analysis.jobDetails.company ? `<p style="color: #6b7280; margin: 5px 0;">${analysis.jobDetails.company}</p>` : ""}
            ${analysis.jobDetails.location ? `<p style="color: #6b7280; margin: 5px 0;">${analysis.jobDetails.location}</p>` : ""}
            <p style="color: #6b7280; margin: 5px 0;">Analysis Date: ${new Date(analysis.createdAt).toLocaleDateString()}</p>
          </div>

          <div style="margin-bottom: 30px; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 15px;">Overall ATS Score</h3>
            <div style="font-size: 48px; font-weight: bold; color: ${analysis.results.overallScore >= 80 ? "#059669" : analysis.results.overallScore >= 60 ? "#d97706" : "#dc2626"}; margin-bottom: 10px;">
              ${analysis.results.overallScore}%
            </div>
            <div style="background-color: #f3f4f6; height: 20px; border-radius: 10px; overflow: hidden; margin: 0 auto; width: 300px;">
              <div style="background-color: ${analysis.results.overallScore >= 80 ? "#10b981" : analysis.results.overallScore >= 60 ? "#f59e0b" : "#ef4444"}; height: 100%; width: ${analysis.results.overallScore}%; border-radius: 10px;"></div>
            </div>
          </div>

          ${
            analysis.results.sectionAnalysis
              ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Section Scores</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              ${Object.entries(analysis.results.sectionAnalysis)
                .map(
                  ([section, data]) => `
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
                  <h4 style="color: #374151; margin-bottom: 10px; text-transform: capitalize;">${section}</h4>
                  <div style="font-size: 24px; font-weight: bold; color: ${data.score >= 80 ? "#059669" : data.score >= 60 ? "#d97706" : "#dc2626"}; margin-bottom: 8px;">
                    ${data.score}%
                  </div>
                  ${data.feedback ? `<p style="color: #6b7280; font-size: 14px; margin: 0;">${data.feedback}</p>` : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }

          ${
            analysis.results.keywordAnalysis
              ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Keywords Analysis</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div>
                <h4 style="color: #059669; margin-bottom: 10px;">✓ Matched Keywords (${analysis.results.keywordAnalysis.matched?.length || 0})</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                  ${(analysis.results.keywordAnalysis.matched || [])
                    .map(
                      (keyword) =>
                        `<span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${keyword}</span>`,
                    )
                    .join("")}
                </div>
              </div>
              <div>
                <h4 style="color: #dc2626; margin-bottom: 10px;">✗ Missing Keywords (${analysis.results.keywordAnalysis.missing?.length || 0})</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                  ${(analysis.results.keywordAnalysis.missing || [])
                    .map(
                      (keyword) =>
                        `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${keyword}</span>`,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          ${
            analysis.results.suggestions && analysis.results.suggestions.length > 0
              ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Improvement Suggestions</h3>
            <ul style="list-style: none; padding: 0;">
              ${analysis.results.suggestions
                .map(
                  (suggestion) => `
                <li style="margin-bottom: 10px; padding-left: 20px; position: relative;">
                  <span style="position: absolute; left: 0; top: 8px; width: 6px; height: 6px; background-color: #3b82f6; border-radius: 50%;"></span>
                  ${typeof suggestion === "string" ? suggestion : suggestion.text || suggestion.description}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
            ${
              analysis.results.strengths && analysis.results.strengths.length > 0
                ? `
            <div>
              <h3 style="color: #059669; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">✓ Strengths</h3>
              <ul style="list-style: none; padding: 0;">
                ${analysis.results.strengths
                  .map(
                    (strength) => `
                  <li style="margin-bottom: 8px; padding-left: 15px; position: relative; color: #374151;">
                    <span style="position: absolute; left: 0; top: 6px; width: 4px; height: 4px; background-color: #10b981; border-radius: 50%;"></span>
                    ${strength}
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
            `
                : ""
            }

            ${
              analysis.results.weaknesses && analysis.results.weaknesses.length > 0
                ? `
            <div>
              <h3 style="color: #dc2626; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">⚠ Areas for Improvement</h3>
              <ul style="list-style: none; padding: 0;">
                ${analysis.results.weaknesses
                  .map(
                    (weakness) => `
                  <li style="margin-bottom: 8px; padding-left: 15px; position: relative; color: #374151;">
                    <span style="position: absolute; left: 0; top: 6px; width: 4px; height: 4px; background-color: #ef4444; border-radius: 50%;"></span>
                    ${weakness}
                  </li>
                `,
                  )
                  .join("")}
              </ul>
            </div>
            `
                : ""
            }
          </div>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p>Generated by ATS Defender • ${new Date().toLocaleDateString()}</p>
            ${analysis.metadata?.processingTime ? `<p>Processing Time: ${analysis.metadata.processingTime}ms</p>` : ""}
          </div>
        </div>
      `

      // Open print dialog with the formatted content
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ATS Analysis - ${analysis.jobDetails.title}</title>
            <style>
              @media print {
                body { margin: 0; }
                @page { margin: 1in; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    } catch (error) {
      console.error("Error generating PDF:", error)
      setShareAlert({ type: "error", message: "Failed to generate PDF" })
      setTimeout(() => setShareAlert(null), 3000)
    } finally {
      setExportLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusBadge = (score) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Loading analysis...</h3>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="max-w-md w-full">
                <CardContent className="text-center py-12">
                  <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <div className="space-x-2">
                    <Button onClick={() => navigate("/history")} variant="outline">
                      Back to History
                    </Button>
                    <Button onClick={fetchAnalysisDetail}>Try Again</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!analysis) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Analysis not found</h3>
              <Button onClick={() => navigate("/history")}>Back to History</Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Share Alert */}
          {shareAlert && (
            <Alert
              className={`mb-4 ${shareAlert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <AlertDescription className={shareAlert.type === "success" ? "text-green-800" : "text-red-800"}>
                {shareAlert.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/history")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to History</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{analysis.jobDetails.title}</h1>
                <div className="flex items-center space-x-4 text-muted-foreground mt-2">
                  {analysis.jobDetails.company && (
                    <span className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{analysis.jobDetails.company}</span>
                    </span>
                  )}
                  {analysis.jobDetails.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{analysis.jobDetails.location}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(analysis.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Share Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShareEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={exportLoading}>
                    {exportLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportAsPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsJSON}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsCSV}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>ATS Compatibility Score</span>
                </span>
                {getStatusBadge(analysis.results.overallScore)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.results.overallScore)}`}>
                  {analysis.results.overallScore}%
                </div>
                <div className="flex-1">
                  <Progress value={analysis.results.overallScore} className="h-3" />
                </div>
                {getScoreIcon(analysis.results.overallScore)}
              </div>
              <p className="text-sm text-muted-foreground">
                {analysis.results.overallScore >= 80
                  ? "Excellent! Your resume is well-optimized for ATS systems."
                  : analysis.results.overallScore >= 60
                    ? "Good start! Some improvements needed for better ATS compatibility."
                    : "Needs improvement. Consider the suggestions below to optimize your resume."}
              </p>
            </CardContent>
          </Card>

          {/* Section Scores */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analysis.results.sectionAnalysis &&
              Object.entries(analysis.results.sectionAnalysis).map(([sectionName, data]) => (
                <Card key={sectionName}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm capitalize">{sectionName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>{data.score}%</span>
                      {getScoreIcon(data.score)}
                    </div>
                    <Progress value={data.score} className="h-2 mb-2" />
                    {data.feedback && <p className="text-xs text-muted-foreground">{data.feedback}</p>}
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Keywords Analysis */}
          {analysis.results.keywordAnalysis && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Matched Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Matched Keywords ({analysis.results.keywordAnalysis.matched?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.keywordAnalysis.matched?.map((keyword, i) => (
                      <Badge key={i} className="bg-green-100 text-green-800">
                        {keyword}
                      </Badge>
                    )) || <p className="text-muted-foreground">No matched keywords found</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>Missing Keywords ({analysis.results.keywordAnalysis.missing?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.results.keywordAnalysis.missing?.map((keyword, i) => (
                      <Badge key={i} variant="destructive" className="bg-red-100 text-red-800">
                        {keyword}
                      </Badge>
                    )) || <p className="text-muted-foreground">No missing keywords identified</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Suggestions */}
          {analysis.results.suggestions && analysis.results.suggestions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Improvement Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.results.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">
                        {typeof suggestion === "string" ? suggestion : suggestion.text || suggestion.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            {analysis.results.strengths && analysis.results.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.results.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {analysis.results.weaknesses && analysis.results.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.results.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metadata */}
          {analysis.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Analysis Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {analysis.metadata.processingTime && (
                    <div>
                      <span className="text-muted-foreground">Processing Time:</span>
                      <p className="font-medium">{analysis.metadata.processingTime}ms</p>
                    </div>
                  )}
                  {analysis.metadata.aiModel && (
                    <div>
                      <span className="text-muted-foreground">AI Model:</span>
                      <p className="font-medium">{analysis.metadata.aiModel}</p>
                    </div>
                  )}
                  {analysis.metadata.version && (
                    <div>
                      <span className="text-muted-foreground">Version:</span>
                      <p className="font-medium">{analysis.metadata.version}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium capitalize">{analysis.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
