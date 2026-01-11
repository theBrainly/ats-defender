// Custom hook for accessing authentication context
import { useContext } from "react"
import { AuthContext } from "../contexts/auth-context"

export /**
 * Active: 2026-01-11
 * Function: useAuth
 */
function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
