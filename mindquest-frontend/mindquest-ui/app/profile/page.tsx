"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Settings,
  Trophy,
  Target,
  Clock,
  Edit,
  Save,
  X,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Award,
  Home,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useUserPoints, useUserStats, useRecentAchievements, useCategoryStats } from "@/lib/hooks"
import { apiClient } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth()
  const { pointsSummary, loading: pointsLoading } = useUserPoints()
  const { stats: userStats, loading: statsLoading } = useUserStats()
  const { achievements: recentAchievements, loading: achievementsLoading } = useRecentAchievements()
  const { categories: categoryStats, loading: categoryStatsLoading } = useCategoryStats()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  })
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        bio: "",
        location: "",
        website: "",
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return
    
    setUpdateLoading(true)
    try {
      const response = await apiClient.updateUserProfile(profileData)
      if (response.success) {
        setIsEditing(false)
        // You might want to update the user context here
      } else {
        alert("Failed to update profile: " + response.message)
      }
    } catch (error) {
      alert("Failed to update profile")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const currentLevel = user.level || 1
  const currentPoints = user.points || 0
  const nextLevelPoints = currentLevel * 500
  const currentLevelProgress = Math.min((currentPoints % 500) / 5, 100)

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
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Level {currentLevel}
                  </Badge>
                  <Badge variant="outline">#{user.rank || "N/A"} Global</Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined Recently</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{profileData.bio}</p>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userStats?.totalPoints?.toLocaleString() || currentPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userStats?.quizzesCompleted || 0}</div>
                    <div className="text-sm text-gray-600">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats?.averageScore || 0}%</div>
                    <div className="text-sm text-gray-600">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userStats?.streak || 0}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className={
                    !isEditing
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : ""
                  }
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Level {currentLevel} Progress</span>
                <span className="text-sm text-gray-600">
                  {currentPoints % 500}/{nextLevelPoints - currentLevel * 500} points to Level{" "}
                  {currentLevel + 1}
                </span>
              </div>
              <Progress value={currentLevelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Overview */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Statistics</CardTitle>
                    <CardDescription>Your quiz performance across all categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">#{user.rank || "N/A"}</div>
                        <div className="text-sm text-gray-600">Global Rank</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">{userStats?.averageScore || 0}%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{userStats?.timeSpent || "0h 0m"}</div>
                        <div className="text-sm text-gray-600">Time Spent</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">{userStats?.achievements || 0}</div>
                        <div className="text-sm text-gray-600">Achievements</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Category Performance</h3>
                      {categoryStatsLoading && <div>Loading category stats...</div>}
                      {categoryStats && categoryStats.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category.name}</span>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-600">Best: {category.bestScore}%</span>
                              <Badge variant="secondary">{category.points} pts</Badge>
                            </div>
                          </div>
                          <Progress value={(category.completed / category.total) * 100} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              {category.completed}/{category.total} completed
                            </span>
                            <span>{Math.round((category.completed / category.total) * 100)}% progress</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Recent Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievementsLoading && <div>Loading achievements...</div>}
                      {recentAchievements && recentAchievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-green-800">{achievement.title}</h3>
                            <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge className="bg-green-100 text-green-800">+{achievement.points} pts</Badge>
                              <span className="text-xs text-gray-500">{achievement.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/quiz/1">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Take Random Quiz
                      </Button>
                    </Link>
                    <Link href="/rewards">
                      <Button className="w-full bg-transparent" variant="outline">
                        View Rewards
                      </Button>
                    </Link>
                    <Link href="/leaderboard">
                      <Button className="w-full bg-transparent" variant="outline">
                        View Leaderboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Achievements</CardTitle>
                <CardDescription>Your complete achievement collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievementsLoading && <div>Loading achievements...</div>}
                  {recentAchievements && recentAchievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-green-800 mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <Badge className="bg-green-100 text-green-800">+{achievement.points} points</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and privacy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
                  <p className="text-gray-600 mb-4">Account settings will be implemented here</p>
                  <Button variant="outline">Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
