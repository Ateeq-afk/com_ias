'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, Target, Brain, Zap, TrendingUp, BookOpen, 
  FileText, Calendar, ChevronRight, Sparkles, Award,
  BarChart3, Users, PlayCircle, Trophy, ArrowUp,
  Book, CheckCircle, Timer, School, ArrowUpRight,
  Flame, Star
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

// Realistic UPSC preparation data
const realisticStats = {
  studyStreak: 14,
  totalHours: 156,
  lessonsCompleted: 47,
  testsAttempted: 23,
  averageScore: 68,
  rank: 2847 // Out of ~10,000 registered users
}

const recentActivity = [
  { 
    id: 1, 
    type: 'lesson', 
    title: 'Fundamental Rights and Directive Principles', 
    subject: 'Polity', 
    progress: 85, 
    time: '3 hours ago', 
    icon: Book, 
    color: 'blue' 
  },
  { 
    id: 2, 
    type: 'test', 
    title: 'UPSC Prelims 2023 - Paper I', 
    subject: 'General Studies', 
    score: 72, 
    time: 'Yesterday', 
    icon: FileText, 
    color: 'purple' 
  },
  { 
    id: 3, 
    type: 'lesson', 
    title: 'Indian National Movement (1885-1947)', 
    subject: 'Modern History', 
    progress: 100, 
    time: '2 days ago', 
    icon: TrendingUp, 
    color: 'orange' 
  },
  { 
    id: 4, 
    type: 'test', 
    title: 'Geography Mock Test - Physical Features', 
    subject: 'Geography', 
    score: 64, 
    time: '3 days ago', 
    icon: FileText, 
    color: 'green' 
  },
]

const upcomingTests = [
  { 
    id: 1, 
    title: 'UPSC Prelims 2025 Mock Test - 1', 
    date: '2025-01-15', 
    time: '9:00 AM', 
    duration: 120,
    description: 'Full-length prelims simulation'
  },
  { 
    id: 2, 
    title: 'Current Affairs Weekly Test', 
    date: '2025-01-13', 
    time: '2:00 PM', 
    duration: 60,
    description: 'January 2025 current affairs'
  },
  { 
    id: 3, 
    title: 'Indian Polity Subject Test', 
    date: '2025-01-16', 
    time: '10:00 AM', 
    duration: 90,
    description: 'Constitutional provisions and amendments'
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const statsCards = [
    { 
      icon: Flame, 
      label: 'Study Streak', 
      value: `${realisticStats.studyStreak} days`,
      change: '+3 days',
      color: 'orange',
      bgClass: 'bg-gradient-to-br from-orange-400 to-pink-500',
      insight: 'Best streak this month!'
    },
    { 
      icon: Clock, 
      label: 'Total Study Hours', 
      value: `${realisticStats.totalHours}h`,
      change: '+12h this week',
      color: 'blue',
      bgClass: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      insight: 'Target: 200h by Feb'
    },
    { 
      icon: CheckCircle, 
      label: 'Lessons Completed', 
      value: realisticStats.lessonsCompleted,
      change: '+8 this week',
      color: 'green',
      bgClass: 'bg-gradient-to-br from-green-400 to-emerald-500',
      insight: '76% of Polity syllabus'
    },
    { 
      icon: Trophy, 
      label: 'Current Rank', 
      value: `#${realisticStats.rank.toLocaleString()}`,
      change: '↑ 156 positions',
      color: 'purple',
      bgClass: 'bg-gradient-to-br from-purple-400 to-pink-500',
      insight: 'Top 30% nationwide'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBFBFD]">
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-2">
            {greeting}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{session?.user?.name?.split(' ')[0] || 'Aspirant'}</span>
          </h1>
          <p className="text-lg text-[#86868B]">
            UPSC 2025 preparation in progress. Keep pushing towards your IAS dream! 🎯
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              
              <p className="text-sm text-[#86868B] mb-1">{stat.label}</p>
              <p className="text-3xl font-semibold text-[#1D1D1F] mb-2">{stat.value}</p>
              <p className="text-xs text-[#86868B]">{stat.insight}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/dashboard/lessons" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">Continue Learning</h3>
                <p className="text-sm text-[#86868B]">Resume: Judiciary System</p>
              </div>
            </Link>

            <Link href="/dashboard/tests" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">Take Mock Test</h3>
                <p className="text-sm text-[#86868B]">UPSC Prelims simulation</p>
              </div>
            </Link>

            <Link href="/dashboard/performance" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">Performance Analysis</h3>
                <p className="text-sm text-[#86868B]">Subject-wise breakdown</p>
              </div>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1D1D1F]">Recent Activity</h2>
              <Link href="/dashboard/activity" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-2.5 rounded-xl bg-${activity.color}-100 group-hover:scale-110 transition-transform`}>
                    <activity.icon className={`h-5 w-5 text-${activity.color}-600`} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-[#1D1D1F]">{activity.title}</p>
                    <p className="text-sm text-[#86868B]">
                      {activity.subject} • {activity.time}
                    </p>
                  </div>
                  
                  {activity.type === 'lesson' ? (
                    <div className="text-right">
                      <p className="text-xs text-[#86868B] mb-1">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-600">{activity.progress}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-xs text-[#86868B] mb-1">Score</p>
                      <p className="text-lg font-semibold text-purple-600">{activity.score}/100</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Tests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1D1D1F]">Upcoming Tests</h2>
              <Link href="/dashboard/tests" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1D1D1F] mb-1">{test.title}</h3>
                      <p className="text-xs text-[#86868B] mb-3">{test.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-[#86868B]">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{test.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{test.time}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Timer className="h-4 w-4" />
                          <span>{test.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                      Register
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* UPSC Exam Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#1D1D1F] mb-1">UPSC 2025 Timeline</h4>
                  <div className="space-y-1 text-sm text-[#86868B]">
                    <p>• Prelims: <span className="font-medium text-orange-600">June 8, 2025</span></p>
                    <p>• Mains: <span className="font-medium text-red-600">September 2025</span></p>
                    <p>• Interview: <span className="font-medium text-purple-600">Feb-Apr 2026</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Achievement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Outstanding Progress! 🏆</h3>
                <p className="text-blue-100 max-w-2xl">
                  You've improved your rank by 156 positions this week. Keep this momentum to break into the top 1000 aspirants nationwide!
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Trophy className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Next Milestone</p>
                  <p className="font-semibold">Top 1000 Rank</p>
                  <p className="text-xs text-blue-200">1,847 positions to go</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}