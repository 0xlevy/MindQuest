// React hooks for API calls
import { useState, useEffect, useCallback } from 'react'
import { 
  apiClient, 
  QuizCategory, 
  QuizQuestion, 
  CommunityPost, 
  CommunityStats,
  PointsSummary,
  CryptoReward,
  User
} from './api'

// Hook for fetching quiz categories
export const useQuizCategories = (search?: string, difficulty?: string) => {
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getQuizCategories({ search, difficulty })
      if (response.success) {
        setCategories(response.data.content)
      } else {
        setError(response.message)
        setCategories([]) // Set empty array as fallback
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Failed to fetch categories:', err)
      // Set empty array as fallback to prevent UI crashes
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [search, difficulty])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}

// Hook for fetching quiz questions
export const useQuizQuestions = (categoryId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    if (!categoryId) return

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getQuizQuestions(categoryId)
      if (response.success) {
        setQuestions(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return { questions, loading, error, refetch: fetchQuestions }
}

// Hook for community stats
export function useCommunityStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.request({
          method: 'GET',
          url: '/community/stats'
        })
        setStats(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch community stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// Hook for community categories
export const useCommunityCategories = () => {
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getCommunityCategories()
      if (response.success) {
        setCategories(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch community categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, error, refetch: fetchCategories }
}

// Hook for community posts
export const useCommunityPosts = (categoryId: string | null, page: number = 0) => {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    if (!categoryId) return

    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getCommunityPosts(categoryId, page)
      if (response.success) {
        setPosts(response.data.content)
        setTotalPages(response.data.totalPages)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }, [categoryId, page])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, totalPages, loading, error, refetch: fetchPosts }
}

// Hook for user points
export const useUserPoints = () => {
  const [pointsSummary, setPointsSummary] = useState<PointsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPoints = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getPointsSummary()
      if (response.success) {
        setPointsSummary(response.data)
      } else {
        setError(response.message)
        // Set default fallback data
        setPointsSummary({ 
          totalPoints: 0, 
          availablePoints: 0, 
          usedPoints: 0, 
          currentStreak: 0, 
          currentLevel: 1, 
          history: [] 
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch points'
      setError(errorMessage)
      console.error('Failed to fetch points:', err)
      // Set default fallback data to prevent UI crashes
      setPointsSummary({ 
        totalPoints: 0, 
        availablePoints: 0, 
        usedPoints: 0, 
        currentStreak: 0, 
        currentLevel: 1, 
        history: [] 
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPoints()
  }, [fetchPoints])

  return { pointsSummary, loading, error, refetch: fetchPoints }
}

// Hook for available rewards
export const useAvailableRewards = () => {
  const [rewards, setRewards] = useState<CryptoReward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getAvailableRewards()
      if (response.success) {
        setRewards(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rewards')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  return { rewards, loading, error, refetch: fetchRewards }
}

// Hook for quiz submission
export const useQuizSubmission = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitQuiz = useCallback(async (categoryId: string, answers: any[]) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.submitQuiz(categoryId, { answers })
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { submitQuiz, loading, error }
}

// Hook for creating community posts
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = useCallback(async (categoryId: string, title: string, content: string, tags: string[]) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createCommunityPost(categoryId, { title, content, tags })
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { createPost, loading, error }
}

// Hook for reward redemption
export const useRewardRedemption = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redeemReward = useCallback(async (rewardId: string, walletAddress: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.redeemReward(rewardId, walletAddress)
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { redeemReward, loading, error }
}

// Hook for user statistics
export const useUserStats = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getUserProfile()
      if (response.success) {
        // Transform user data into stats format
        setStats({
          totalPoints: response.data.points || 0,
          level: response.data.level || 1,
          rank: response.data.rank || "N/A",
          quizzesCompleted: response.data.stats?.totalQuizzes || 0,
          averageScore: response.data.stats?.averageScore || 0,
          timeSpent: response.data.stats?.timeSpent || "0h 0m",
          streak: response.data.stats?.streak || 0,
          achievements: response.data.stats?.achievements || 0
        })
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}

// Hook for recent achievements
export const useRecentAchievements = () => {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // For now, provide welcome achievement until API is available
      setAchievements([
        {
          title: "First Steps",
          description: "Welcome to MindQuest!",
          icon: "🎯",
          points: 100,
          date: new Date().toISOString().split('T')[0],
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return { achievements, loading, error, refetch: fetchAchievements }
}

// Hook for category statistics
export const useCategoryStats = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getQuizCategories({})
      if (response.success) {
        // Transform categories into stats format
        const categoryStats = response.data.content.map((category: any) => ({
          name: category.title,
          completed: 0, // TODO: Add completion tracking
          total: 10, // TODO: Get actual question count
          bestScore: 0, // TODO: Add user's best score for category
          points: 0 // TODO: Add points earned in category
        }))
        setCategories(categoryStats)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategoryStats()
  }, [fetchCategoryStats])

  return { categories, loading, error, refetch: fetchCategoryStats }
}

// Hook for fetching leaderboard data
export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, return empty array until leaderboard API is implemented
      // TODO: Implement actual leaderboard API call
      setLeaderboard([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return { leaderboard, loading, error, refetch: fetchLeaderboard }
}

// Hook for user achievements
export const useUserAchievements = () => {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement actual achievements API call
      // For now, return empty array
      setAchievements([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return { achievements, loading, error, refetch: fetchAchievements }
}

// Hook for points history
export const usePointsHistory = () => {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // TODO: Implement actual points history API call
      // For now, return empty array
      setHistory([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch points history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { history, loading, error, refetch: fetchHistory }
}