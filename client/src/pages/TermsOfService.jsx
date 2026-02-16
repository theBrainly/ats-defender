import React from "react"
import { Link } from "react-router-dom"
import { Shield, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using ATS Defender ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Service Description</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ATS Defender is a resume optimization tool that helps users improve their resumes for Applicant Tracking Systems (ATS). Our service includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Resume analysis and scoring</li>
                  <li>Keyword optimization suggestions</li>
                  <li>ATS compatibility checking</li>
                  <li>Resume improvement recommendations</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To access certain features of our service, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                    Privacy Policy
                  </Link>{" "}
                  to understand how we collect, use, and protect your information.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Usage Limitations</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Users are subject to the following limitations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Free accounts are limited to 25 scans per month</li>
                  <li>Users may not abuse or overload our systems</li>
                  <li>Commercial use requires a separate agreement</li>
                  <li>Reverse engineering or data scraping is prohibited</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of ATS Defender and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Prohibited Uses</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You may not use our Service:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations or laws</li>
                  <li>To transmit or create content that is harmful, threatening, abusive, or hateful</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information on this Service is provided on an "as is" basis. ATS Defender disclaims all warranties, whether express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall ATS Defender be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Developer Information</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ATS Defender is developed and maintained by <strong>Akash Sharma</strong>.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Developer:</strong> Akash Sharma<br />
                    <strong>Contact:</strong> officialmailakashsharma@gmail.com<br />
                    <strong>Copyright:</strong> © 2026 Akash Sharma. All rights reserved.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at{" "}
                  <Link to="/contact" className="text-primary hover:text-primary/80 underline">
                    our contact page
                  </Link> or email us directly at{" "}
                  <a href="mailto:officialmailakashsharma@gmail.com" className="text-primary hover:text-primary/80 underline">
                    officialmailakashsharma@gmail.com
                  </a>.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/auth/signup">Accept Terms & Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
