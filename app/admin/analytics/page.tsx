'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, TrendingDown, Users, Clock, Target,
  BookOpen, Brain, Award, AlertTriangle, CheckCircle, Eye,
  Filter, Download, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  PieChart, LineChart, Activity, Star, Zap, Globe, Search
} from 'lucide-react'
import type { LearningAnalytics, SubjectPerformance, QuestionAnalytics } from '../types'

// Mock learning analytics data
const mockLearningAnalytics: LearningAnalytics = {
  subjectPerformance: [
    {
      subject: 'History',
      totalUsers: 45678,
      averageScore: 74.2,
      completionRate: 87.4,
      timeSpent: 2340,
      difficulty: 7.2,
      engagement: 82.6,
      trend: 'up'
    },
    {
      subject: 'Polity',
      totalUsers: 42341,
      averageScore: 69.8,
      completionRate: 79.3,
      timeSpent: 2890,
      difficulty: 8.1,
      engagement: 78.9,
      trend: 'up'
    },
    {
      subject: 'Geography',
      totalUsers: 38567,
      averageScore: 71.5,
      completionRate: 83.7,
      timeSpent: 2156,
      difficulty: 6.8,
      engagement: 85.2,
      trend: 'stable'
    },
    {
      subject: 'Economics',
      totalUsers: 34892,
      averageScore: 65.3,
      completionRate: 72.1,
      timeSpent: 3245,
      difficulty: 9.1,
      engagement: 71.4,
      trend: 'down'
    },
    {
      subject: 'Current Affairs',
      totalUsers: 47234,
      averageScore: 78.9,
      completionRate: 91.2,
      timeSpent: 1876,
      difficulty: 5.4,
      engagement: 89.7,
      trend: 'up'
    },
    {
      subject: 'Ethics',
      totalUsers: 29876,
      averageScore: 72.6,
      completionRate: 76.8,
      timeSpent: 2687,
      difficulty: 7.8,
      engagement: 75.3,
      trend: 'stable'
    }
  ],
  questionAnalytics: [
    {
      questionId: 'q-001',
      question: 'Which Article of the Constitution deals with Right to Equality?',
      attempts: 23456,
      correctAnswers: 18234,
      averageTime: 45,
      difficulty: 6.2,
      discriminationIndex: 0.78,
      distractorAnalysis: []
    },
    {
      questionId: 'q-002',
      question: 'What is the current GDP growth rate of India?',
      attempts: 19876,
      correctAnswers: 12543,
      averageTime: 67,
      difficulty: 8.1,
      discriminationIndex: 0.63,
      distractorAnalysis: []
    }
  ],
  timeMetrics: {
    averageSessionDuration: 42.8,
    averageLessonTime: 18.5,
    averageTestTime: 89.2,
    peakUsageHours: [19, 20, 21, 9, 10],
    usageByDay: {
      'Monday': 18234,
      'Tuesday': 19876,
      'Wednesday': 21234,
      'Thursday': 20987,
      'Friday': 22345,
      'Saturday': 25678,
      'Sunday': 24567
    },
    timeToCompletion: {
      'Basic Level': 21.5,
      'Intermediate': 34.8,
      'Advanced': 45.2
    }
  },
  completionFunnels: [
    { stage: 'Course Enrollment', users: 50000, dropOffRate: 0, conversionRate: 100, averageTime: 0 },
    { stage: 'First Lesson', users: 47500, dropOffRate: 5, conversionRate: 95, averageTime: 2.3 },
    { stage: 'Module 1 Complete', users: 42750, dropOffRate: 10, conversionRate: 90, averageTime: 7.8 },
    { stage: 'Mid-Course Test', users: 38475, dropOffRate: 10, conversionRate: 90, averageTime: 15.2 },
    { stage: 'Module 2 Complete', users: 34628, dropOffRate: 10, conversionRate: 90, averageTime: 28.5 },
    { stage: 'Final Assessment', users: 31165, dropOffRate: 10, conversionRate: 90, averageTime: 42.1 },
    { stage: 'Course Completion', users: 28049, dropOffRate: 10, conversionRate: 90, averageTime: 45.8 }
  ],
  userJourneys: [],
  weakAreaAnalysis: {
    subject: 'Overall',
    topics: [
      { topic: 'Constitutional Amendments', averageScore: 58.3, attemptCount: 34567, improvementPotential: 85 },
      { topic: 'Economic Indicators', averageScore: 61.2, attemptCount: 28934, improvementPotential: 78 },
      { topic: 'International Relations', averageScore: 64.7, attemptCount: 31245, improvementPotential: 72 },
      { topic: 'Environmental Issues', averageScore: 67.1, attemptCount: 25678, improvementPotential: 68 }
    ],
    overallWeakness: 72.8,
    recommendedActions: [
      'Increase practice questions for Constitutional Amendments',
      'Add more visual content for Economic Indicators',
      'Create case studies for International Relations',
      'Develop interactive simulations for Environmental Issues'
    ]
  },
  successPredictors: [
    {
      factor: 'Daily Study Time',
      importance: 0.89,
      correlation: 0.76,
      description: 'Students who study 3+ hours daily show 76% higher success rate',
      recommendation: 'Encourage consistent daily study habits'
    },
    {
      factor: 'Mock Test Frequency',
      importance: 0.82,
      correlation: 0.71,
      description: 'Regular mock test takers score 71% higher on final exams',
      recommendation: 'Implement weekly mock test schedule'
    },
    {
      factor: 'Subject Diversity',
      importance: 0.74,
      correlation: 0.68,
      description: 'Students covering all subjects show better overall performance',
      recommendation: 'Ensure balanced curriculum coverage'
    }
  ]
}

