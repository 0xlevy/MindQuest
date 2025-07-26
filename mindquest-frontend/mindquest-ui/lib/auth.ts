"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "./api"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  points: number
  rank: number
  joinDate: string
  provider: "email" | "google"
  role: "user" | "admin" | "moderator"
  permissions: string[]
}

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
    const savedUser = localStorage.getItem("mindquest_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const determineUserRole = (email: string): { role: "user" | "admin" | "moderator"; permissions: string[] } => {
    if (ADMIN_EMAILS.includes(email)) {
      return {
        role: "admin",
        permissions: [
          "manage_users",
          "manage_questions",
          "manage_categories",
          "view_analytics",
          "moderate_community",
          "manage_rewards",
          "system_settings",
        ],
      }
    }

    if (MODERATOR_EMAILS.includes(email)) {
      return {
        role: "moderator",
        permissions: ["moderate_community", "manage_questions", "view_analytics"],
      }
    }

    return {
      role: "user",
      permissions: ["take_quizzes", "join_community", "earn_rewards"],
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)

    try {
      const response = await apiClient.login({ email, password })
      
      if (response.success) {
        const user = response.data.user
        const token = response.data.token
        const refreshToken = response.data.refreshToken
        
        // Store tokens
        localStorage.setItem("authToken", token)
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("mindquest_user", JSON.stringify(user))
        
        setUser(user)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: response.message || "Login failed" }
      }
    } catch (error) {
      setLoading(false)
      console.error("Login error:", error)
      return { success: false, error: "Failed to fetch" }
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock Google user data with some admin accounts
    const googleUsers = [
      { name: "John Smith", email: "john.smith@gmail.com" },
      { name: "Sarah Johnson", email: "sarah.johnson@gmail.com" },
      { name: "Mike Chen", email: "mike.chen@gmail.com" },
      { name: "Emma Davis", email: "emma.davis@gmail.com" },
      { name: "Admin User", email: "admin@mindquest.com" }, // Admin account
    ]

    const randomUser = googleUsers[Math.floor(Math.random() * googleUsers.length)]
    const { role, permissions } = determineUserRole(randomUser.email)

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: randomUser.name,
      email: randomUser.email,
      avatar: `/placeholder.svg?height=40&width=40`,
      level: role === "admin" ? 10 : Math.floor(Math.random() * 10) + 1,
      points: role === "admin" ? 10000 : Math.floor(Math.random() * 5000) + 500,
      rank: role === "admin" ? 1 : Math.floor(Math.random() * 1000) + 1,
      joinDate: new Date().toLocaleDateString(),
      provider: "google",
      role,
      permissions,
    }

    setUser(mockUser)
    localStorage.setItem("mindquest_user", JSON.stringify(mockUser))
    setLoading(false)
    return { success: true }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)

    try {
      const response = await apiClient.register({ name, email, password })
      
      if (response.success) {
        const user = response.data.user
        const token = response.data.token
        const refreshToken = response.data.refreshToken
        
        // Store tokens
        localStorage.setItem("authToken", token)
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("mindquest_user", JSON.stringify(user))
        
        setUser(user)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: response.message || "Registration failed" }
      }
    } catch (error) {
      setLoading(false)
      console.error("Registration error:", error)
      return { success: false, error: "Failed to fetch" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mindquest_user")
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
