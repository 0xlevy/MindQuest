"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag, Home } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api"
export default function QuizPage() {
  const params = useParams()
  const quizId = params.id as string
  
  const [quizData, setQuizData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getQuizQuestions(quizId)
        if (response.success) {
          setQuizData({
            id: quizId,
            questions: response.data,
            totalQuestions: response.data.length,
            timeLimit: 600, // 10 minutes default
          })
          setTimeLeft(600)
          setSelectedAnswers(new Array(response.data.length).fill(-1))
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && quizData) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizData) {
      handleQuizComplete()
    }
  }, [timeLeft, quizCompleted, quizData])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleQuizComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleQuizComplete = () => {
    setQuizCompleted(true)
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!quizData) return 0
    let correct = 0
    quizData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quizData.questions.length) * 100)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || "Quiz not found"}</p>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }
    const score = calculateScore()

    const calculatePoints = () => {
      const basePoints = Math.round(score * 2) // 2 points per percentage point
      const speedBonus = timeLeft > 300 ? 50 : timeLeft > 180 ? 25 : 0 // Speed bonus
      const perfectBonus = score === 100 ? 100 : 0 // Perfect score bonus
      return basePoints + speedBonus + perfectBonus
    }

    const points = calculatePoints()

    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === quizData.questions[index].correctAnswer,
    ).length

    if (showResults) {
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
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
              <CardDescription>Great job on completing the {quizData.title} quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>{score}%</div>
                  <p className="text-gray-600">Final Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {correctAnswers}/{quizData.questions.length}
                  </div>
                  <p className="text-gray-600">Correct Answers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatTime(quizData.timeLimit - timeLeft)}
                  </div>
                  <p className="text-gray-600">Time Taken</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">+{points}</div>
                  <p className="text-gray-600">Points Earned</p>
                </div>
              </div>

              <Badge className={`text-lg px-4 py-2 ${getScoreBadgeColor(score)}`}>
                {score >= 80 ? "Excellent!" : score >= 60 ? "Good Job!" : "Keep Practicing!"}
              </Badge>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => window.location.reload()}
                >
                  Retake Quiz
                </Button>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>

              {/* Detailed Results */}
              <div className="mt-8 text-left">
                <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
                <div className="space-y-4">
                  {quizData.questions.map((question: any, index: number) => {
                    const isCorrect = selectedAnswers[index] === question.correctAnswer
                    const userAnswer = selectedAnswers[index]

                    return (
                      <Card
                        key={question.id}
                        className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.question}</p>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">Your answer: </span>
                                  <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                    {userAnswer !== undefined ? question.options[userAnswer] : "No answer"}
                                  </span>
                                </p>
                                {!isCorrect && (
                                  <p>
                                    <span className="font-medium">Correct answer: </span>
                                    <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                                  </p>
                                )}
                                <p className="text-gray-600 italic">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

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
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 60 ? "text-red-600 font-bold" : "text-gray-600"}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  End Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
            <Badge variant="outline">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 ${
                    selectedAnswers[currentQuestion] === index
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {currentQuestion === quizData.questions.length - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Question Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {quizData.questions.map((question: any, index: number) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`aspect-square ${
                    selectedAnswers[index] !== undefined
                      ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200"
                      : ""
                  } ${currentQuestion === index ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : ""}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></span>
              Answered: {selectedAnswers.filter((answer) => answer !== undefined).length}
              <span className="ml-4 inline-block w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></span>
              Remaining: {selectedAnswers.filter((answer) => answer === undefined).length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
