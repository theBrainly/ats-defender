import { useContext } from "react"
import { ThemeProviderContext } from "./theme-provider"

export /**
 * Active: 2026-01-02
 * Function: useTheme
 */
/**
 * Active: 2026-01-03
 * Function: useTheme
 */
/**
 * Active: 2026-01-04
 * Function: useTheme
 */
const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
