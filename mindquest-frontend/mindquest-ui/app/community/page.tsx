"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Users,
  MessageSquare,
  TrendingUp,
  Search,
  Plus,
  Home,
  LogOut,
  ThumbsUp,
  Reply,
  BookOpen,
  Award,
  Globe,
  Shield,
  Coins,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { 
  useCommunityStats, 
  useCommunityCategories,
  useCommunityPosts,
  useCreatePost
} from "@/lib/hooks"

export default function CommunityPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  // Use API hooks for real data
  const { stats, loading: statsLoading, error: statsError } = useCommunityStats()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCommunityCategories()
  const { posts, loading: postsLoading, error: postsError } = useCommunityPosts(null)
  const { createPost, loading: createPostLoading } = useCreatePost()

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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCreatePost = async () => {
    if (newPostTitle && newPostContent && !createPostLoading) {
      try {
        // Use the first available category or a default category ID
        const categoryId = categories && categories.length > 0 ? categories[0].id : "default"
        await createPost(categoryId, newPostTitle, newPostContent, [])
        setNewPostTitle("")
        setNewPostContent("")
        setShowNewPost(false)
      } catch (error) {
        console.error("Failed to create post:", error)
      }
    }
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  )

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="text-center py-8">
      <p className="text-red-600">Error: {message}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindQuest Community
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
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
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">Level {user.level} • {user.points} pts</p>
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Web3 Community Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with blockchain experts, share knowledge, and learn from the Web3 community
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  stats?.activeUsers?.toLocaleString() || "0"
                )}
              </div>
              <p className="text-sm text-gray-600">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  stats?.totalPosts?.toLocaleString() || "0"
                )}
              </div>
              <p className="text-sm text-gray-600">Total Posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {categoriesLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  categories?.length?.toLocaleString() || "0"
                )}
              </div>
              <p className="text-sm text-gray-600">Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  stats?.categoryStats?.reduce((sum, cat) => sum + cat.postCount, 0)?.toLocaleString() || "0"
                )}
              </div>
              <p className="text-sm text-gray-600">Total Questions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            {/* Create New Post */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setShowNewPost(!showNewPost)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>

            {showNewPost && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Discussion</CardTitle>
                  <CardDescription>Share your thoughts with the Web3 community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="What's on your mind about Web3?"
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCreatePost}
                      disabled={createPostLoading || !newPostTitle || !newPostContent}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {createPostLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Post Discussion"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Display */}
            {postsLoading ? (
              <LoadingSpinner />
            ) : postsError ? (
              <ErrorMessage message={postsError} />
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{post.title}</h3>
                            {post.author.level >= 5 && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Expert
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{post.author.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">Level {post.author.level}</span>
                            <span className="text-gray-500">•</span>
                            <Badge variant="outline">{post.categoryName}</Badge>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{post.content}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center space-x-6">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                              <Reply className="h-4 w-4 mr-1" />
                              {post.replies} replies
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {post.views} views
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No discussions found. Be the first to start a conversation!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {categoriesLoading ? (
              <LoadingSpinner />
            ) : categoriesError ? (
              <ErrorMessage message={categoriesError} />
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="hover:shadow-lg transition-shadow border-2 border-purple-200"
                  >
                    <CardHeader className="bg-purple-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">
                          {category.iconUrl ? (
                            <img src={category.iconUrl} alt={category.name} className="w-8 h-8" />
                          ) : (
                            "📚"
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {category.questionCount} questions • {category.difficulty}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      {category.tags && category.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{category.questionCount}</div>
                          <p className="text-xs text-gray-500">Questions</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{category.difficulty}</div>
                          <p className="text-xs text-gray-500">Difficulty</p>
                        </div>
                      </div>
                      <Link href={`/quiz/${category.id}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No categories available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {statsLoading ? (
              <LoadingSpinner />
            ) : statsError ? (
              <ErrorMessage message={statsError} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Community Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Total Posts</h3>
                          <p className="text-sm text-gray-500">All discussions</p>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {stats?.totalPosts?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">Active Users</h3>
                          <p className="text-sm text-gray-500">Currently online</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {stats?.activeUsers?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Category Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.categoryStats?.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-500">Category discussions</p>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {category.postCount}
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No category statistics available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Be Respectful</h3>
                      <p className="text-sm text-gray-600">Treat all community members with respect and kindness</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Share Knowledge</h3>
                      <p className="text-sm text-gray-600">Help others learn and grow in the Web3 space</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Stay Safe</h3>
                      <p className="text-sm text-gray-600">Never share private keys or sensitive information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Coins className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">No Financial Advice</h3>
                      <p className="text-sm text-gray-600">Share insights, not investment recommendations</p>
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
