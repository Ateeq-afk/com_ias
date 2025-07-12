'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Clock, Target, Brain, Award, TrendingUp, 
  Mic, Upload, Type, MessageSquare, CheckCircle, AlertTriangle,
  BookOpen, Users, BarChart3, Lightbulb, ArrowRight, Play,
  Zap, Shield, Globe, Cpu
} from 'lucide-react'

interface EvaluationMode {
  id: string
  name: string
  description: string
  icon: any
  features: string[]
  recommended: boolean
}

interface DemoResult {
  question: string
  subject: string
  userAnswer: string
  score: number
  grade: string
  strengths: string[]
  improvements: string[]
  modelAnswer: string
}

export default function AnswerEvaluationPage() {
  const [activeMode, setActiveMode] = useState<string>('text')
  const [selectedDemo, setSelectedDemo] = useState<string>('')
  const [showDemo, setShowDemo] = useState(false)
  const [evaluationStep, setEvaluationStep] = useState(0)
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null)

  const evaluationModes: EvaluationMode[] = [
    {
      id: 'text',
      name: 'Text Input',
      description: 'Type your answer directly with real-time word count and structure guidance',
      icon: Type,
      features: ['Real-time word count', 'Structure templates', 'Auto-save', 'Spell check'],
      recommended: true
    },
    {
      id: 'voice',
      name: 'Voice Input',
      description: 'Speak your answer and get it transcribed with pronunciation feedback',
      icon: Mic,
      features: ['Speech-to-text', 'Pronunciation analysis', 'Pace tracking', 'Clarity scoring'],
      recommended: false
    },
    {
      id: 'upload',
      name: 'Handwritten Upload',
      description: 'Upload images of handwritten answers for OCR and handwriting analysis',
      icon: Upload,
      features: ['OCR recognition', 'Handwriting quality', 'Speed estimation', 'Legibility score'],
      recommended: false
    },
    {
      id: 'structured',
      name: 'Structured Format',
      description: 'Use guided templates for introduction, body, and conclusion',
      icon: FileText,
      features: ['Template guidance', 'Section prompts', 'Flow assistance', 'Balance checker'],
      recommended: true
    }
  ]

  const demoQuestions = [
    {
      id: 'gs1',
      subject: 'GS1 - History',
      question: 'Analyze the significance of the Harappan civilization in understanding early urban planning.',
      sampleAnswer: 'The Harappan civilization represents one of the earliest examples of sophisticated urban planning...',
      wordLimit: 250
    },
    {
      id: 'gs2',
      subject: 'GS2 - Polity',
      question: 'Examine the role of Article 32 in protecting fundamental rights.',
      sampleAnswer: 'Article 32, known as the "Right to Constitutional Remedies," is the heart and soul...',
      wordLimit: 150
    },
    {
      id: 'gs3',
      subject: 'GS3 - Economy',
      question: 'Discuss the impact of digital payment systems on financial inclusion in India.',
      sampleAnswer: 'Digital payment systems have revolutionized financial inclusion in India...',
      wordLimit: 250
    },
    {
      id: 'gs4',
      subject: 'GS4 - Ethics',
      question: 'You discover a government contract was awarded to your friend\'s company. What should you do?',
      sampleAnswer: 'This case presents a classic conflict between personal relationships and professional ethics...',
      wordLimit: 250
    }
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze content, structure, and language for comprehensive evaluation'
    },
    {
      icon: Target,
      title: 'UPSC-Specific Scoring',
      description: 'Evaluation based on actual UPSC marking scheme and examiner preferences'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor improvement over time with detailed analytics and personalized insights'
    },
    {
      icon: BookOpen,
      title: 'Model Answers',
      description: 'Compare with topper answers and get multiple approach variations'
    },
    {
      icon: Users,
      title: 'Peer Comparison',
      description: 'See how you perform against other aspirants at your level'
    },
    {
      icon: Lightbulb,
      title: 'Intelligent Feedback',
      description: 'Actionable suggestions for immediate and long-term improvement'
    }
  ]

  const runDemo = async (questionId: string) => {
    setSelectedDemo(questionId)
    setShowDemo(true)
    setEvaluationStep(0)

    const question = demoQuestions.find(q => q.id === questionId)
    if (!question) return

    // Simulate evaluation steps
    const steps = [
      'Analyzing content relevance...',
      'Evaluating answer structure...',
      'Checking language quality...',
      'Generating feedback...',
      'Preparing model comparison...'
    ]

    for (let i = 0; i < steps.length; i++) {
      setEvaluationStep(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Generate demo result
    setDemoResult({
      question: question.question,
      subject: question.subject,
      userAnswer: question.sampleAnswer,
      score: 78,
      grade: 'B+',
      strengths: [
        'Clear structure with proper introduction and conclusion',
        'Good use of examples and case studies',
        'Appropriate word limit management'
      ],
      improvements: [
        'Include more current affairs references',
        'Strengthen analytical depth in middle paragraphs',
        'Add specific statistics and data points'
      ],
      modelAnswer: 'A comprehensive model answer would include detailed analysis with multiple perspectives, current examples, and specific recommendations...'
    })

    setEvaluationStep(5)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Cpu className="w-4 h-4 mr-2" />
            AI-Powered Answer Evaluation
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            UPSC Answer Writing
            <span className="block text-blue-600">Evaluation System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get instant, detailed feedback on your UPSC Mains answers with our sophisticated AI evaluation engine. 
            Score better, write smarter, succeed faster.
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: FileText, label: 'Answers Evaluated', value: '47,000+' },
            { icon: Users, label: 'Active Users', value: '12,500+' },
            { icon: Award, label: 'Average Improvement', value: '23 Points' },
            { icon: Target, label: 'Success Rate', value: '89%' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <stat.icon className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Evaluation Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose Your Input Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {evaluationModes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  activeMode === mode.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
                onClick={() => setActiveMode(mode.id)}
              >
                {mode.recommended && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <mode.icon className={`w-8 h-8 mb-4 ${
                  activeMode === mode.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <h3 className="font-semibold text-gray-900 mb-2">{mode.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
                <ul className="space-y-1">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Evaluation Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See It In Action
              </h2>
              <p className="text-xl text-blue-100">
                Try our evaluation system with sample UPSC questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {demoQuestions.map((demo) => (
                <motion.button
                  key={demo.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => runDemo(demo.id)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/30 transition-all"
                >
                  <div className="text-sm font-medium text-blue-100 mb-2">{demo.subject}</div>
                  <div className="text-white font-semibold mb-2">{demo.question.substring(0, 60)}...</div>
                  <div className="text-xs text-blue-200">{demo.wordLimit} words</div>
                  <div className="flex items-center mt-3 text-sm text-blue-100">
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Start Free Evaluation
              </button>
            </div>
          </div>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Security & Privacy</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700">End-to-end encryption for all submissions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700">No data sharing with third parties</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700">GDPR compliant data handling</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <span className="text-gray-700">Regular security audits and updates</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <Globe className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Multi-Language Support</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-700">English and Hindi interface support</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-700">Regional language answer evaluation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-700">Cultural context understanding</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-700">Vernacular examples recognition</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gray-50 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Answer Writing?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful UPSC aspirants who improved their scores with our AI-powered evaluation system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-400 transition-colors">
              View Pricing
            </button>
          </div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Live Evaluation Demo</h3>
                <button
                  onClick={() => setShowDemo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {evaluationStep < 5 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                  <div className="mb-6">
                    <div className="text-lg font-medium text-gray-900 mb-2">
                      {['Analyzing content relevance...', 'Evaluating answer structure...', 'Checking language quality...', 'Generating feedback...', 'Preparing model comparison...'][evaluationStep]}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(evaluationStep + 1) * 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : demoResult && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{demoResult.subject}</h4>
                    <p className="text-gray-700">{demoResult.question}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{demoResult.score}/100</div>
                      <div className="text-blue-800 font-medium">Overall Score</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{demoResult.grade}</div>
                      <div className="text-green-800 font-medium">Grade</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">82nd</div>
                      <div className="text-purple-800 font-medium">Percentile</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Strengths
                      </h5>
                      <ul className="space-y-2">
                        {demoResult.strengths.map((strength, index) => (
                          <li key={index} className="text-green-700 text-sm">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h5 className="font-semibold text-orange-800 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Areas for Improvement
                      </h5>
                      <ul className="space-y-2">
                        {demoResult.improvements.map((improvement, index) => (
                          <li key={index} className="text-orange-700 text-sm">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      onClick={() => setShowDemo(false)}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Try Full Evaluation
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}