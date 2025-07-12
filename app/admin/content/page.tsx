'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Plus, Search, Filter, Download, Upload, Edit3, Trash2,
  Eye, MoreVertical, Clock, Users, Star, TrendingUp, BookOpen,
  Video, Image, FileAudio, FileCode, Calendar, Tag, CheckCircle,
  AlertCircle, XCircle, BarChart3, Target, Globe, Zap
} from 'lucide-react'
import type { ContentItem, ContentAnalytics } from '../types'

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: 'content-001',
    title: 'Article 32 and Fundamental Rights',
    type: 'lesson',
    subject: 'Polity',
    topic: 'Fundamental Rights',
    difficulty: 'medium',
    duration: 45,
    status: 'published',
    author: 'Dr. Rajesh Kumar',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-22'),
    content: 'Comprehensive overview of Article 32...',
    metadata: {
      wordCount: 2500,
      readingTime: 12,
      keywords: ['Article 32', 'Fundamental Rights', 'Constitution'],
      targetAudience: ['UPSC Aspirants'],
      revisionNumber: 3,
      lastReviewer: 'Prof. Sharma',
      reviewNotes: 'Content approved with minor suggestions',
      seoTitle: 'Article 32 Fundamental Rights UPSC',
      seoDescription: 'Complete guide to Article 32 and Fundamental Rights for UPSC preparation'
    },
    analytics: {
      views: 23847,
      uniqueViews: 18234,
      completions: 16789,
      averageTimeSpent: 780,
      dropOffPoints: [],
      ratings: [],
      comments: [],
      shareCount: 456,
      downloadCount: 234
    },
    tags: ['High Priority', 'Popular'],
    prerequisites: ['Basic Constitutional Knowledge'],
    learningObjectives: [
      'Understand Article 32 provisions',
      'Learn about constitutional remedies',
      'Analyze landmark cases'
    ]
  },
  {
    id: 'content-002',
    title: 'UPSC Prelims Mock Test 2024',
    type: 'test',
    subject: 'General Studies',
    topic: 'Mixed Topics',
    difficulty: 'hard',
    duration: 120,
    status: 'published',
    author: 'Test Team',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    publishedAt: new Date('2024-02-10'),
    content: '100 questions covering all GS topics...',
    metadata: {
      wordCount: 5000,
      readingTime: 25,
      keywords: ['UPSC', 'Prelims', 'Mock Test', 'General Studies'],
      targetAudience: ['UPSC Aspirants'],
      revisionNumber: 2,
      lastReviewer: 'Dr. Agarwal',
      reviewNotes: 'Test quality verified',
      seoTitle: 'UPSC Prelims Mock Test 2024',
      seoDescription: 'Complete UPSC Prelims mock test with 100 questions'
    },
    analytics: {
      views: 34567,
      uniqueViews: 28934,
      completions: 12456,
      averageTimeSpent: 6840,
      dropOffPoints: [],
      ratings: [],
      comments: [],
      shareCount: 789,
      downloadCount: 567
    },
    tags: ['Featured', 'High Engagement'],
    prerequisites: ['GS Foundation'],
    learningObjectives: [
      'Practice exam-level questions',
      'Assess preparation level',
      'Identify weak areas'
    ]
  },
  {
    id: 'content-003',
    title: 'Economic Survey 2024 Analysis',
    type: 'article',
    subject: 'Economy',
    topic: 'Economic Survey',
    difficulty: 'medium',
    duration: 30,
    status: 'review',
    author: 'Economics Team',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-10'),
    content: 'Detailed analysis of Economic Survey 2024...',
    metadata: {
      wordCount: 3200,
      readingTime: 16,
      keywords: ['Economic Survey', '2024', 'GDP', 'Inflation'],
      targetAudience: ['UPSC Aspirants', 'Economics Students'],
      revisionNumber: 1,
      lastReviewer: 'Dr. Mehta',
      reviewNotes: 'Needs additional data points',
      seoTitle: 'Economic Survey 2024 Complete Analysis',
      seoDescription: 'Comprehensive analysis of Economic Survey 2024 for UPSC'
    },
    analytics: {
      views: 0,
      uniqueViews: 0,
      completions: 0,
      averageTimeSpent: 0,
      dropOffPoints: [],
      ratings: [],
      comments: [],
      shareCount: 0,
      downloadCount: 0
    },
    tags: ['Pending Review'],
    prerequisites: ['Basic Economics'],
    learningObjectives: [
      'Understand economic indicators',
      'Analyze government policies',
      'Prepare for current affairs'
    ]
  }
]

