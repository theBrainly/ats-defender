import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Shield, History, Home, User, LogOut, Settings, Mail, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate("/")
  }

  /**
 * Active: 2026-01-11
 * Function: getInitials
 */
const getInitials = (name) => {
    if (!name) return "U"
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ATS Defender</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden sm:flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/" className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/history" className="flex items-center space-x-2">
                      <History className="h-4 w-4" />
                      <span>History</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/contact" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          {user?.profile?.avatar && (
                            <AvatarImage src={user.profile.avatar} alt={user.name} />
                          )}
                          <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/auth/signin">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex sm:hidden items-center">
              <ThemeToggle />
              <Button variant="ghost" className="ml-2" onClick={() => setMobileMenuOpen(v => !v)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 left-0 w-full bg-background border-b z-50 shadow-lg animate-fade-in">
            <div className="flex flex-col p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/" className="flex items-center space-x-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <Home className="h-5 w-5" /> <span>Home</span>
                  </Link>
                  <Link to="/history" className="flex items-center space-x-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <History className="h-5 w-5" /> <span>History</span>
                  </Link>
                  <Link to="/contact" className="flex items-center space-x-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <Mail className="h-5 w-5" /> <span>Contact</span>
                  </Link>
                  <Link to="/profile" className="flex items-center space-x-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-5 w-5" /> <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center space-x-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5" /> <span>Settings</span>
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="flex items-center space-x-2 py-2 text-red-600">
                    <LogOut className="h-5 w-5" /> <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/signin" className="py-2" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  <Link to="/auth/signup" className="py-2" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
