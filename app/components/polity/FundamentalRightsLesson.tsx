'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, X, Lightbulb, Clock, Target, Award, Sparkles, ArrowRight, BookOpen, Brain, Zap } from 'lucide-react'
import RightsMatcher from './RightsMatcher'

// Types
interface LessonProgress {
  currentSection: number
  completedSections: number[]
  conceptsMastered: number
  totalConcepts: number
  timeSpent: number
  accuracy: number
  hintsUsed: number
  questionsAttempted: number
  questionsCorrect: number
}

interface RightInfo {
  id: string
  name: string
  articles: string
  description: string
  icon: string
}

const fundamentalRights: RightInfo[] = [
  {
    id: 'equality',
    name: 'Right to Equality',
    articles: 'Articles 14-18',
    description: 'Equality before law, prohibition of discrimination, equality of opportunity',
    icon: '⚖️'
  },
  {
    id: 'freedom',
    name: 'Right to Freedom',
    articles: 'Articles 19-22',
    description: 'Freedom of speech, assembly, movement, residence, profession, and personal liberty',
    icon: '🕊️'
  },
  {
    id: 'exploitation',
    name: 'Right Against Exploitation',
    articles: 'Articles 23-24',
    description: 'Prohibition of traffic in human beings, forced labor, and child labor',
    icon: '🛡️'
  },
  {
    id: 'religion',
    name: 'Right to Freedom of Religion',
    articles: 'Articles 25-28',
    description: 'Freedom of conscience, practice, and propagation of religion',
    icon: '🕉️'
  },
  {
    id: 'cultural',
    name: 'Cultural and Educational Rights',
    articles: 'Articles 29-30',
    description: 'Protection of interests of minorities, right to establish educational institutions',
    icon: '🎓'
  },
  {
    id: 'constitutional',
    name: 'Right to Constitutional Remedies',
    articles: 'Article 32',
    description: 'Right to move Supreme Court for enforcement of fundamental rights',
    icon: '⚡'
  }
]

