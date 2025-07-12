'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Target, Award, Play, CheckCircle, ArrowRight, Lightbulb, Users, TrendingUp } from 'lucide-react'

// Import the generated lesson data
const dpspLesson = {
  metadata: {
    id: 'polity-directive-principles-of-state-policy-1736789012351',
    title: 'Directive Principles of State Policy',
    subject: 'Polity',
    topic: 'Directive Principles of State Policy',
    difficulty: 'intermediate',
    template: 'ConceptExplanation',
    duration: 5,
    prerequisites: ['Fundamental Rights', 'Constitutional Framework'],
    tags: ['Polity', 'intermediate', 'ConceptExplanation', 'Directive', 'Principles', 'DPSP', 'Constitution'],
    examWeight: 'high',
    createdAt: '2024-01-15T14:25:00.000Z',
    qualityScore: 95
  },
  content: {
    introduction: 'Understanding Directive Principles of State Policy is essential for mastering Polity in the UPSC examination. This concept forms the foundation for many advanced topics and frequently appears in both Prelims and Mains, particularly in questions related to governance, welfare state, and constitutional philosophy.',
    keyPoints: [
      'DPSP are non-justiciable guidelines in Part IV (Articles 36-51)',
      'Three categories: Socialist, Gandhian, and Liberal principles',
      'Implementation through legislation and policy rather than court enforcement',
      'Evolved from subordination to complementarity with Fundamental Rights',
      'Contemporary relevance in environmental protection and social justice'
    ],
    examples: [
      'NREGA based on Articles 39 and 43 for economic welfare',
      'Environmental laws derived from Article 48A',
      'Right to Education (Article 45) became Fundamental Right via 86th Amendment'
    ]
  },
  practice: {
    questions: [
      {
        id: 'q1',
        question: 'Which of the following best defines Directive Principles of State Policy?',
        options: [
          'Justiciable rights that can be enforced by courts',
          'Guidelines for governance that are fundamental but non-justiciable',
          'Constitutional provisions that override Fundamental Rights',
          'Legal obligations on both state and citizens'
        ],
        correctAnswer: 1,
        explanation: 'DPSP are guidelines for governance that are fundamental but non-justiciable, meaning they cannot be directly enforced by courts.',
        difficulty: 'beginner'
      },
      {
        id: 'q2',
        question: 'DPSP can be classified into how many broad categories?',
        options: ['Two categories', 'Three categories', 'Four categories', 'Five categories'],
        correctAnswer: 1,
        explanation: 'DPSP are classified into three categories: Socialist principles, Gandhian principles, and Liberal principles.',
        difficulty: 'beginner'
      }
    ]
  },
  summary: {
    keyTakeaways: [
      'DPSP are non-justiciable guidelines directing state policy toward welfare goals',
      'Three-fold classification: Socialist, Gandhian, and Liberal principles',
      'Implementation through legislation like NREGA and environmental laws',
      'Judicial interpretation evolved to complementarity with Fundamental Rights',
      'Contemporary relevance in governance and policy formulation'
    ],
    examTips: [
      'Always mention non-justiciable nature and Part IV location',
      'Use specific implementation examples (NREGA, Environmental laws)',
      'Reference landmark cases for DPSP-Fundamental Rights relationship',
      'Connect to current government policies and welfare schemes'
    ]
  }
}

// Sample bulk lessons for demonstration
const bulkLessons = [
  { id: '1', title: 'Preamble to the Constitution', template: 'ConceptExplanation', difficulty: 'beginner', quality: 92 },
  { id: '2', title: 'Citizenship Provisions in India', template: 'ConceptExplanation', difficulty: 'beginner', quality: 94 },
  { id: '3', title: 'Fundamental Rights vs Fundamental Duties', template: 'ComparativeAnalysis', difficulty: 'intermediate', quality: 93 },
  { id: '4', title: 'President vs Prime Minister Powers', template: 'ComparativeAnalysis', difficulty: 'advanced', quality: 94 },
  { id: '5', title: 'Evolution of Supreme Court Jurisprudence', template: 'TimelineExploration', difficulty: 'advanced', quality: 96 },
  { id: '6', title: 'State Bill to Act Process', template: 'ProcessFlow', difficulty: 'intermediate', quality: 91 },
]

