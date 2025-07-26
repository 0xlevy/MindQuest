"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, TrendingUp, Target, Clock, Award, Home, BarChart3, BookOpen } from "lucide-react"
import Link from "next/link"
import { useCategoryStats, useUserStats } from "@/lib/hooks"

export default function ProgressPage() {
  const { categories: categoryStats, loading: categoryStatsLoading } = useCategoryStats()
  const { stats, loading: userStatsLoading } = useUserStats()

  const getIconForCategory = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("science") || lowerName.includes("tech")) return "🔬"
    if (lowerName.includes("history")) return "📚"
    if (lowerName.includes("math")) return "🧮"
    if (lowerName.includes("literature") || lowerName.includes("arts")) return "🎨"
    if (lowerName.includes("geography")) return "🌍"
    if (lowerName.includes("sport") || lowerName.includes("entertainment")) return "⚽"
    if (lowerName.includes("music")) return "🎵"
    if (lowerName.includes("nature")) return "🌿"
    return "🧠"
  }

  if (categoryStatsLoading || userStatsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MindQuest
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
            <p className="text-gray-600">Monitor your quiz performance and achievements</p>
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Category Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-8 h-8 rounded" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full mb-3" />
                      <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-6 w-36 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindQuest
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your quiz performance and achievements</p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalQuizzes || 0}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalPoints || 0}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Studied</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalTimeStudied || "0h"}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Progress */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Category Progress</h2>
              <Link href="/categories">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Categories
                </Button>
              </Link>
            </div>

            {categoryStats && categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
                  <Card key={category.name}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getIconForCategory(category.name)}</div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.total} questions available</p>
                          </div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">
                          {category.completed}/{category.total}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {Math.round((category.completed / category.total) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(category.completed / category.total) * 100} 
                          className="h-2"
                        />

                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{category.bestScore}%</p>
                            <p className="text-xs text-gray-600">Best Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{category.points}</p>
                            <p className="text-xs text-gray-600">Points</p>
                          </div>
                          <div className="text-center">
                            <Link href={`/categories`}>
                              <Button size="sm" variant="outline">
                                Continue
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
                  <p className="text-gray-600 mb-4">Start taking quizzes to track your progress</p>
                  <Link href="/categories">
                    <Button>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-600 mb-4">Your recent quiz attempts will appear here</p>
                  <Link href="/categories">
                    <Button variant="outline">
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">First Steps</h3>
                <p className="text-sm text-gray-600">Complete your first quiz</p>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">Locked</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Knowledge Seeker</h3>
                <p className="text-sm text-gray-600">Score 80% or higher on 5 quizzes</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Locked</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Perfect Score</h3>
                <p className="text-sm text-gray-600">Get 100% on any quiz</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Locked</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
