'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, ChevronLeft, ChevronRight, Flag, Grid, 
  AlertCircle, CheckCircle, XCircle, RotateCcw,
  Pause, Play, Send
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock test data
const mockTest = {
  id: 1,
  title: 'UPSC Prelims Mock Test #1',
  duration: 120, // minutes
  questions: [
    {
      id: 1,
      question: 'The Right to Property was removed from the list of Fundamental Rights by which Constitutional Amendment?',
      options: [
        '42nd Amendment',
        '44th Amendment',
        '52nd Amendment',
        '61st Amendment'
      ],
      correctAnswer: 1,
      explanation: 'The 44th Constitutional Amendment Act, 1978 removed the Right to Property from the list of Fundamental Rights.',
      marks: 2,
      negativeMarks: 0.66
    },
    {
      id: 2,
      question: 'Which of the following is NOT a Fundamental Right under the Indian Constitution?',
      options: [
        'Right to Equality',
        'Right to Freedom',
        'Right to Property',
        'Right to Constitutional Remedies'
      ],
      correctAnswer: 2,
      explanation: 'Right to Property is no longer a Fundamental Right after the 44th Amendment.',
      marks: 2,
      negativeMarks: 0.66
    },
    // Add more questions as needed
  ]
}

type QuestionStatus = 'not-visited' | 'answered' | 'marked' | 'answered-marked'

interface Answer {
  questionId: number
  selectedOption: number | null
  isMarked: boolean
  timeSpent: number
}

export default function TestEnginePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map())
  const [timeLeft, setTimeLeft] = useState(mockTest.duration * 60) // in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Timer effect
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPaused, timeLeft])

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTime(Date.now())
  }, [currentQuestion])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getQuestionStatus = (index: number): QuestionStatus => {
    const answer = answers.get(index)
    if (!answer) return 'not-visited'
    if (answer.selectedOption !== null && answer.isMarked) return 'answered-marked'
    if (answer.selectedOption !== null) return 'answered'
    if (answer.isMarked) return 'marked'
    return 'not-visited'
  }

  const updateAnswer = (questionId: number, selectedOption: number | null, isMarked?: boolean) => {
    const timeSpent = Date.now() - questionStartTime
    const currentAnswer = answers.get(questionId) || { questionId, selectedOption: null, isMarked: false, timeSpent: 0 }
    
    setAnswers(new Map(answers.set(questionId, {
      ...currentAnswer,
      selectedOption: selectedOption !== undefined ? selectedOption : currentAnswer.selectedOption,
      isMarked: isMarked !== undefined ? isMarked : currentAnswer.isMarked,
      timeSpent: currentAnswer.timeSpent + timeSpent
    })))
  }

  const handleNext = () => {
    if (currentQuestion < mockTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const confirmed = window.confirm('Are you sure you want to submit the test?')
      if (!confirmed) return
    }

    setIsSubmitting(true)
    
    // Calculate score
    let correctAnswers = 0
    let wrongAnswers = 0
    let totalMarks = 0
    
    mockTest.questions.forEach((question, index) => {
      const answer = answers.get(index)
      if (answer?.selectedOption !== null && answer?.selectedOption !== undefined) {
        if (answer.selectedOption === question.correctAnswer) {
          correctAnswers++
          totalMarks += question.marks
        } else {
          wrongAnswers++
          totalMarks -= question.negativeMarks
        }
      }
    })

    const attempted = correctAnswers + wrongAnswers
    const unattempted = mockTest.questions.length - attempted
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Test submitted successfully!')
      // Navigate to results page with score data
      router.push(`/dashboard/tests/${params.id}/results?score=${totalMarks}&correct=${correctAnswers}&wrong=${wrongAnswers}&unattempted=${unattempted}`)
    }, 1000)
  }

  const question = mockTest.questions[currentQuestion]
  const answer = answers.get(currentQuestion)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">{mockTest.title}</h1>
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <Grid className="w-4 h-4 inline mr-1" />
                Review
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>

              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4 inline mr-2" />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestion + 1} of {mockTest.questions.length}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    {question.marks} marks
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                    -{question.negativeMarks}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-4 mb-8">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => updateAnswer(currentQuestion, index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answer?.selectedOption === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answer?.selectedOption === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answer?.selectedOption === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800">{String.fromCharCode(65 + index)}. {option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAnswer(currentQuestion, null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-2" />
                    Clear
                  </button>
                  <button
                    onClick={() => updateAnswer(currentQuestion, answer?.selectedOption || null, !answer?.isMarked)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      answer?.isMarked
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Flag className="w-4 h-4 inline mr-2" />
                    {answer?.isMarked ? 'Unmark' : 'Mark for Review'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentQuestion === mockTest.questions.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                <span className="text-gray-600">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                <span className="text-gray-600">Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
                <span className="text-gray-600">Answered & Marked</span>
              </div>
            </div>

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
              {mockTest.questions.map((_, index) => {
                const status = getQuestionStatus(index)
                const colors = {
                  'not-visited': 'bg-gray-300 text-gray-700',
                  'answered': 'bg-green-500 text-white',
                  'marked': 'bg-orange-500 text-white',
                  'answered-marked': 'bg-purple-500 text-white'
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-all hover:scale-105 ${
                      colors[status]
                    } ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Answered</span>
                <span className="font-medium text-gray-900">
                  {Array.from(answers.values()).filter(a => a.selectedOption !== null).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Not Answered</span>
                <span className="font-medium text-gray-900">
                  {mockTest.questions.length - Array.from(answers.values()).filter(a => a.selectedOption !== null).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marked for Review</span>
                <span className="font-medium text-gray-900">
                  {Array.from(answers.values()).filter(a => a.isMarked).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}