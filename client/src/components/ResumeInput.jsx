import React, { useState, useRef } from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import mammoth from "mammoth"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { logError } from "@/lib/logger"
import { Toast } from "@/components/ui/toast"

// ✅ Set the worker source to local file (more reliable)
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

function ResumeInput({ value, onChange }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [toast, setToast] = useState({ message: "", type: "info" });
  const fileInputRef = useRef(null)

  const handleChooseFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      logError("File input ref not found")
    }
  }

  const extractTextFromPDF = async (file) => {
    setIsExtracting(true)
    setExtractionProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()

      const loadingTask = getDocument({
        data: arrayBuffer,
        // Add options to handle problematic PDFs
        stopAtErrors: false,
        isEvalSupported: false,
        disableFontFace: true
      })

      const pdf = await loadingTask.promise

      const numPages = pdf.numPages
      let fullText = ""

      for (let i = 1; i <= numPages; i++) {
        try {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .filter(item => item.str && item.str.trim()) // Filter out empty strings
            .map((item) => item.str)
            .join(" ")

          if (pageText.trim()) {
            fullText += pageText + "\n\n"
          }
          setExtractionProgress(Math.round((i / numPages) * 100))
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError)
          // Continue processing other pages
        }
      }

      if (!fullText.trim()) {
        throw new Error("No text could be extracted from the PDF. The file might be image-based or corrupted.")
      }

      return fullText.trim()
    } catch (error) {
      logError("Error extracting text from PDF:", error)
      let errorMessage = "Failed to extract text from PDF"

      if (error.message.includes("Invalid PDF")) {
        errorMessage = "The selected file is not a valid PDF"
      } else if (error.message.includes("worker")) {
        errorMessage = "PDF processing service is not available. Please try a different file format."
      } else if (error.message.includes("No text")) {
        errorMessage = "This PDF appears to be image-based or has no extractable text"
      }

      throw new Error(errorMessage)
    } finally {
      setIsExtracting(false)
      setExtractionProgress(0)
    }
  }

  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value
    } catch (error) {
      logError("Error extracting text from DOCX:", error)
      throw new Error("Failed to extract text from DOCX")
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
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        extractedText = await extractTextFromDOCX(file)
      } else {
        setToast({ message: "Unsupported file type. Please upload a PDF, DOCX, or text file.", type: "error" })
        return
      }

      onChange(extractedText)
    } catch (error) {
      logError("Error processing file:", error)
      const errorMessage = error.message || "Failed to process the file. Please try again."
      setToast({ message: errorMessage, type: "error" })
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
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        extractedText = await extractTextFromDOCX(file)
      } else {
        setToast({ message: "Unsupported file type. Please upload a PDF, DOCX, or text file.", type: "error" })
        return
      }

      onChange(extractedText)
    } catch (error) {
      logError("Error processing file:", error)
      setToast({ message: "Failed to process the file. Please try again.", type: "error" })
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <FileText className="h-5 w-5" />
            Resume Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
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
                <div className="flex flex-col items-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={handleChooseFileClick}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Choose File</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Supported: PDF, DOCX, TXT
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
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
    </>
  )
}

export { ResumeInput }