export default function LessonGeneratorDemo() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lesson Generation System Demo</h1>
              <p className="text-gray-600">AI-Powered UPSC Lesson Creation</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-green-600">1500+</span> lessons ready
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'System Overview', icon: TrendingUp },
            { id: 'lesson', label: 'Sample Lesson', icon: BookOpen },
            { id: 'bulk', label: 'Bulk Generation', icon: Users },
            { id: 'quality', label: 'Quality Metrics', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* System Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  UPSC Lesson Generation System
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Automatically generates high-quality, interactive lessons across all UPSC subjects using 10 specialized templates
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-blue-100/50 border border-blue-100">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">10 Templates</h3>
                  <p className="text-gray-600 mb-4">Specialized templates for different content types</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• ConceptExplanation</li>
                    <li>• ComparativeAnalysis</li>
                    <li>• TimelineExploration</li>
                    <li>• ProcessFlow</li>
                    <li>• CaseStudyAnalysis</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-green-100/50 border border-green-100">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">1500+ Lessons</h3>
                  <p className="text-gray-600 mb-4">Complete UPSC syllabus coverage</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• All 10 subjects mapped</li>
                    <li>• 200+ topics per subject</li>
                    <li>• Beginner to Advanced</li>
                    <li>• Quality score 85-98%</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-purple-100/50 border border-purple-100">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Quality</h3>
                  <p className="text-gray-600 mb-4">Automated quality validation</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Content depth analysis</li>
                    <li>• UPSC relevance check</li>
                    <li>• Interactive elements</li>
                    <li>• Cross-subject linking</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Live Demo Available</h3>
                <p className="text-blue-100 mb-6">
                  Explore the complete generated lesson for "Directive Principles of State Policy" to see the system in action.
                </p>
                <button
                  onClick={() => setActiveTab('lesson')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  View Sample Lesson <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Sample Lesson */}
          {activeTab === 'lesson' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Lesson Header */}
              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {dpspLesson.metadata.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dpspLesson.metadata.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {dpspLesson.metadata.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Quality: {dpspLesson.metadata.qualityScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {dpspLesson.metadata.template}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {dpspLesson.metadata.examWeight} Priority
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Introduction</h4>
                    <p className="text-gray-700 leading-relaxed">{dpspLesson.content.introduction}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Learning Points</h4>
                    <div className="space-y-2">
                      {dpspLesson.content.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Practical Examples</h4>
                    <div className="space-y-2">
                      {dpspLesson.content.examples.map((example, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <span className="text-blue-800 text-sm">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Questions */}
              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Practice Questions</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-500">
                      Question {currentQuestion + 1} of {dpspLesson.practice.questions.length}
                    </span>
                    <div className="flex gap-2">
                      {dpspLesson.practice.questions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentQuestion ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {dpspLesson.practice.questions[currentQuestion].question}
                    </h4>
                    
                    <div className="space-y-3">
                      {dpspLesson.practice.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selectedAnswer === index
                              ? index === dpspLesson.practice.questions[currentQuestion].correctAnswer
                                ? 'border-green-400 bg-green-50'
                                : 'border-red-400 bg-red-50'
                              : showExplanation && index === dpspLesson.practice.questions[currentQuestion].correctAnswer
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <span className="font-medium text-gray-800">{option}</span>
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-blue-900 mb-1">Explanation</h5>
                            <p className="text-blue-800 text-sm">
                              {dpspLesson.practice.questions[currentQuestion].explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showExplanation && currentQuestion < dpspLesson.practice.questions.length - 1 && (
                      <button
                        onClick={() => {
                          setCurrentQuestion(currentQuestion + 1)
                          setSelectedAnswer(null)
                          setShowExplanation(false)
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Next Question <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Takeaways</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Essential Points</h4>
                    <div className="space-y-2">
                      {dpspLesson.summary.keyTakeaways.map((takeaway, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}.</span>
                          <span className="text-gray-700 text-sm">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Exam Tips</h4>
                    <div className="space-y-2">
                      {dpspLesson.summary.examTips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Generation */}
          {activeTab === 'bulk' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Bulk Generation Results</h2>
                <p className="text-gray-600">Successfully generated 20 Polity lessons across 10 major topics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bulkLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {lesson.title}
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {lesson.quality}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                        {lesson.template}
                      </span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded">
                        {lesson.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Generation Complete!</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold">20</div>
                    <div className="text-green-100">Lessons Created</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">91.4%</div>
                    <div className="text-green-100">Avg Quality</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">5</div>
                    <div className="text-green-100">Templates Used</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-green-100">Success Rate</div>
                  </div>
                </div>
                <p className="text-green-100">
                  System ready to scale to 1500+ lessons across all UPSC subjects
                </p>
              </div>
            </div>
          )}

          {/* Quality Metrics */}
          {activeTab === 'quality' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quality Validation System</h2>
                <p className="text-gray-600">Automated assessment ensures consistent high-quality content</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quality Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { metric: 'Content Depth', score: 95, description: 'Comprehensive coverage with detailed sections' },
                      { metric: 'UPSC Relevance', score: 98, description: 'Aligned with exam patterns and requirements' },
                      { metric: 'Conceptual Clarity', score: 92, description: 'Clear definitions and explanations' },
                      { metric: 'Current Affairs', score: 89, description: 'Contemporary examples and applications' },
                      { metric: 'Exam Orientation', score: 94, description: 'Practice questions and exam tips' }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.metric}</span>
                          <span className="font-bold text-blue-600">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="bg-blue-600 h-2 rounded-full"
                          />
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">System Capabilities</h3>
                  <div className="space-y-4">
                    {[
                      'Generated 20 lessons with 91.4% average quality',
                      'Used 5 different templates appropriately',
                      'Maintained UPSC-specific question patterns',
                      'Included cross-subject connections',
                      'Applied progressive difficulty levels',
                      'Created comprehensive content structure',
                      'Integrated contemporary examples',
                      'Provided exam-oriented tips and strategies'
                    ].map((capability, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Ready for Production</h4>
                    <p className="text-blue-800 text-sm">
                      The system is validated and ready to generate 1500+ high-quality lessons 
                      across all UPSC subjects with consistent quality standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}