'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Clock, Target, TrendingUp, Calendar,
  ChevronRight, Filter, Search, BookOpen, Award
} from 'lucide-react'
import Link from 'next/link'

// UPSC Test Series Data
const mockTests = [
  {
    id: 1,
    title: 'UPSC Prelims 2025 - Full Mock Test 1',
    type: 'FULL_LENGTH',
    subject: 'All Subjects',
    questions: 100,
    duration: 120,
    difficulty: 'INTERMEDIATE',
    attempts: 1847,
    avgScore: 64,
    isFree: true,
    deadline: null
  },
  {
    id: 2,
    title: 'Article 32 & Fundamental Rights',
    type: 'SUBJECT',
    subject: 'Polity',
    questions: 25,
    duration: 30,
    difficulty: 'BEGINNER',
    attempts: 3264,
    avgScore: 73,
    isFree: true,
    deadline: null
  },
  {
    id: 3,
    title: 'Current Affairs - January 2025',
    type: 'PRACTICE',
    subject: 'Current Affairs',
    questions: 50,
    duration: 60,
    difficulty: 'INTERMEDIATE',
    attempts: 2156,
    avgScore: 58,
    isFree: false,
    deadline: '2025-01-31'
  },
  {
    id: 4,
    title: 'Harappan Civilization & Indus Valley',
    type: 'SUBJECT',
    subject: 'History',
    questions: 30,
    duration: 35,
    difficulty: 'BEGINNER',
    attempts: 2847,
    avgScore: 69,
    isFree: false,
    deadline: null
  },
  {
    id: 5,
    title: 'Indian Monsoon System & Climate',
    type: 'SUBJECT',
    subject: 'Geography',
    questions: 35,
    duration: 40,
    difficulty: 'INTERMEDIATE',
    attempts: 1923,
    avgScore: 71,
    isFree: true,
    deadline: null
  },
  {
    id: 6,
    title: 'Economic Survey 2024 Highlights',
    type: 'SUBJECT',
    subject: 'Economy',
    questions: 40,
    duration: 45,
    difficulty: 'ADVANCED',
    attempts: 1456,
    avgScore: 62,
    isFree: false,
    deadline: '2025-02-15'
  }
]

const testTypes = ['ALL', 'FULL_LENGTH', 'SUBJECT', 'PRACTICE', 'MOCK']
const subjects = ['All Subjects', 'History', 'Geography', 'Polity', 'Economy', 'Current Affairs']
const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function TestsPage() {
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTests = mockTests.filter(test => {
    if (selectedType !== 'ALL' && test.type !== selectedType) return false
    if (selectedSubject !== 'All Subjects' && test.subject !== selectedSubject) return false
    if (selectedDifficulty !== 'ALL' && test.difficulty !== selectedDifficulty) return false
    if (searchQuery && !test.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Series</h1>
        <p className="text-gray-600">Practice with our comprehensive test series and track your progress</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FileText, label: 'Tests Available', value: '847', color: 'blue' },
          { icon: Target, label: 'Tests Attempted', value: '23', color: 'green' },
          { icon: TrendingUp, label: 'Average Score', value: '68%', color: 'purple' },
          { icon: Award, label: 'Best Score', value: '84%', color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-200/50"
          >
            <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-3`} />
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-200/50 mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filter Tests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          >
            {testTypes.map(type => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff === 'ALL' ? 'All Levels' : diff}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Test List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {test.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {test.questions} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.duration} mins
                    </span>
                  </div>
                </div>
                {test.isFree && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    FREE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Difficulty</p>
                  <p className="text-sm font-medium text-gray-900">{test.difficulty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Attempts</p>
                  <p className="text-sm font-medium text-gray-900">{test.attempts}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Score</p>
                  <p className="text-sm font-medium text-gray-900">{test.avgScore}%</p>
                </div>
              </div>

              {test.deadline && (
                <div className="flex items-center gap-2 mb-4 text-sm text-orange-600">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {test.deadline}</span>
                </div>
              )}

              <Link
                href={`/dashboard/tests/${test.id}`}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                Start Test
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}