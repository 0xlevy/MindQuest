"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  ArrowLeft,
  Search,
  Plus,
  ThumbsUp,
  Reply,
  MessageSquare,
  Shield,
  Pin,
  Users,
  LogOut,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

const categoryData = {
  id: 1,
  name: "Blockchain Fundamentals",
  description: "Learn the basics of blockchain technology and distributed systems",
  icon: "🔗",
  members: 5678,
  posts: 1234,
  moderators: ["Dr. Sarah Chen", "Mike Rodriguez"],
  rules: [
    "Keep discussions focused on blockchain fundamentals",
    "Provide sources for technical claims",
    "Help beginners with patience and clarity",
    "No spam or promotional content",
  ],
}

const pinnedPosts = [
  {
    id: 1,
    title: "Welcome to Blockchain Fundamentals - Start Here!",
    author: "Dr. Sarah Chen",
    authorRole: "Blockchain Expert",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "New to blockchain? This comprehensive guide covers everything you need to know...",
    likes: 456,
    replies: 89,
    timeAgo: "1 week ago",
    isPinned: true,
    isExpert: true,
  },
]

const discussionPosts = [
  {
    id: 2,
    title: "Understanding Merkle Trees in Blockchain",
    author: "Alex Johnson",
    authorRole: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Can someone explain how Merkle trees work in blockchain verification? I understand the concept but struggling with implementation...",
    likes: 23,
    replies: 12,
    timeAgo: "3 hours ago",
    isPinned: false,
    isExpert: false,
    tags: ["merkle-trees", "cryptography", "verification"],
  },
  {
    id: 3,
    title: "Proof of Work vs Proof of Stake: Energy Comparison",
    author: "Emma Davis",
    authorRole: "Sustainability Researcher",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Deep dive into the energy consumption differences between PoW and PoS consensus mechanisms...",
    likes: 67,
    replies: 24,
    timeAgo: "6 hours ago",
    isPinned: false,
    isExpert: false,
    tags: ["consensus", "energy", "sustainability"],
  },
  {
    id: 4,
    title: "Byzantine Fault Tolerance Explained",
    author: "Dr. Sarah Chen",
    authorRole: "Blockchain Expert",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Understanding Byzantine Fault Tolerance and its critical role in distributed systems...",
    likes: 134,
    replies: 45,
    timeAgo: "1 day ago",
    isPinned: false,
    isExpert: true,
    tags: ["bft", "consensus", "distributed-systems"],
  },
]

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)
  const [sortBy, setSortBy] = useState("recent")

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

  const handleCreatePost = () => {
    if (newPostTitle && newPostContent) {
      alert("Post created successfully!")
      setNewPostTitle("")
      setNewPostContent("")
      setShowNewPost(false)
    }
  }

  const allPosts = [...pinnedPosts, ...discussionPosts]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/community" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Back to Community</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {categoryData.name}
                </span>
              </div>
            </div>
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
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{categoryData.icon}</div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{categoryData.name}</h1>
                    <p className="text-gray-600 mb-4">{categoryData.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{categoryData.members.toLocaleString()} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{categoryData.posts.toLocaleString()} posts</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Join Category
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search and Create Post */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search in this category..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="replies">Most Replies</option>
                </select>
                <Button
                  onClick={() => setShowNewPost(!showNewPost)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>

            {/* Create New Post */}
            {showNewPost && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post in {categoryData.name}</CardTitle>
                  <CardDescription>Share your knowledge or ask a question</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="What would you like to discuss?"
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCreatePost}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Create Post
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {allPosts.map((post) => (
                <Card
                  key={post.id}
                  className={`hover:shadow-lg transition-shadow ${post.isPinned ? "border-yellow-200 bg-yellow-50" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {post.isExpert && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Expert
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">{post.author}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.authorRole}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timeAgo}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        {post.tags && (
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
                            View Discussion
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Members</span>
                    <span className="font-medium">{categoryData.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Posts</span>
                    <span className="font-medium">{categoryData.posts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posts Today</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Members</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Moderators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moderators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.moderators.map((moderator, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="text-xs">
                          {moderator
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{moderator}</p>
                        <p className="text-xs text-gray-500">Moderator</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.rules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-sm font-medium text-purple-600">{index + 1}.</span>
                      <p className="text-sm text-gray-600">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/community/smart-contracts" className="block p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📝</span>
                      <span className="text-sm font-medium">Smart Contracts</span>
                    </div>
                  </Link>
                  <Link href="/community/defi" className="block p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💰</span>
                      <span className="text-sm font-medium">DeFi & Protocols</span>
                    </div>
                  </Link>
                  <Link href="/community/web3-dev" className="block p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⚡</span>
                      <span className="text-sm font-medium">Web3 Development</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
