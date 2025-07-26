"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Coins, Gift, Trophy, Star, Zap, Home, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAvailableRewards, useUserPoints, useUserAchievements, usePointsHistory } from "@/lib/hooks"

export default function RewardsPage() {
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const { rewards: availableRewards, loading: rewardsLoading, error: rewardsError } = useAvailableRewards()
  const { pointsSummary, loading: pointsLoading, error: pointsError } = useUserPoints()
  const { achievements, loading: achievementsLoading, error: achievementsError } = useUserAchievements()
  const { history, loading: historyLoading, error: historyError } = usePointsHistory()

  const handleRedeem = async (rewardId: string) => {
    // TODO: Implement actual redemption logic with API call
    alert(`Redemption functionality coming soon!`)
  }

  // Safe fallbacks for when API data is unavailable
  const safePointsSummary = pointsSummary || { 
    totalPoints: 0, 
    availablePoints: 0, 
    usedPoints: 0,
    currentStreak: 0,
    currentLevel: 1,
    history: []
  }
  
  const progressToNextLevel = safePointsSummary.totalPoints 
    ? ((safePointsSummary.totalPoints % 500) / 500) * 100 
    : 0

  const currentLevel = safePointsSummary.totalPoints 
    ? Math.floor(safePointsSummary.totalPoints / 500) + 1 
    : 1

  // Show loading state only if all are loading and no errors
  if ((rewardsLoading || pointsLoading) && !rewardsError && !pointsError) {
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
                <Link href="/dashboard">
                  <Button variant="outline">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading Header */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-72 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Loading Points Overview */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton className="h-8 w-8 mx-auto mb-2" />
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Loading Tabs */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gift className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Rewards Center</h1>
          </div>
          <p className="text-xl text-gray-600">
            Earn points through quizzes and redeem them for cryptocurrency rewards
          </p>
        </div>

        {/* Points Overview */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-3xl font-bold">{safePointsSummary.totalPoints?.toLocaleString() || 0}</div>
                <p className="text-purple-100">Total Points</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-3xl font-bold">{safePointsSummary.availablePoints?.toLocaleString() || 0}</div>
                <p className="text-purple-100">Available Points</p>
              </div>
              <div className="text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-3xl font-bold">Level {currentLevel}</div>
                <p className="text-purple-100">Current Level</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-3xl font-bold">${((safePointsSummary.usedPoints || 0) / 100).toFixed(0)}</div>
                <p className="text-purple-100">Total Redeemed</p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Level {currentLevel} Progress</span>
                <span className="text-sm">
                  {(safePointsSummary.totalPoints || 0) % 500}/500 points to Level {currentLevel + 1}
                </span>
              </div>
              <Progress value={progressToNextLevel} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crypto">Crypto Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">Points History</TabsTrigger>
            <TabsTrigger value="earn">Earn More</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            {availableRewards && availableRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableRewards.map((reward) => {
                  const canAfford = (safePointsSummary.availablePoints || 0) >= (reward.minPoints || 0)
                  const isAvailable = reward.available && canAfford
                  
                  return (
                    <Card
                      key={reward.id}
                      className={`relative overflow-hidden ${
                        isAvailable ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                              ₿
                            </div>
                            <div>
                              <CardTitle className="text-lg">{reward.name || 'Crypto Reward'}</CardTitle>
                              <CardDescription>${reward.value || 0} value</CardDescription>
                            </div>
                          </div>
                          {isAvailable ? (
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          ) : (
                            <Badge variant="secondary">
                              {reward.available ? 'Insufficient Points' : 'Unavailable'}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {reward.description || `Redeem ${reward.minPoints} points for ${reward.name}`}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Required Points:</span>
                            <span className="font-bold text-lg">{reward.minPoints?.toLocaleString() || 0}</span>
                          </div>

                          {!isAvailable && reward.available && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Your Progress:</span>
                                <span>
                                  {safePointsSummary.availablePoints || 0}/{reward.minPoints || 0}
                                </span>
                              </div>
                              <Progress 
                                value={((safePointsSummary.availablePoints || 0) / (reward.minPoints || 1)) * 100} 
                                className="h-2" 
                              />
                              <p className="text-xs text-gray-500">
                                {(reward.minPoints || 0) - (safePointsSummary.availablePoints || 0)} more points needed
                              </p>
                            </div>
                          )}

                          <Button
                            className={`w-full ${
                              isAvailable
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!isAvailable}
                            onClick={() => handleRedeem(reward.id)}
                          >
                            {isAvailable ? (
                              <>
                                <Coins className="h-4 w-4 mr-2" />
                                Redeem Now
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 mr-2" />
                                Not Available
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rewards Available</h3>
                  <p className="text-gray-600 mb-6">Crypto rewards will be available soon!</p>
                  <Link href="/categories">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Brain className="h-4 w-4 mr-2" />
                      Start Earning Points
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Crypto Rewards Work</CardTitle>
                <CardDescription>Learn about our cryptocurrency redemption process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Earn Points</h3>
                    <p className="text-sm text-gray-600">Complete quizzes and achieve high scores to earn points</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Coins className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Reach Threshold</h3>
                    <p className="text-sm text-gray-600">Accumulate enough points to unlock crypto rewards</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Gift className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Redeem Crypto</h3>
                    <p className="text-sm text-gray-600">Exchange points for real cryptocurrency rewards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {achievementsError ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Achievements</h3>
                  <p className="text-gray-600 mb-6">We're having trouble loading your achievements.</p>
                  <p className="text-sm text-gray-500 mb-4">Error: {achievementsError}</p>
                  <Link href="/categories">
                    <Button>
                      <Star className="h-4 w-4 mr-2" />
                      Start Quiz Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : achievementsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="w-12 h-12 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-3" />
                          <Skeleton className="h-2 w-full mb-2" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={achievement.id || index} className={achievement.completed ? "border-green-200 bg-green-50" : ""}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{achievement.icon || '🏆'}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{achievement.title}</h3>
                            {achievement.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                          </div>
                          <p className="text-gray-600 mb-3">{achievement.description}</p>

                          {achievement.completed ? (
                            <Badge className="bg-green-100 text-green-800">
                              +{achievement.points || 0} points earned
                            </Badge>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress:</span>
                                <span>
                                  {achievement.progress || 0}/{achievement.total || 1}
                                </span>
                              </div>
                              <Progress value={((achievement.progress || 0) / (achievement.total || 1)) * 100} className="h-2" />
                              <Badge variant="secondary">{achievement.points || 0} points when completed</Badge>
                            </div>
                          )}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-600 mb-6">Start taking quizzes to unlock achievements!</p>
                  <Link href="/categories">
                    <Button>
                      <Star className="h-4 w-4 mr-2" />
                      Start Quiz Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>Track your points earnings and redemptions</CardDescription>
              </CardHeader>
              <CardContent>
                {historyError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Points History</h3>
                    <p className="text-gray-600 mb-2">We're having trouble loading your points history.</p>
                    <p className="text-sm text-gray-500">Error: {historyError}</p>
                  </div>
                ) : historyLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-5 w-16 mb-1" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((entry, index) => (
                      <div key={entry.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{entry.activity || 'Activity'}</h3>
                          <p className="text-sm text-gray-500">{entry.date || 'Unknown date'}</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${entry.type === "redeemed" ? "text-red-600" : "text-green-600"}`}>
                            {(entry.points || 0) > 0 ? "+" : ""}
                            {entry.points || 0} pts
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {entry.type || 'earned'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Points History</h3>
                    <p className="text-gray-600 mb-4">Your points activity will appear here</p>
                    <Link href="/categories">
                      <Button variant="outline">
                        Start Earning Points
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Take Quizzes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Earn 10-100 points per quiz based on your score</p>
                  <Link href="/categories">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Browse Categories
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <span>Perfect Scores</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Get 100% on any quiz for bonus points</p>
                  <Link href="/categories">
                    <Button className="w-full" variant="outline">
                      Take Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span>Daily Streaks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Maintain daily quiz streaks for bonus rewards</p>
                  <Button className="w-full" variant="outline">
                    Current Streak: 0 days
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Earning Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips to Maximize Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Aim for Perfect Scores</h3>
                      <p className="text-sm text-gray-600">100% scores give you bonus points</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Complete Quizzes Quickly</h3>
                      <p className="text-sm text-gray-600">Speed bonuses for fast completion</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Try Different Categories</h3>
                      <p className="text-sm text-gray-600">Variety bonuses for exploring topics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Maintain Daily Streaks</h3>
                      <p className="text-sm text-gray-600">Consistent play rewards</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
