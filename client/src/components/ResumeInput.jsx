import React, { useState } from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// ✅ Set the worker source manually (CDN link)
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`

function ResumeInput({ value, onChange }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)

  const extractTextFromPDF = async (file) => {
    setIsExtracting(true)
    setExtractionProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      let fullText = ""

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item) => item.str).join(" ")

        fullText += pageText + "\n\n"
        setExtractionProgress(Math.round((i / numPages) * 100))
      }

      return fullText.trim()
    } catch (error) {
      console.error("Error extracting text from PDF:", error)
      throw new Error("Failed to extract text from PDF")
    } finally {
      setIsExtracting(false)
      setExtractionProgress(0)
    }
  }

  const extractTextFromTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error("Failed to read text file"))
      reader.readAsText(file)
    })
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      let extractedText = ""

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file)
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        extractedText = await extractTextFromTextFile(file)
      } else {
        alert("Unsupported file type. Please upload a PDF or text file.")
        return
      }

      onChange(extractedText)
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Failed to process the file. Please try again.")
    }
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (!file) return

    try {
      let extractedText = ""

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file)
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        extractedText = await extractTextFromTextFile(file)
      } else {
        alert("Unsupported file type. Please upload a PDF or text file.")
        return
      }

      onChange(extractedText)
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Failed to process the file. Please try again.")
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-5 w-5" />
          Resume Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isExtracting ? (
            <div>
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-500" />
              <p className="text-sm text-gray-500">
                Extracting... {extractionProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop your resume here, or
              </p>
              <label htmlFor="resume-upload" className="cursor-pointer inline-block">
                <Button>Choose File</Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className=""
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Supported: PDF, TXT (DOCX coming soon)
              </p>
            </>
          )}
        </div>

        <Textarea
          placeholder="Or paste your resume content here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
        />
      </CardContent>
    </Card>
  )
}

export { ResumeInput }
