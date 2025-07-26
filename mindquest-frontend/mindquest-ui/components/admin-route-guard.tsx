"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Home, LogOut } from "lucide-react"
import Link from "next/link"

interface AdminRouteGuardProps {
  children: React.ReactNode
  requiredPermission?: string
  fallbackMessage?: string
}

export function AdminRouteGuard({
  children,
  requiredPermission = "manage_users",
  fallbackMessage = "You need administrator privileges to access this page.",
}: AdminRouteGuardProps) {
  const { user, loading, isAdmin, hasPermission, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  // Check if user has admin role or specific permission
  if (!isAdmin() && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-red-600" />
                <span className="text-2xl font-bold text-red-600">Access Denied</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <Card className="w-full max-w-md border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Access Restricted</CardTitle>
              <CardDescription className="text-red-700">{fallbackMessage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Current Access Level</h3>
                    <p className="text-sm text-red-700 capitalize">
                      {user.role} ({user.permissions.length} permissions)
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-red-600">Your permissions:</p>
                      <ul className="text-xs text-red-600 mt-1">
                        {user.permissions.map((permission, index) => (
                          <li key={index}>• {permission.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Need Admin Access?</h3>
                    <p className="text-sm text-blue-700">
                      Contact your system administrator or try logging in with an admin account.
                    </p>
                    <div className="mt-2">
                      <p className="text-xs text-blue-600">Admin test accounts:</p>
                      <ul className="text-xs text-blue-600 mt-1">
                        <li>• admin@mindquest.com</li>
                        <li>• sarah.chen@mindquest.com</li>
                        <li>• mike.rodriguez@mindquest.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link href="/dashboard">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Return to Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    logout()
                    router.push("/login")
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Login with Different Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