interface ContentFilters {
  search: string
  type: string
  subject: string
  status: string
  author: string
  difficulty: string
}

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(mockContent)
  const [selectedContent, setSelectedContent] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    type: 'all',
    subject: 'all',
    status: 'all',
    author: 'all',
    difficulty: 'all'
  })

  const [stats, setStats] = useState({
    totalContent: 1247,
    publishedContent: 1089,
    draftContent: 89,
    reviewContent: 69,
    totalViews: 2340000,
    avgRating: 4.6
  })

  // Filter and search logic
  useEffect(() => {
    let filtered = [...content]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.topic.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.author.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type)
    }

    // Subject filter
    if (filters.subject !== 'all') {
      filtered = filtered.filter(item => item.subject === filters.subject)
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status)
    }

    // Author filter
    if (filters.author !== 'all') {
      filtered = filtered.filter(item => item.author === filters.author)
    }

    // Difficulty filter
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === filters.difficulty)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ContentItem]
      let bValue: any = b[sortBy as keyof ContentItem]

      if (aValue instanceof Date) aValue = aValue.getTime()
      if (bValue instanceof Date) bValue = bValue.getTime()

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredContent(filtered)
    setCurrentPage(1)
  }, [filters, content, sortBy, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return BookOpen
      case 'test': return Target
      case 'article': return FileText
      case 'video': return Video
      case 'quiz': return CheckCircle
      default: return FileText
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on content:`, selectedContent)
    // Implement bulk actions
  }

  const exportContent = () => {
    console.log('Exporting content...')
    // Implement export functionality
  }

  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and analyze educational content</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={exportContent}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { title: 'Total Content', value: stats.totalContent.toLocaleString(), icon: FileText, color: 'blue', change: '+12.3%' },
          { title: 'Published', value: stats.publishedContent.toLocaleString(), icon: CheckCircle, color: 'green', change: '+8.7%' },
          { title: 'In Review', value: stats.reviewContent.toString(), icon: Clock, color: 'yellow', change: '+15.2%' },
          { title: 'Drafts', value: stats.draftContent.toString(), icon: Edit3, color: 'gray', change: '-3.4%' },
          { title: 'Total Views', value: `${(stats.totalViews / 1000000).toFixed(1)}M`, icon: Eye, color: 'purple', change: '+24.1%' },
          { title: 'Avg Rating', value: stats.avgRating.toString(), icon: Star, color: 'orange', change: '+0.2' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="lesson">Lessons</option>
                <option value="test">Tests</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="quiz">Quizzes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Subjects</option>
                <option value="History">History</option>
                <option value="Polity">Polity</option>
                <option value="Economy">Economy</option>
                <option value="Geography">Geography</option>
                <option value="Ethics">Ethics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <select
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Authors</option>
                <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                <option value="Test Team">Test Team</option>
                <option value="Economics Team">Economics Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  search: '',
                  type: 'all',
                  subject: 'all',
                  status: 'all',
                  author: 'all',
                  difficulty: 'all'
                })}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and View Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search content by title, subject, or author..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedContent.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedContent.length} selected</span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Bulk Actions</option>
                <option value="publish">Publish</option>
                <option value="archive">Archive</option>
                <option value="delete">Delete</option>
                <option value="export">Export</option>
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
            <option value="analytics.views">Views</option>
          </select>
        </div>
      </div>

      {/* Content Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {paginatedContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all ${
              viewMode === 'list' ? 'p-6' : 'p-6'
            }`}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getTypeIcon(item.type), { className: 'w-5 h-5 text-blue-600' })}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedContent.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContent([...selectedContent, item.id])
                      } else {
                        setSelectedContent(selectedContent.filter(id => id !== item.id))
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.subject} • {item.topic}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{item.author}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.analytics.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.duration}min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    Edit
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedContent.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContent([...selectedContent, item.id])
                      } else {
                        setSelectedContent(selectedContent.filter(id => id !== item.id))
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  
                  <div className="flex items-center space-x-3">
                    {React.createElement(getTypeIcon(item.type), { className: 'w-6 h-6 text-blue-600' })}
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.subject} • {item.topic} • {item.author}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{item.analytics.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center justify-between sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredContent.length)}</span> of{' '}
              <span className="font-medium">{filteredContent.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}