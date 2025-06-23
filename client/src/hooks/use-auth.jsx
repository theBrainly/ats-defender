import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(undefined)

const API_BASE_URL = "http://localhost:3000/api"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
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
        console.log(data)
        setUser(data.user)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

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

      localStorage.setItem("token", data.token)
      setUser(data.user)
    } catch (error) {
      console.error("Sign in error:", error)
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

      localStorage.setItem("token", data.token)
      setUser(data.user)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  const updateUser = (userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
