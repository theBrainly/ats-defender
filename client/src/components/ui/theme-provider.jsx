"use client"

import * as React from "react"
import { createContext, useEffect, useState } from "react"

export const ThemeProviderContext = createContext(undefined)

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "ats-defender-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(() => {
        // Check for stored theme preference
        const storedTheme = localStorage.getItem(storageKey)
        if (storedTheme) {
            return storedTheme
        }

        // Check for system preference
        if (defaultTheme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        }

        return defaultTheme
    })

    useEffect(() => {
        const root = window.document.documentElement

        // Remove all previous theme classes
        root.classList.remove("light", "dark")

        // Add the current theme class
        root.classList.add(theme)

        // Store the theme preference
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

// useTheme hook is now in use-theme.js
