

import React, { useState } from "react"
import axios from "axios"

import { Navbar } from "@/components/navbar"
import { ResumeInput } from "@/components/ResumeInput"
import JDInput from "@/components/JDInput"
import { ScanButton } from "@/components/ScanButton"
import { ResultsPanel } from "@/components/ResultsPanel"
import { ProtectedRoute } from "@/components/protected-route"
// import { alert } from "@/components/ui/sonner"// Optional: add if you want alert again

export default function Home() {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [scanResults, setScanResults] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  // You can skip this if you want to continue using `alert`

  const handleScan = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !jobTitle.trim()) {
      alert({
        title: "Missing fields",
        description: "Resume, job description, and job title are required.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setScanResults(null)

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        
        `http://localhost:3000/api/analysis/scan`,
        {
           resumeText,
          jobDescription,
          jobTitle,
          company,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = response.data
      // res.json({
      //   success: true,
      //   analysisId: analysis._id,
      //   results: {
      //     overallScore,
      //     keywordAnalysis: analysis.analysis.keywordAnalysis,
      //     sectionAnalysis: analysis.analysis.sectionAnalysis,
      //     suggestions: analysis.analysis.suggestions,
      //     strengths: analysis.analysis.strengths,
      //     weaknesses: analysis.analysis.weaknesses,
      //     processingTime,
      //   },
      // });
      // analysis.analysis = {
      //   overallScore,
      //   keywordAnalysis: {
      //     matched: keywordMatch.matched.map(keyword => ({
      //       keyword,
      //       frequency: 1,
      //       importance: 1
      //     })),
      //     missing: keywordMatch.missing.map(keyword => ({
      //       keyword,
      //       importance: 1,
      //       category: 'skill'
      //     })),
      //     score: keywordMatch.score,
      //   },
      //   sectionAnalysis: sectionScores,
      //   suggestions: suggestions.map(suggestion => suggestion.description || suggestion),
      //   strengths: resumeAnalysis.strengths || [],
      //   weaknesses: resumeAnalysis.weaknesses || [],
      // };
// 
      // Pass the entire backend response to ResultsPanel for full detail
      setScanResults(data.results)

      // alert(
      //   JSON.stringify({
      //     title: "Analysis Complete",
      //   description: `Your resume scored ${data.results.overallScore}% match.`,
      //   })
      // )
    } catch (error) {
      console.error("Scan failed:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert(JSON.stringify({
            title: "Unauthorized",
            description: "Authentication failed. Please log in again.",
            variant: "destructive",
          }))
        } else {
          alert(JSON.stringify({
            title: "Scan Failed",
            description: error.response?.data?.message || "An error occurred",
            variant: "destructive",
          }))
        }
      } else {
        alert(JSON.stringify({
          title: "Scan Failed",
          description: "Unexpected error occurred.",
          variant: "destructive",
        }))
      }
    } finally {
      setIsScanning(false)
    }
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <ScanButton
              onClick={handleScan}
              isLoading={isScanning}
              disabled={!resumeText.trim() || !jobDescription.trim() || !jobTitle.trim()}
            />
          </div>

          {scanResults && <ResultsPanel results={scanResults} />}
        </main>
      </div>
    </ProtectedRoute>
  )
}

