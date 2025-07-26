"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Trophy, Award, TrendingUp, Users, Home, Crown, Star, Target, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useLeaderboard, useUserStats } from "@/lib/hooks"

export default function LeaderboardPage() {
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard()
  const { stats, loading: userStatsLoading } = useUserStats()

  if (leaderboardLoading || userStatsLoading) {
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">See how you rank against other quiz masters</p>
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Loading Top Rankings */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-6 w-16 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Loading Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other quiz masters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <Card key={user.id || index} className={`${index < 3 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center space-x-2">
                            <span>{user.name}</span>
                            {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                            {index < 3 && <span>{index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}</span>}
                          </h3>
                          <p className="text-sm text-gray-600">{user.quizzes} quizzes completed</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{user.score}</p>
                          <p className="text-sm text-gray-600">points</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rankings Yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to appear on the leaderboard!</p>
                  <Link href="/categories">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Competing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Your Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Current Rank</span>
                    <span className="text-2xl font-bold">#{stats?.rank || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Total Points</span>
                    <span className="text-xl font-semibold">{stats?.totalPoints || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-100">Avg Score</span>
                    <span className="text-xl font-semibold">{stats?.averageScore || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Competition Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Players</span>
                  </div>
                  <span className="font-semibold">{leaderboard?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Active This Week</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Top Score</span>
                  </div>
                  <span className="font-semibold">{leaderboard?.[0]?.score || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Climb the Ranks!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take more quizzes to earn points and improve your ranking
                </p>
                <Link href="/categories">
                  <Button className="w-full">
                    Take a Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Available Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-xs text-gray-600">Champion</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">🧠</div>
                    <p className="text-xs text-gray-600">Genius</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">⚡</div>
                    <p className="text-xs text-gray-600">Speed</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">🎯</div>
                    <p className="text-xs text-gray-600">Accuracy</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">🔥</div>
                    <p className="text-xs text-gray-600">Streak</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <div className="text-2xl mb-1">📚</div>
                    <p className="text-xs text-gray-600">Scholar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
