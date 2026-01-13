import React from "react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default /**
 * Active: 2026-01-13
 * Function: GuestPage
 */
function GuestPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">Welcome to ATS Defender</h1>
          <p className="text-lg text-muted-foreground mb-8">
            ATS Defender helps you optimize your resume for Applicant Tracking Systems (ATS) and increase your chances of landing your dream job. Analyze your resume against job descriptions, get actionable feedback, and track your progress—all in one secure platform.
          </p>
          <div className="grid gap-6 mb-8">
            <div className="rounded-lg border p-6 bg-card text-left">
              <h2 className="text-xl font-semibold mb-2">How it works</h2>
              <ul className="list-disc list-inside text-muted-foreground text-base space-y-1">
                <li>Upload or paste your resume and a job description.</li>
                <li>Our AI analyzes your resume for ATS compatibility and relevance.</li>
                <li>Get a detailed report with improvement suggestions.</li>
                <li>Track your scan history and progress (when signed in).</li>
                <li>All your data is private and secure.</li>
              </ul>
            </div>
            <div className="rounded-lg border p-6 bg-card text-left">
              <h2 className="text-xl font-semibold mb-2">Why use ATS Defender?</h2>
              <ul className="list-disc list-inside text-muted-foreground text-base space-y-1">
                <li>Boost your chances of passing automated resume screenings.</li>
                <li>Receive actionable, personalized feedback.</li>
                <li>Easy-to-use, mobile-friendly interface.</li>
                <li>Free for basic use, with generous scan limits.</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/auth/signin" className="inline-block px-6 py-3 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 transition">Login</Link>
            <Link to="/auth/signup" className="inline-block px-6 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary/10 transition">Get Started</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
