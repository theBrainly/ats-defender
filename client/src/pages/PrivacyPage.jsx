import React from "react"
import { Link } from "react-router-dom"
import { Shield, ArrowLeft, Eye, Database, Shield as ShieldCheck, Users, Mail, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default /**
 * Active: 2026-01-02
 * Function: PrivacyPage
 */
/**
 * Active: 2026-01-03
 * Function: PrivacyPage
 */
/**
 * Active: 2026-01-04
 * Function: PrivacyPage
 */
/**
 * Active: 2026-01-06
 * Function: PrivacyPage
 */
function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ATS Defender</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>GDPR Compliant</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Database className="h-3 w-3" />
              <span>Data Protected</span>
            </Badge>
          </div>
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
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-primary" />
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We collect information you provide directly to us when you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Create an account:</strong> Name, email address, password</li>
                  <li><strong>Use our service:</strong> Resume content, job descriptions, scan history</li>
                  <li><strong>Contact us:</strong> Support inquiries, feedback, correspondence</li>
                  <li><strong>Automatically collected:</strong> IP address, browser type, device information, usage patterns</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Database className="h-6 w-6 mr-2 text-primary" />
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide, maintain, and improve our resume analysis service</li>
                  <li>Process your resume and job description data for ATS optimization</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze usage patterns to improve our service</li>
                  <li>Protect against fraud, abuse, and security threats</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell, rent, or share your personal information with third parties except:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Service Providers:</strong> Trusted partners who assist in operating our service (cloud hosting, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfer:</strong> In connection with a merger, sale, or transfer of assets</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                </ul>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">
                    <strong>Important:</strong> We never share your resume content or personal data with potential employers or third parties for marketing purposes.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <ShieldCheck className="h-6 w-6 mr-2 text-primary" />
                  4. Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We implement appropriate technical and organizational measures to protect your data:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure cloud infrastructure</li>
                  <li>Regular backups and disaster recovery</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  <strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion<br />
                  <strong>Resume Data:</strong> Automatically deleted after 90 days of inactivity<br />
                  <strong>Usage Analytics:</strong> Anonymized and retained for up to 2 years
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights (GDPR)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you are in the European Union, you have the following rights:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  To exercise these rights, contact us at{" "}
                  <Link to="/contact" className="text-primary hover:text-primary/80 underline">
                    our contact page
                  </Link>.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site usage and improve performance</li>
                  <li>Provide security features</li>
                  <li>Understand how you interact with our service</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Our service may contain links to third-party websites or integrate with third-party services. We use:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Cloud hosting providers for secure data storage</li>
                  <li>Analytics services to understand usage patterns</li>
                  <li>AI/ML services for resume analysis (data is anonymized)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  These third parties have their own privacy policies, and we are not responsible for their practices.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. International Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the new Privacy Policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Mail className="h-6 w-6 mr-2 text-primary" />
                  12. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-gray-700">
                    <strong>Email:</strong> officialmailakashsharma@gmail.com<br />
                    <strong>Website:</strong>{" "}
                    <Link to="/contact" className="text-primary hover:text-primary/80 underline">
                      Contact Form
                    </Link><br />
                    <strong>Developer:</strong> Akash Sharma<br />
                    <strong>Response Time:</strong> Within 48 hours
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. About the Developer</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-800">
                    <strong>ATS Defender</strong> is developed and maintained by <strong>Akash Sharma</strong>,
                    a passionate developer dedicated to helping job seekers optimize their resumes for success.
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-blue-700">
                    <p><strong>Built with:</strong> React + Vite + TailwindCSS</p>
                    <p><strong>Contact:</strong> officialmailakashsharma@gmail.com</p>
                    <p><strong>Copyright:</strong> © 2026 Akash Sharma. All rights reserved.</p>
                  </div>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/auth/signup">Accept Privacy Policy & Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
