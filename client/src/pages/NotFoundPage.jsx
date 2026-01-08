import React from "react"
import { Link } from "react-router-dom"
import { Shield, Home, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default /**
 * Active: 2026-01-04
 * Function: NotFoundPage
 */
/**
 * Active: 2026-01-08
 * Function: NotFoundPage
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <div className="mb-4">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              The page you're trying to access doesn't exist or may have been moved. This could happen if:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4">
              <li>You typed the URL incorrectly</li>
              <li>The page was moved or deleted</li>
              <li>You followed an outdated link</li>
              <li>You don't have permission to access this page</li>
            </ul>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/" className="flex items-center justify-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Go to Home</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link to="/contact" className="text-primary hover:text-primary/80 underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
