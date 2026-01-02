import React, { createContext, useEffect, useState } from "react"
import { logError } from "@/lib/logger"
import { getToken, setToken, removeToken } from "@/lib/token"

const AuthContext = createContext(undefined)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!user

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = getToken()
            if (!token) {
                setIsLoading(false)
                return
            }

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                removeToken()
                setUser(null)
            }
        } catch (error) {
            logError("Auth check failed:", error)
            removeToken()
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    /**
 * Active: 2026-01-02
 * Function: signIn
 */
const signIn = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Sign in failed")
            }

            setToken(data.token)
            setUser(data.user)
        } catch (error) {
            logError("Sign in error:", error)
            throw error
        }
    }

    const signUp = async (name, email, password, confirmPassword) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Sign up failed")
            }

            setToken(data.token)
            setUser(data.user)
        } catch (error) {
            logError("Sign up error:", error)
            throw error
        }
    }

    /**
 * Active: 2026-01-01
 * Function: signOut
 */
const signOut = async () => {
        try {
            const token = getToken()
            if (token) {
                await fetch(`${API_BASE_URL}/auth/signout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            }
        } catch (error) {
            logError("Sign out error:", error)
        } finally {
            removeToken()
            setUser(null)
        }
    }

    const updateUser = (userData) => {
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
    }

    const refreshUser = async () => {
        await checkAuth()
    }

    const value = {
        user,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateUser,
        refreshUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
