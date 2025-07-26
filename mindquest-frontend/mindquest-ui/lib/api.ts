// API configuration and client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  errors: string[] | null;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar: string | null;
  role: string;
  permissions: string[];
  level: number;
  points: number;
  rank: number;
  provider: string;
  createdAt: string;
  stats: UserStats | null;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  timeSpent: string;
  streak: number;
  achievements: number;
}

// Quiz types
export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  iconUrl: string;
  color: string;
  creator: string;
  createdAt: string;
  questionCount: number;
  tags: string[];
  allowedRoles: string[];
  relatedCategories: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  points: number;
  difficulty: string;
}

export interface QuizSubmission {
  answers: { questionId: string; selectedAnswer: number; timeSpent: number }[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  points: number;
  bonusPoints: number;
  totalPoints: number;
  timeSpent: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  points: number;
  explanation: string;
}

// Community types
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    level: number;
  };
  categoryId: string;
  categoryName: string;
  likes: number;
  replies: number;
  views: number;
  tags: string[];
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface CommunityStats {
  totalPosts: number;
  activeUsers: number;
  categoryStats: {
    id: string;
    name: string;
    postCount: number;
  }[];
}

// Points types
export interface PointsSummary {
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  currentStreak: number;
  currentLevel: number;
  history: PointsTransaction[];
}

export interface PointsTransaction {
  id: string;
  type: 'EARNED' | 'REDEEMED' | 'BONUS';
  points: number;
  source: string;
  description: string;
  createdAt: string;
}

// Rewards types
export interface CryptoReward {
  id: string;
  name: string;
  description: string;
  value: string;
  minPoints: number;
  icon: string;
  color: string;
  available: boolean;
}

export interface RewardRedemption {
  id: string;
  reward: CryptoReward;
  pointsUsed: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  walletAddress: string;
  transactionId: string | null;
  estimatedDelivery: string;
  createdAt: string;
}

// API Client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Provide more specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection and ensure the backend server is running on http://localhost:8080');
      }
      
      if (error instanceof Error) {
        // Check if it's a server error (5xx)
        if (error.message.includes('HTTP 5')) {
          throw new Error('Server is experiencing issues. Please try again later or contact support if the problem persists.');
        }
        
        // Check if it's a client error (4xx)
        if (error.message.includes('HTTP 4')) {
          throw new Error('Request failed. Please check your authentication and try again.');
        }
        
        throw error;
      }
      
      throw new Error('An unexpected error occurred while communicating with the server.');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.request<{ token: string; expiresIn: number }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Quiz endpoints
  async getQuizCategories(params?: {
    search?: string;
    difficulty?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<{ content: QuizCategory[]; totalPages: number; totalElements: number }>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<{ content: QuizCategory[]; totalPages: number; totalElements: number }>(`/quiz/categories${queryString}`);
  }

  async getQuizQuestions(categoryId: string): Promise<ApiResponse<QuizQuestion[]>> {
    return this.request<QuizQuestion[]>(`/quiz/${categoryId}/questions`);
  }

  async submitQuiz(categoryId: string, submission: QuizSubmission): Promise<ApiResponse<QuizResult>> {
    return this.request<QuizResult>(`/quiz/${categoryId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  async getQuizHistory(page: number = 0, size: number = 10): Promise<ApiResponse<{ content: QuizResult[]; totalPages: number }>> {
    return this.request<{ content: QuizResult[]; totalPages: number }>(`/quiz/history?page=${page}&size=${size}`);
  }

  // Community endpoints
  async getCommunityStats(): Promise<ApiResponse<CommunityStats>> {
    return this.request<CommunityStats>('/community/stats');
  }

  async getCommunityCategories(): Promise<ApiResponse<QuizCategory[]>> {
    return this.request<QuizCategory[]>('/community/categories');
  }

  async getCommunityPosts(categoryId: string, page: number = 0, size: number = 10): Promise<ApiResponse<{ content: CommunityPost[]; totalPages: number }>> {
    return this.request<{ content: CommunityPost[]; totalPages: number }>(`/community/categories/${categoryId}/posts?page=${page}&size=${size}`);
  }

  async createCommunityPost(categoryId: string, post: CreatePostRequest): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>(`/community/categories/${categoryId}/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async getCommunityExperts(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/community/experts');
  }

  // Points endpoints
  async getPointsSummary(): Promise<ApiResponse<PointsSummary>> {
    return this.request<PointsSummary>('/points/summary');
  }

  async getPointsHistory(page: number = 0, size: number = 10): Promise<ApiResponse<{ content: PointsTransaction[]; totalPages: number }>> {
    return this.request<{ content: PointsTransaction[]; totalPages: number }>(`/points/history?page=${page}&size=${size}`);
  }

  // Rewards endpoints
  async getAvailableRewards(): Promise<ApiResponse<CryptoReward[]>> {
    return this.request<CryptoReward[]>('/rewards/available');
  }

  async redeemReward(rewardId: string, walletAddress: string): Promise<ApiResponse<RewardRedemption>> {
    return this.request<RewardRedemption>('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId, walletAddress }),
    });
  }

  async getRedemptionHistory(page: number = 0, size: number = 10): Promise<ApiResponse<{ content: RewardRedemption[]; totalPages: number }>> {
    return this.request<{ content: RewardRedemption[]; totalPages: number }>(`/rewards/history?page=${page}&size=${size}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for token management
export const setAuthTokens = (token: string, refreshToken: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