// Progress Ring Component
const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({ 
  progress, 
  size = 60, 
  strokeWidth = 3,
  color = '#0066CC' 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold" style={{ color }}>{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// Rights Card Component
const RightsCard: React.FC<{ 
  right: RightInfo; 
  isFlipped: boolean; 
  onFlip: () => void;
  isCompleted: boolean;
  index: number;
}> = ({ right, isFlipped, onFlip, isCompleted, index }) => {
  return (
    <motion.div
      className="relative h-56 cursor-pointer"
      onClick={onFlip}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            className={`absolute inset-0 rounded-2xl p-6 ${
              isCompleted 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100/50' 
                : 'bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/50'
            }`}
            style={{ 
              border: isCompleted ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255, 255, 255, 0.5)',
              transformStyle: 'preserve-3d'
            }}
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between">
                <span className="text-4xl mb-3 block filter drop-shadow-sm">{right.icon}</span>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 rounded-full p-1"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{right.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{right.articles}</p>
              <div className="mt-auto pt-4">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  Tap to learn more <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl filter drop-shadow-lg">{right.icon}</span>
                <BookOpen className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-sm leading-relaxed flex-grow">{right.description}</p>
              <div className="mt-auto pt-4 border-t border-white/20">
                <p className="text-xs opacity-80 flex items-center gap-1">
                  Tap to flip back <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Quiz Question Component
interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  hint: string
}

const QuizCard: React.FC<{
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
  showHint: boolean
  onHintRequest: () => void
}> = ({ question, onAnswer, showHint, onHintRequest }) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelected(index)
    setShowResult(true)
    const isCorrect = index === question.correct
    setTimeout(() => {
      onAnswer(isCorrect)
      setSelected(null)
      setShowResult(false)
    }, 2500)
  }

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 leading-tight">{question.question}</h3>
      
      {showHint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl flex items-start gap-3"
        >
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-700 font-medium">{question.hint}</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {question.options.map((option, index) => {
          const isSelected = selected === index
          const isCorrect = index === question.correct
          const showCorrect = showResult && isSelected && isCorrect
          const showIncorrect = showResult && isSelected && !isCorrect
          
          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden ${
                showCorrect
                  ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50'
                  : showIncorrect
                  ? 'border-red-400 bg-gradient-to-r from-red-50 to-rose-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50'
              }`}
              whileHover={!showResult ? { scale: 1.02, y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              animate={showIncorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={showIncorrect ? { duration: 0.4 } : { duration: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800 pr-4">{option}</span>
                {showResult && isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {isCorrect ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {showResult && selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Explanation</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {!showResult && !showHint && (
        <motion.button
          onClick={onHintRequest}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto"
        >
          <Lightbulb className="w-4 h-4" />
          Need a hint?
        </motion.button>
      )}
    </motion.div>
  )
}

// Main Lesson Component
export default function FundamentalRightsLesson() {
  const [progress, setProgress] = useState<LessonProgress>({
    currentSection: 0,
    completedSections: [],
    conceptsMastered: 0,
    totalConcepts: 6,
    timeSpent: 0,
    accuracy: 100,
    hintsUsed: 0,
    questionsAttempted: 0,
    questionsCorrect: 0
  })

  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set())
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const sections = [
    { id: 'hook', title: 'Introduction', icon: '🎯' },
    { id: 'concepts', title: 'Six Fundamental Rights', icon: '📚' },
    { id: 'matching', title: 'Rights Matcher', icon: '🔗' },
    { id: 'quiz', title: 'Practice Questions', icon: '✏️' },
    { id: 'summary', title: 'Lesson Summary', icon: '🎉' }
  ]

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which Fundamental Right is known as the "heart and soul" of the Constitution according to Dr. B.R. Ambedkar?',
      options: [
        'Right to Equality',
        'Right to Freedom',
        'Right to Constitutional Remedies',
        'Right to Freedom of Religion'
      ],
      correct: 2,
      explanation: 'Dr. Ambedkar called Article 32 (Right to Constitutional Remedies) the "heart and soul" of the Constitution as it provides the mechanism to enforce all other fundamental rights.',
      hint: 'Think about which right helps you enforce all other rights when they are violated.'
    },
    {
      id: 'q2',
      question: 'The Right to Property was removed from Fundamental Rights by which Constitutional Amendment?',
      options: [
        '42nd Amendment',
        '44th Amendment',
        '52nd Amendment',
        '61st Amendment'
      ],
      correct: 1,
      explanation: 'The 44th Constitutional Amendment Act, 1978 removed the Right to Property from the list of Fundamental Rights and made it a legal right under Article 300A.',
      hint: 'This amendment was passed during the Janata Party government to reverse some changes made during the Emergency.'
    }
  ]

  const handleCardFlip = (rightId: string) => {
    const newFlipped = new Set(flippedCards)
    if (flippedCards.has(rightId)) {
      newFlipped.delete(rightId)
    } else {
      newFlipped.add(rightId)
    }
    setFlippedCards(newFlipped)
    
    // Mark as completed if not already
    if (!completedCards.has(rightId)) {
      setCompletedCards(prev => new Set(prev).add(rightId))
      setProgress(prev => ({
        ...prev,
        conceptsMastered: prev.conceptsMastered + 1
      }))
    }
  }

  const handleQuizAnswer = (correct: boolean) => {
    setProgress(prev => ({
      ...prev,
      questionsAttempted: prev.questionsAttempted + 1,
      questionsCorrect: correct ? prev.questionsCorrect + 1 : prev.questionsCorrect,
      accuracy: Math.round(((correct ? prev.questionsCorrect + 1 : prev.questionsCorrect) / (prev.questionsAttempted + 1)) * 100)
    }))
    
    if (currentQuiz < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuiz(prev => prev + 1)
        setShowHint(false)
      }, 2500)
    } else {
      setTimeout(() => {
        setProgress(prev => ({ ...prev, currentSection: 4 }))
      }, 2500)
    }
  }

  const handleHintRequest = () => {
    setShowHint(true)
    setProgress(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const overallProgress = Math.round(
    ((progress.completedSections.length + (progress.conceptsMastered / progress.totalConcepts)) / sections.length) * 100
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProgressRing progress={overallProgress} size={56} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Fundamental Rights
                </h1>
                <p className="text-sm text-gray-500 font-medium">Lesson 1 of 5 • Polity Module</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{formatTime(progress.timeSpent)}</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-50/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{progress.accuracy}% accuracy</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-purple-50/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">{progress.conceptsMastered}/{progress.totalConcepts} mastered</span>
              </motion.div>
            </div>
          </div>

          {/* Section Progress */}
          <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (index <= progress.currentSection) {
                      setProgress(prev => ({ ...prev, currentSection: index }))
                    }
                  }}
                  disabled={index > progress.currentSection && !progress.completedSections.includes(index)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                    index === progress.currentSection
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200/50'
                      : index < progress.currentSection || progress.completedSections.includes(index)
                      ? 'bg-green-100/80 text-green-700 hover:bg-green-200/80 backdrop-blur-sm'
                      : 'bg-gray-100/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span>{section.title}</span>
                  {(index < progress.currentSection || progress.completedSections.includes(index)) && 
                    index !== progress.currentSection && (
                    <Check className="w-4 h-4 ml-1" />
                  )}
                </motion.button>
                {index < sections.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Section 0: Hook */}
          {progress.currentSection === 0 && (
            <motion.div
              key="hook"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <motion.div 
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Did You Know?</span>
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-8 leading-tight">
                  The Right to Property is no longer a Fundamental Right?
                </h2>
                
                <motion.div 
                  className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm border border-blue-100 p-8 rounded-2xl mb-8"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Historical Insight</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Until 1978, Indians had the Right to Property as a Fundamental Right. The 44th Amendment changed this, 
                        making it just a legal right. This is one of the most significant changes to our Fundamental Rights!
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    { value: '7/10', label: 'UPSC papers featured this topic', color: 'blue', icon: '📊' },
                    { value: '15 min', label: 'to master 6 rights', color: 'green', icon: '⏱️' },
                    { value: '3', label: 'interactive exercises', color: 'purple', icon: '🎯' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-lg shadow-gray-100/50"
                    >
                      <span className="text-3xl mb-3 block">{stat.icon}</span>
                      <p className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>{stat.value}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                    What you&apos;ll master
                  </h3>
                  <div className="space-y-4 mb-10">
                    {[
                      'All 6 Fundamental Rights with their article numbers',
                      'Key features and limitations of each right',
                      'How to answer UPSC questions on Fundamental Rights'
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-100"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => {
                    setProgress(prev => ({ 
                      ...prev, 
                      currentSection: 1,
                      completedSections: [...prev.completedSections, 0]
                    }))
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-5 px-8 rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all flex items-center justify-center gap-3 group"
                >
                  <span>Let&apos;s Begin</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Section 1: Concepts */}
          {progress.currentSection === 1 && (
            <motion.div
              key="concepts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  The Six Fundamental Rights
                </h2>
                <p className="text-gray-600 text-lg">Tap each card to discover the constitutional provisions</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {fundamentalRights.map((right, index) => (
                  <RightsCard
                    key={right.id}
                    right={right}
                    isFlipped={flippedCards.has(right.id)}
                    onFlip={() => handleCardFlip(right.id)}
                    isCompleted={completedCards.has(right.id)}
                    index={index}
                  />
                ))}
              </div>

              {completedCards.size === fundamentalRights.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 text-center shadow-xl shadow-green-100/50"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Brilliant! All rights explored! 🎉</h3>
                  <p className="text-gray-600 mb-6">You&apos;ve mastered all 6 Fundamental Rights</p>
                  <motion.button
                    onClick={() => {
                      setProgress(prev => ({ 
                        ...prev, 
                        currentSection: 2,
                        completedSections: [...prev.completedSections, 1]
                      }))
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg shadow-green-200/50 hover:shadow-xl transition-all inline-flex items-center gap-2"
                  >
                    Continue to Rights Matcher
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Section 2: Rights Matcher */}
          {progress.currentSection === 2 && (
            <motion.div
              key="matching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <RightsMatcher 
                onComplete={(stats) => {
                  // Update progress with matcher stats
                  setProgress(prev => ({
                    ...prev,
                    hintsUsed: prev.hintsUsed + stats.hintsUsed,
                    currentSection: 3,
                    completedSections: [...prev.completedSections, 2]
                  }))
                }}
              />
            </motion.div>
          )}

          {/* Section 3: Quiz */}
          {progress.currentSection === 3 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Practice Questions
                </h2>
                <p className="text-gray-600 text-lg mb-6">Test your understanding with UPSC-style questions</p>
                <div className="flex items-center justify-center gap-3">
                  {quizQuestions.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`transition-all ${
                        index === currentQuiz
                          ? 'w-10 h-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600'
                          : index < currentQuiz
                          ? 'w-3 h-3 rounded-full bg-green-500'
                          : 'w-3 h-3 rounded-full bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <QuizCard
                question={quizQuestions[currentQuiz]}
                onAnswer={handleQuizAnswer}
                showHint={showHint}
                onHintRequest={handleHintRequest}
              />
            </motion.div>
          )}

          {/* Section 4: Summary */}
          {progress.currentSection === 4 && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div 
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div 
                  className="text-center mb-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                    Lesson Complete! 🎉
                  </h2>
                  <p className="text-xl text-gray-600">You&apos;ve mastered Fundamental Rights</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {[
                    { icon: Clock, color: 'blue', value: formatTime(progress.timeSpent), label: 'Time taken' },
                    { icon: Target, color: 'green', value: `${progress.accuracy}%`, label: 'Accuracy' },
                    { icon: Brain, color: 'purple', value: progress.conceptsMastered, label: 'Concepts mastered' },
                    { icon: Lightbulb, color: 'orange', value: progress.hintsUsed, label: 'Hints used' }
                  ].map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`bg-${stat.color}-50/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-${stat.color}-100`}
                      >
                        <Icon className={`w-8 h-8 text-${stat.color}-600 mx-auto mb-3`} />
                        <p className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</p>
                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      </motion.div>
                    )
                  })}
                </div>

                <motion.div 
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="font-bold text-xl text-gray-900 mb-5 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    Key Takeaways
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Six Fundamental Rights are guaranteed by Part III of the Constitution',
                      'Article 32 provides remedies for enforcement of all rights',
                      'Rights come with reasonable restrictions in public interest'
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-8 mb-8 border border-yellow-200"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="font-bold text-xl text-gray-900 mb-5 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    Common Mistakes to Avoid
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Don&apos;t confuse Directive Principles with Fundamental Rights",
                      'Remember Right to Property is now only a legal right',
                      'Article numbers are crucial for UPSC answers'
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-yellow-600 text-sm">⚠️</span>
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <motion.button 
                    className="flex-1 bg-gray-100/80 backdrop-blur-sm text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-200/80 transition-all border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Review Lesson
                  </motion.button>
                  <motion.button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 transition-all flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next Lesson: The Parliament
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}