"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, setAuthTokens, clearAuthTokens, getAuthToken, User } from "./api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAdmin: () => boolean
  isModerator: () => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Admin email addresses (in production, this would be in a database)
const ADMIN_EMAILS = ["admin@mindquest.com", "sarah.chen@mindquest.com", "mike.rodriguez@mindquest.com"]

// Moderator email addresses  
const MODERATOR_EMAILS = ["moderator@mindquest.com", "alex.kumar@mindquest.com", "lisa.wang@mindquest.com"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          const response = await apiClient.getUserProfile()
          if (response.success) {
            setUser(response.data)
          } else {
            clearAuthTokens()
          }
        } catch (error) {
          clearAuthTokens()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)

    try {
      const response = await apiClient.login({ email, password })
      
      if (response.success) {
        const { user, token, refreshToken } = response.data
        setAuthTokens(token, refreshToken)
        setUser(user)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: response.message }
      }
    } catch (error) {
      setLoading(false)
      return { success: false, error: error instanceof Error ? error.message : "Login failed" }
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    // TODO: Implement Google OAuth with backend
    setLoading(false)
    return { success: false, error: "Google login not implemented yet" }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)

    try {
      const response = await apiClient.register({ name, email, password })
      
      if (response.success) {
        const { user, token, refreshToken } = response.data
        setAuthTokens(token, refreshToken)
        setUser(user)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: response.message }
      }
    } catch (error) {
      setLoading(false)
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
    }
  }

  const logout = () => {
    setUser(null)
    clearAuthTokens()
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isModerator = () => {
    return user?.role === "moderator" || user?.role === "admin"
  }

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        loading,
        isAdmin,
        isModerator,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
