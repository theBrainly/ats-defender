import React from "react"
import { Link } from "react-router-dom"
import { Shield, Mail, Twitter, Github, Linkedin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ATS Defender</span>
            </Link>
            <p className="text-sm text-gray-600">
              Optimize your resume for Applicant Tracking Systems and land your dream job.
            </p>
            <p className="text-xs text-gray-500">
              Built by <strong>Akash Sharma</strong>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Resume Scanner
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 hover:text-primary">
                  Scan History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-600 hover:text-primary">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/auth/forgot-password" className="text-gray-600 hover:text-primary">
                  Reset Password
                </Link>
              </li>
              <li>
                <a href="mailto:officialmailakashsharma@gmail.com" className="text-gray-600 hover:text-primary">
                  Email Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-gray-600">© 2025 Akash Sharma</span>
              </li>
              <li>
                <span className="text-gray-600">All rights reserved</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} ATS Defender. All rights reserved to Akash Sharma.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Built with ❤️ by Akash Sharma</span>
            <Mail className="h-4 w-4" />
            <a href="mailto:officialmailakashsharma@gmail.com" className="hover:text-primary">
              officialmailakashsharma@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
