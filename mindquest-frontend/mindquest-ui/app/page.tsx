"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Clock, Trophy, ArrowRight, Star, LogOut, MessageSquare, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { useQuizCategories, useLeaderboard, useCommunityStats } from "@/lib/hooks"

interface PlatformStats {
  totalQuestions: number;
  totalUsers: number;
  communityMembers: number;
  verifiedExperts: number;
}

export default function HomePage() {
  const { user, logout } = useAuth()
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalQuestions: 0,
    totalUsers: 0,
    communityMembers: 0,
    verifiedExperts: 0
  })

  // Fetch dynamic data
  const { categories, loading: categoriesLoading, error: categoriesError } = useQuizCategories()
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard()
  const { stats: communityStats, loading: communityLoading } = useCommunityStats()

  // Calculate platform statistics
  useEffect(() => {
    if (categories && leaderboard && communityStats) {
      const totalQuestions = categories.reduce((sum, category) => sum + (category.questionCount || 0), 0)
      
      setPlatformStats({
        totalQuestions,
        totalUsers: leaderboard.length || 50000, // fallback to static number
        communityMembers: communityStats.totalMembers || 12847,
        verifiedExperts: communityStats.verifiedExperts || 156
      })
    }
  }, [categories, leaderboard, communityStats])

  const handleLogout = () => {
    logout()
  }

  // Get featured categories (top 3 by question count)
  const featuredCategories = categories
    ?.sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0))
    .slice(0, 3) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindQuest
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/categories">
                <Button variant="ghost">Categories</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Community
                </Button>
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                    <Link href="/admin">
                      <Button variant="ghost">Admin</Button>
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name || user.email?.split('@')[0]}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              🚀 Interactive Learning Platform with Web3 Community
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Challenge Your Mind with{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Interactive Quizzes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Test your knowledge across {categories?.length || '20+'} categories, track your progress, earn crypto rewards, and connect with blockchain experts in our
              thriving Web3 community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button size="lg" variant="outline">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Join Community
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Start Quiz Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  {featuredCategories.length > 0 && (
                    <Link href={`/quiz/${featuredCategories[0].id}`}>
                      <Button size="lg" variant="outline">
                        Try Demo Quiz
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      {featuredCategories.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Quiz Categories</h2>
              <p className="text-xl text-gray-600">
                Start with our most popular quiz categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoriesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="h-64">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                featuredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="outline">
                          {category.questionCount} questions
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {category.description || "Test your knowledge in this exciting category"}
                      </CardDescription>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={
                          category.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                          category.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {category.difficulty}
                        </Badge>
                        {category.tags && category.tags.length > 0 && (
                          <div className="flex gap-1">
                            {category.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Link href={`/quiz/${category.id}`}>
                        <Button className="w-full">
                          Start Quiz
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="text-center mt-8">
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose MindQuest?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need for an engaging quiz experience and Web3 learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Timed Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Test your knowledge under pressure with customizable time limits</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get instant feedback and track your performance with detailed analytics
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Web3 Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Connect with blockchain experts and learn from the Web3 community</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Crypto Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Earn points and redeem them for real cryptocurrency rewards</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Preview Section - Dynamic Data */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Join Our Web3 Community</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with blockchain experts, share knowledge, and learn from the best in the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-6 w-24 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">🔗</div>
                    <CardTitle>Blockchain Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Learn the basics of blockchain technology from industry experts
                    </CardDescription>
                    <Badge variant="secondary">
                      {communityStats?.categories?.blockchain || 5678} members
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">💰</div>
                    <CardTitle>DeFi & Protocols</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Discuss decentralized finance and protocol developments
                    </CardDescription>
                    <Badge variant="secondary">
                      {communityStats?.categories?.defi || 4321} members
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">🎨</div>
                    <CardTitle>NFTs & Digital Art</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      Explore the world of non-fungible tokens and digital collectibles
                    </CardDescription>
                    <Badge variant="secondary">
                      {communityStats?.categories?.nfts || 3456} members
                    </Badge>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/community">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-20 bg-white/20 mx-auto" />
                ) : (
                  `${platformStats.totalQuestions.toLocaleString()}+`
                )}
              </div>
              <div className="text-purple-100">Quiz Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {leaderboardLoading ? (
                  <Skeleton className="h-10 w-20 bg-white/20 mx-auto" />
                ) : (
                  `${platformStats.totalUsers.toLocaleString()}+`
                )}
              </div>
              <div className="text-purple-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityLoading ? (
                  <Skeleton className="h-10 w-20 bg-white/20 mx-auto" />
                ) : (
                  platformStats.communityMembers.toLocaleString()
                )}
              </div>
              <div className="text-purple-100">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityLoading ? (
                  <Skeleton className="h-10 w-16 bg-white/20 mx-auto" />
                ) : (
                  platformStats.verifiedExperts
                )}
              </div>
              <div className="text-purple-100">Verified Experts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      {leaderboard && leaderboard.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Performers</h2>
              <p className="text-xl text-gray-600">
                See how you stack up against our quiz champions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leaderboard.slice(0, 3).map((user, index) => (
                <Card key={user.id} className="text-center">
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      {user.name || user.email?.split('@')[0]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Points:</span>
                        <span className="font-semibold">{user.points?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-semibold">{user.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/leaderboard">
                <Button variant="outline" size="lg">
                  <Trophy className="mr-2 h-5 w-5" />
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join {platformStats.totalUsers.toLocaleString()}+ learners who are already improving their skills with MindQuest and connecting with Web3
            experts
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Your First Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold">MindQuest</span>
              </div>
              <p className="text-gray-400">
                The ultimate interactive quiz platform with Web3 community for learners of all levels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/categories" className="hover:text-white">
                    Browse Categories
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/rewards" className="hover:text-white">
                    Rewards
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/community" className="hover:text-white">
                    Web3 Community
                  </Link>
                </li>
                <li>
                  <Link href="/community/blockchain-fundamentals" className="hover:text-white">
                    Blockchain Basics
                  </Link>
                </li>
                <li>
                  <Link href="/community/defi" className="hover:text-white">
                    DeFi Discussions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MindQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
