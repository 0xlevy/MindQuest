"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, Clock, Users, Star, TrendingUp, Filter } from "lucide-react"
import Link from "next/link"
import { useQuizCategories } from "@/lib/hooks"

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  
  const { categories, loading, error, refetch } = useQuizCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedDifficulty("all")
    setSortBy("name")
  }

  // Filter and sort categories
  const filteredAndSortedCategories = (categories || [])
    .filter(category => {
      const matchesSearch = (category.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (category.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === "all" || category.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "difficulty":
          const difficultyOrder = { "EASY": 1, "MEDIUM": 2, "HARD": 3 }
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
        case "questions":
          return (b.questionCount || 0) - (a.questionCount || 0)
        default:
          return 0
      }
    })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getIconForCategory = (name: string) => {
    const lowerName = (name || "").toLowerCase()
    if (lowerName.includes("science") || lowerName.includes("tech")) return "🔬"
    if (lowerName.includes("history")) return "📚"
    if (lowerName.includes("math")) return "🧮"
    if (lowerName.includes("language")) return "📖"
    if (lowerName.includes("art")) return "🎨"
    if (lowerName.includes("sport")) return "⚽"
    if (lowerName.includes("music")) return "🎵"
    if (lowerName.includes("nature")) return "🌿"
    return "🧠"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Categories</h1>
          <p className="text-gray-600">Choose a category to start your quiz journey</p>
        </div>

        {/* Loading skeleton for filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Loading skeleton for categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-64">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz Categories</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Categories</h1>
        <p className="text-gray-600">Choose a category to start your quiz journey</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="questions">Questions</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </form>

        {(searchTerm || selectedDifficulty !== "all") && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
              </Badge>
            )}
            {selectedDifficulty !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedDifficulty}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredAndSortedCategories.length === 0 
            ? "No categories found matching your criteria" 
            : `Showing ${filteredAndSortedCategories.length} ${filteredAndSortedCategories.length === 1 ? 'category' : 'categories'}`
          }
        </p>
      </div>

      {/* Categories Grid */}
      {filteredAndSortedCategories.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 border-l-4" 
                  style={{ borderLeftColor: category.color || '#3B82F6' }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label="category icon">
                      {getIconForCategory(category.name)}
                    </span>
                    <div>
                      <CardTitle className="text-lg leading-tight">
                        {category.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDifficultyColor(category.difficulty)}`}
                        >
                          {category.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm mb-4 line-clamp-3">
                  {category.description || "Test your knowledge in this exciting category"}
                </CardDescription>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{category.questionCount || 0} questions</span>
                    </div>
                    {category.createdAt && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {category.tags && category.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {category.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {category.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{category.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <Link href={`/quiz/${category.id}`} className="block">
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    <span>Start Quiz</span>
                    <TrendingUp className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer */}
      {filteredAndSortedCategories.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Ready to challenge yourself?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Each quiz is designed to test your knowledge and help you learn something new. 
              Track your progress and compete with others!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
