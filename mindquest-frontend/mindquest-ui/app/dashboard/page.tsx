"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Brain,
  Trophy,
  Target,
  TrendingUp,
  Play,
  Star,
  BookOpen,
  Users,
  Award,
  LogOut,
  Shield,
  Settings,
  Loader2,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useQuizCategories, useUserPoints } from "@/lib/hooks"

interface Category {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
  questionCount?: number;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  points?: number;
  rank?: number;
  level?: number;
  role?: string;
  provider?: string;
}

export default function DashboardPage() {
  const { user, logout, isAdmin, isModerator } = useAuth()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Use API hooks with error handling
  const { categories, loading: categoriesLoading, error: categoriesError } = useQuizCategories()
  const { pointsSummary, loading: pointsLoading, error: pointsError } = useUserPoints()

  // Safe fallback for points summary
  const safePointsSummary = pointsSummary || { 
    totalPoints: 0, 
    availablePoints: 0, 
    usedPoints: 0,
    average: 0
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIconForCategory = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("science") || lowerName.includes("tech")) return "🔬"
    if (lowerName.includes("history")) return "🏛️"
    if (lowerName.includes("math")) return "🔢"
    if (lowerName.includes("literature") || lowerName.includes("arts")) return "📚"
    if (lowerName.includes("geography")) return "🌍"
    if (lowerName.includes("sport") || lowerName.includes("entertainment")) return "⚽"
    if (lowerName.includes("music")) return "🎵"
    if (lowerName.includes("nature")) return "🌿"
    return "🧠"
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindQuest
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/rewards">
                <Button variant="ghost">Rewards</Button>
              </Link>
              {(isAdmin() || isModerator()) && (
                <Link href="/admin">
                  <Button variant="ghost" className="text-purple-600">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/quiz/1">
                <Button variant="ghost">Quick Quiz</Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    {isAdmin() && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {isModerator() && !isAdmin() && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Settings className="h-3 w-3 mr-1" />
                        Moderator
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">
                      Level {user?.level ?? 1} Quizzer
                    </p>
                    <span className="text-xs text-purple-600 font-medium">
                      {user?.points ?? 0} pts
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            {isAdmin() && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            )}
          </div>
          <p className="text-gray-600">Ready to challenge your mind today?</p>
          {user?.provider === "google" && (
            <Badge variant="secondary" className="mt-2">
              {/* Google icon SVG */}
              Google Account
            </Badge>
          )}
        </div>

        {/* Admin Quick Access */}
        {(isAdmin() || isModerator()) && (
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{isAdmin() ? "Administrator Access" : "Moderator Access"}</h2>
                  <p className="text-purple-100 mb-4">You have {user.role} privileges with access to the admin panel</p>
                  <div className="flex space-x-2">
                    <Link href="/admin">
                      <Button variant="secondary">
                        <Shield className="h-4 w-4 mr-2" />
                        Open Admin Panel
                      </Button>
                    </Link>
                  </div>
                </div>
                <Shield className="h-16 w-16 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  {categoriesLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  ) : categoriesError ? (
                    <p className="text-2xl font-bold text-red-500">--</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {categories?.length || 0}
                    </p>
                  )}
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  {pointsLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  ) : pointsError ? (
                    <p className="text-2xl font-bold text-red-500">--</p>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {(safePointsSummary as any).average || 0}%
                    </p>
                  )}
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.points ?? 0}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rank</p>
                  <p className="text-2xl font-bold text-gray-900">
                    #{user?.rank ?? '--'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quiz Categories */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Categories</h2>
              <Link href="/categories">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoriesError ? (
                <div className="col-span-2 text-center py-8">
                  <div className="text-6xl mb-4">🔌</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Categories</h3>
                  <p className="text-gray-600 mb-4">We're having trouble connecting to our servers.</p>
                  <p className="text-sm text-gray-500 mb-4">Error: {categoriesError}</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Try these steps:</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Ensure the backend server is running on localhost:8080</li>
                      <li>• Check your internet connection</li>
                      <li>• Refresh the page</li>
                    </ul>
                  </div>
                </div>
              ) : categoriesLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : categories && categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getIconForCategory(category.name)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {category.name}
                            </CardTitle>
                            <CardDescription>
                              {category.questionCount || 0} questions
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(category.difficulty)}>
                          {category.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description || "Test your knowledge in this category"}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            0/{category.questionCount || 0}
                          </span>
                        </div>
                        <Progress value={0} className="h-2" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">0%</span>
                          </div>
                          <Link href={`/quiz/${category.id}`}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start Quiz
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">No quiz categories available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600 mb-4">Your recent quiz attempts will appear here</p>
                  <Link href="/categories">
                    <Button variant="outline" size="sm">
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Perfect Score!</p>
                      <p className="text-xs text-gray-500">Geography Quiz</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Top {Math.ceil(user.rank / 100) * 100} Player</p>
                      <p className="text-xs text-gray-500">Global Leaderboard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quiz/1">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Random Quiz
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Leaderboard
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Progress Report
                  </Button>
                </Link>
                {(isAdmin() || isModerator()) && (
                  <Link href="/admin">
                    <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
