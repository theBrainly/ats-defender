import React, { useState, useEffect } from "react"
import axios from "axios"
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ResumeInput } from "@/components/ResumeInput"
import JDInput from "@/components/JDInput"
import { ScanButton } from "@/components/ScanButton"
import { ResultsPanel } from "@/components/ResultsPanel"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { logError } from "@/lib/logger"
import { getToken } from "@/lib/token"
import GuestPage from "@/pages/GuestPage"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [scanResults, setScanResults] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState(null)
  const [scanLimitInfo, setScanLimitInfo] = useState({
    scanCount: 0,
    scanLimit: 25,
    canScan: true,
    remaining: 25
  })

  // Fetch user's scan limit information
  useEffect(() => {
    const fetchScanLimitInfo = async () => {
      if (!isAuthenticated) return

      try {
        const token = getToken()
        const response = await axios.get(
          `${API_BASE_URL}/analysis/scan-info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.data) {
          setScanLimitInfo(response.data)
        }
      } catch (error) {
        // console.error("Failed to fetch scan limit info:", error)
        logError("Failed to fetch scan limit info:", error)
      }
    }

    fetchScanLimitInfo()
  }, [isAuthenticated, scanResults]) // Re-fetch after new scan

  // Reset scan results when inputs change
  const prevInputsRef = React.useRef({ resumeText: '', jobDescription: '', jobTitle: '' });

  useEffect(() => {
    const prevInputs = prevInputsRef.current;
    // Only reset results if the inputs have actually changed
    if (scanResults &&
      (prevInputs.resumeText !== resumeText ||
        prevInputs.jobDescription !== jobDescription ||
        prevInputs.jobTitle !== jobTitle)) {
      setScanResults(null);
    }
    // Update ref with current values
    prevInputsRef.current = { resumeText, jobDescription, jobTitle };
  }, [resumeText, jobDescription, jobTitle, scanResults]);

  const sanitizeInput = (text) => {
    // Basic sanitization to prevent XSS and other injection attacks
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim()
  }

  const validateInputs = () => {
    const errors = []

    if (!resumeText.trim()) {
      errors.push("Resume text is required")
    } else if (resumeText.trim().length < 50) {
      errors.push("Resume text is too short")
    }

    if (!jobDescription.trim()) {
      errors.push("Job description is required")
    } else if (jobDescription.trim().length < 50) {
      errors.push("Job description is too short")
    }

    if (!jobTitle.trim()) {
      errors.push("Job title is required")
    }

    return errors
  }

  const handleScan = async () => {
    // Reset previous results and status
    setScanResults(null)
    setScanStatus(null)

    // Validate inputs
    const validationErrors = validateInputs()
    if (validationErrors.length > 0) {
      setScanStatus({
        type: "error",
        title: "Invalid Input",
        message: validationErrors.join(". ")
      })
      return
    }

    // Check scan limit
    if (!scanLimitInfo.canScan) {
      setScanStatus({
        type: "error",
        title: "Scan Limit Reached",
        message: `You have used all ${scanLimitInfo.scanLimit} of your available scans.`
      })
      return
    }

    setIsScanning(true)

    try {
      const token = getToken()

      // Sanitize inputs before sending to server
      const sanitizedResumeText = sanitizeInput(resumeText)
      const sanitizedJobDescription = sanitizeInput(jobDescription)
      const sanitizedJobTitle = sanitizeInput(jobTitle)
      const sanitizedCompany = sanitizeInput(company)

      console.log("Sending scan request...", {
        resumeLength: sanitizedResumeText.length,
        jobDescLength: sanitizedJobDescription.length
      });

      const response = await axios.post(
        `${API_BASE_URL}/analysis/scan`,
        {
          resumeText: sanitizedResumeText,
          jobDescription: sanitizedJobDescription,
          jobTitle: sanitizedJobTitle,
          company: sanitizedCompany,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 60000, // 60 second timeout for long analyses
        }
      )

      console.log("Scan response received:", response.data);

      const data = response.data

      // Ensure we have results before proceeding
      if (!data || !data.results) {
        // console.error("Invalid response format - missing results property:", data)
        logError("Invalid response format - missing results property:", data)
        throw new Error("Invalid response format from server");
      }

      // Update scan limit info after successful scan
      if (isAuthenticated && data.scanCount !== undefined) {
        setScanLimitInfo({
          scanCount: data.scanCount,
          scanLimit: scanLimitInfo.scanLimit,
          canScan: data.scanCount < scanLimitInfo.scanLimit,
          remaining: scanLimitInfo.scanLimit - data.scanCount
        })
      }

      // Set results in state for the ResultsPanel to use
      // Ensure we have valid results
      if (!data.results || typeof data.results !== 'object') {
        // console.error("Invalid results format:", data.results);
        logError("Invalid results format:", data.results);
        throw new Error("Server returned invalid results format");
      }

      // Set the scan results in state
      setScanResults(data.results);

      // Set success status
      setScanStatus({
        type: "success",
        title: "Scan Complete",
        message: "Your resume has been successfully analyzed."
      })

      // Track analytics (if implemented)
      try {
        // This would be where you'd track usage for analytics purposes
        // console.log("Scan completed successfully", {
        //   jobTitle: sanitizedJobTitle,
        //   hasCompany: !!sanitizedCompany,
        //   resumeLength: sanitizedResumeText.length,
        //   jobDescriptionLength: sanitizedJobDescription.length,
        // })
      } catch (analyticsError) {
        // console.error("Analytics error:", analyticsError)
        logError("Analytics error:", analyticsError)
      }
    } catch (error) {
      // console.error("Scan failed:", error)
      logError("Scan failed:", error)

      // Handle different error scenarios
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          setScanStatus({
            type: "error",
            title: "Scan Timeout",
            message: "The scan is taking too long. Please try again with a shorter resume or job description."
          })
        } else if (error.response?.status === 401) {
          setScanStatus({
            type: "error",
            title: "Authentication Error",
            message: "Your session has expired. Please log in again."
          })
        } else if (error.response?.status === 403) {
          // Scan limit reached
          setScanStatus({
            type: "error",
            title: "Scan Limit Reached",
            message: error.response.data.message || "You have reached your maximum scan limit."
          })

          // Update scan limit info based on error response
          if (error.response.data.scanCount !== undefined) {
            setScanLimitInfo({
              scanCount: error.response.data.scanCount,
              scanLimit: error.response.data.scanLimit || scanLimitInfo.scanLimit,
              canScan: false,
              remaining: 0
            })
          }
        } else if (error.response?.status === 429) {
          setScanStatus({
            type: "error",
            title: "Too Many Requests",
            message: "You're sending requests too quickly. Please wait a moment before trying again."
          })
        } else {
          setScanStatus({
            type: "error",
            title: "Scan Failed",
            message: error.response?.data?.message || "An unexpected error occurred during analysis."
          })
        }
      } else {
        setScanStatus({
          type: "error",
          title: "Scan Failed",
          message: "An unexpected error occurred. Please try again later."
        })
      }
    } finally {
      setIsScanning(false)
    }
  }

  // Status alert component
  /**
 * Active: 2026-01-01
 * Function: StatusAlert
 */
const StatusAlert = ({ status }) => {
    if (!status) return null

    const alertIcons = {
      error: <AlertTriangle className="text-destructive" />,
      warning: <AlertCircle className="text-amber-500" />,
      info: <Info className="text-blue-500" />,
      success: <CheckCircle className="text-green-500" />
    }

    const alertVariants = {
      error: "destructive",
      warning: "default border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
      info: "default border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
      success: "default border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
    }

    return (
      <Alert
        variant={alertVariants[status.type] || "default"}
        className="mb-6"
      >
        {alertIcons[status.type]}
        <AlertTitle>{status.title}</AlertTitle>
        <AlertDescription>{status.message}</AlertDescription>
      </Alert>
    )
  }

  // Scan limit indicator component
  const ScanLimitIndicator = () => {
    if (!isAuthenticated || !user) return null

    const percentage = (scanLimitInfo.scanCount / scanLimitInfo.scanLimit) * 100
    const isLow = scanLimitInfo.remaining <= 5

    return (
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>Scans used: {scanLimitInfo.scanCount}/{scanLimitInfo.scanLimit}</span>
          <span className={cn(
            "font-medium",
            isLow ? "text-destructive" : "text-muted-foreground"
          )}>
            {scanLimitInfo.remaining} remaining
          </span>
        </div>
        <Progress
          value={percentage}
          className={cn(
            "h-2",
            isLow ? "bg-red-100" : "bg-slate-100"
          )}
        />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">ATS Defender</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Optimize your resume for Applicant Tracking Systems. Upload your resume and job description to get
              detailed analysis and improvement suggestions.
            </p>
          </div>

          {/* Display scan limit indicator if user is authenticated */}
          {isAuthenticated && <ScanLimitIndicator />}

          {/* Display status messages */}
          {scanStatus && <StatusAlert status={scanStatus} />}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <ResumeInput value={resumeText} onChange={setResumeText} />
            <div className="space-y-8">
              <JDInput value={jobDescription} onChange={setJobDescription} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-medium">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-3 py-2 border rounded-md"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Acme Inc."
                    className="w-full px-3 py-2 border rounded-md"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row mb-8 mt-8 sm:mt-12 md:mt-24 lg:mt-36 items-center">
            <div className="flex-1 hidden sm:block"></div>
            <div className="flex-none w-full sm:w-auto">
              <ScanButton
                onClick={handleScan}
                isLoading={isScanning}
                disabled={
                  !resumeText.trim() ||
                  !jobDescription.trim() ||
                  !jobTitle.trim() ||
                  isScanning ||
                  !scanLimitInfo.canScan
                }
                className="w-full sm:w-auto"
              />
            </div>
            <div className="flex-1 hidden sm:block"></div>
          </div>

          {/* Debug element to confirm scanResults state */}
          <div className="text-sm text-gray-500 mb-4">
            Scan results status: {scanResults ? 'Available' : 'Not available'}
            {scanResults && <span> (Score: {scanResults.overallScore || scanResults.score || 'N/A'})</span>}
          </div>

          {/* Render results panel if we have valid scan results */}
          {scanResults && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
              <ResultsPanel results={scanResults} />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
