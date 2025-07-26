"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Plus, Edit, Trash2, Users, BarChart3, Settings, Save, X, Shield, Crown } from "lucide-react"
import Link from "next/link"
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"

export default function AdminPage() {
  const { user } = useAuth()
  type Question = {
    id: number
    question: string
    category: string
    difficulty: string
    options: string[]
    correctAnswer: number
    createdAt: string
  }
  const [questions, setQuestions] = useState<Question[]>([])
  type Category = { id: number; name: string }
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
    totalQuizzes: 0,
    avgScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    category: "",
    difficulty: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesResponse = await apiClient.getQuizCategories({})
        if (categoriesResponse.success) {
          setCategories(
            categoriesResponse.data.content.map((cat: { id: string; name: string }) => ({
              id: Number(cat.id),
              name: cat.name,
            }))
          )
        }

        // Fetch questions (this would need an admin endpoint)
        // For now, we'll use an empty array until the endpoint is available
        setQuestions([])

        // Fetch admin stats (this would need an admin stats endpoint)
        // For now, we'll use basic stats
        setStats({
          totalQuestions: 0,
          totalUsers: 0,
          totalQuizzes: 0,
          avgScore: 0,
        })

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.category && newQuestion.difficulty) {
      const question = {
        id: questions.length + 1,
        question: newQuestion.question,
        category: newQuestion.category,
        difficulty: newQuestion.difficulty,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setQuestions([...questions, question])
      setNewQuestion({
        question: "",
        category: "",
        difficulty: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      })
      setIsAddingQuestion(false)
    }
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminRouteGuard requiredPermission="manage_questions">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MindQuest Admin
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    {user?.role === "admin" ? "Administrator" : "Moderator"}
                  </Badge>
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                </div>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">Manage questions, users, and quiz settings</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>
                Role: <strong className="text-purple-600 capitalize">{user?.role}</strong>
              </span>
              <span>•</span>
              <span>
                Permissions: <strong className="text-blue-600">{user?.permissions.length}</strong>
              </span>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Admin Info Card */}
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Administrator Access</h2>
                      <p className="text-purple-100 mb-4">
                        You have {user?.role} privileges with {user?.permissions.length} permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user?.permissions.map((permission, index) => (
                          <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                            {permission.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Crown className="h-16 w-16 text-yellow-300" />
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Questions</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalQuestions}</p>
                      </div>
                      <Brain className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalUsers.toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Quizzes Taken</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.totalQuizzes.toLocaleString()}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.avgScore}%</p>
                      </div>
                      <Settings className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Admin Activity</CardTitle>
                  <CardDescription>Latest administrative actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Admin login: {user?.email}</p>
                        <p className="text-sm text-gray-500">Just now</p>
                      </div>
                      <Badge variant="secondary">Login</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Question added to Science & Technology</p>
                        <p className="text-sm text-gray-500">4 hours ago</p>
                      </div>
                      <Badge variant="secondary">Question</Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">User permissions updated</p>
                        <p className="text-sm text-gray-500">6 hours ago</p>
                      </div>
                      <Badge variant="secondary">User</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Question Management</h2>
                <Button
                  onClick={() => setIsAddingQuestion(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {/* Add Question Form */}
              {isAddingQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Question</CardTitle>
                    <CardDescription>Create a new quiz question</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        placeholder="Enter your question here..."
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newQuestion.category}
                          onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={newQuestion.difficulty}
                          onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Answer Options</Label>
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options]
                              newOptions[index] = e.target.value
                              setNewQuestion({ ...newQuestion, options: newOptions })
                            }}
                          />
                          <Button
                            type="button"
                            variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                          >
                            {newQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="explanation">Explanation (Optional)</Label>
                      <Textarea
                        id="explanation"
                        placeholder="Explain why this is the correct answer..."
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddQuestion}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Question
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingQuestion(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{question.category}</Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`text-sm p-2 rounded ${
                                  index === question.correctAnswer
                                    ? "bg-green-100 text-green-800 font-medium"
                                    : "bg-gray-50"
                                }`}
                              >
                                {String.fromCharCode(65 + index)}. {option}
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">Created: {question.createdAt}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage registered users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600 mb-4">User management features will be implemented here</p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure quiz settings and system preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-600 mb-4">Settings panel will be implemented here</p>
                    <Button variant="outline">Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRouteGuard>
  )
}