export default function LearningAnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockLearningAnalytics)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        subjectPerformance: prev.subjectPerformance.map(subject => ({
          ...subject,
          totalUsers: subject.totalUsers + Math.floor(Math.random() * 10),
          averageScore: Math.max(0, Math.min(100, subject.averageScore + (Math.random() - 0.5) * 0.5))
        }))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    if (score >= 60) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze student performance and learning patterns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Subjects</option>
            {analytics.subjectPerformance.map(subject => (
              <option key={subject.subject} value={subject.subject}>{subject.subject}</option>
            ))}
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'subjects', name: 'Subject Performance', icon: BookOpen },
              { id: 'engagement', name: 'Engagement', icon: Activity },
              { id: 'completion', name: 'Completion Funnel', icon: Target },
              { id: 'insights', name: 'AI Insights', icon: Brain }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Students',
                    value: analytics.subjectPerformance.reduce((sum, s) => sum + s.totalUsers, 0).toLocaleString(),
                    change: '+12.5%',
                    icon: Users,
                    color: 'blue'
                  },
                  {
                    title: 'Avg Completion Rate',
                    value: `${(analytics.subjectPerformance.reduce((sum, s) => sum + s.completionRate, 0) / analytics.subjectPerformance.length).toFixed(1)}%`,
                    change: '+8.3%',
                    icon: Target,
                    color: 'green'
                  },
                  {
                    title: 'Avg Session Time',
                    value: `${analytics.timeMetrics.averageSessionDuration}min`,
                    change: '+15.7%',
                    icon: Clock,
                    color: 'purple'
                  },
                  {
                    title: 'Avg Score',
                    value: `${(analytics.subjectPerformance.reduce((sum, s) => sum + s.averageScore, 0) / analytics.subjectPerformance.length).toFixed(1)}%`,
                    change: '+5.2%',
                    icon: Award,
                    color: 'orange'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                        <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                      </div>
                      <span className="text-sm font-medium text-green-600">{metric.change}</span>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                      <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Usage Pattern */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Usage Pattern</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.timeMetrics.usageByDay).map(([day, usage]) => {
                      const maxUsage = Math.max(...Object.values(analytics.timeMetrics.usageByDay))
                      const percentage = (usage / maxUsage) * 100
                      
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 w-20">{day}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">{usage.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Usage Hours</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const isPeak = analytics.timeMetrics.peakUsageHours.includes(hour)
                      return (
                        <div key={hour} className="text-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                            isPeak ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {hour}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Peak hours: {analytics.timeMetrics.peakUsageHours.join(', ')}:00
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {analytics.subjectPerformance.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{subject.subject}</h3>
                      <div className={getTrendColor(subject.trend)}>
                        {getTrendIcon(subject.trend)}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Score</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceColor(subject.averageScore)}`}>
                          {subject.averageScore.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="font-medium text-gray-900">{subject.completionRate.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Users</span>
                        <span className="font-medium text-gray-900">{subject.totalUsers.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Time Spent</span>
                        <span className="font-medium text-gray-900">{Math.floor(subject.timeSpent / 60)}h {subject.timeSpent % 60}m</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${subject.engagement}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{subject.engagement.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'completion' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Completion Funnel</h3>
                <div className="space-y-4">
                  {analytics.completionFunnels.map((stage, index) => (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{stage.stage}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{stage.users.toLocaleString()} users</span>
                            <span className="text-sm font-medium text-gray-900">{stage.conversionRate}%</span>
                            {stage.dropOffRate > 0 && (
                              <span className="text-sm text-red-600">-{stage.dropOffRate}%</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stage.conversionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Weak Areas Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Weak Areas Analysis</h3>
                <div className="space-y-4">
                  {analytics.weakAreaAnalysis.topics.map((topic, index) => (
                    <motion.div
                      key={topic.topic}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                        <p className="text-sm text-gray-600">{topic.attemptCount.toLocaleString()} attempts</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceColor(topic.averageScore)}`}>
                            {topic.averageScore.toFixed(1)}%
                          </span>
                          <p className="text-xs text-gray-600 mt-1">Avg Score</p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-orange-600">{topic.improvementPotential}%</span>
                          <p className="text-xs text-gray-600 mt-1">Improvement</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Recommended Actions</h4>
                  <ul className="space-y-1">
                    {analytics.weakAreaAnalysis.recommendedActions.map((action, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Success Predictors */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Success Predictors</h3>
                <div className="space-y-6">
                  {analytics.successPredictors.map((predictor, index) => (
                    <motion.div
                      key={predictor.factor}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{predictor.factor}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Importance:</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${predictor.importance * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{(predictor.importance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{predictor.description}</p>
                      <div className="bg-green-50 rounded p-3">
                        <p className="text-sm text-green-800">
                          <strong>Recommendation:</strong> {predictor.recommendation}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}