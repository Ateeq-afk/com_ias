'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, Filter, Download, UserPlus, Edit3, Trash2,
  Mail, Phone, MapPin, Calendar, TrendingUp, Activity,
  Star, Clock, Target, BookOpen, CreditCard, AlertCircle,
  CheckCircle, XCircle, Eye, MoreVertical, ArrowUpDown,
  RefreshCw, FileText, Ban, UserCheck, Crown
} from 'lucide-react'
import type { UserProfile, SubscriptionPlan } from '../types'

// Enhanced mock user data with UPSC-specific details
const mockUsers: UserProfile[] = [
  {
    id: 'user-001',
    email: 'arjun.verma@gmail.com',
    name: 'Arjun Verma',
    phone: '+91 9876543210',
    subscriptionPlan: {
      id: 'premium',
      name: 'Premium Plus',
      type: 'premium',
      price: 4999,
      duration: 12,
      features: ['All Courses', 'Mock Tests', 'Mentorship'],
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
      autoRenew: true
    },
    subscriptionStatus: 'active',
    registrationDate: new Date('2024-01-15'),
    lastActive: new Date('2025-01-12'),
    totalLessonsCompleted: 245,
    totalTestsAttempted: 67,
    averageScore: 78.5,
    paymentHistory: [],
    supportTickets: [],
    learningProgress: {
      totalTimeSpent: 1847,
      lessonsCompleted: 245,
      testsAttempted: 67,
      averageScore: 78.5,
      subjectProgress: {},
      weakAreas: ['Economics'],
      strongAreas: ['History', 'Polity'],
      lastLessonDate: new Date('2025-01-12'),
      streakDays: 45,
      milestones: []
    },
    location: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    preferences: {
      language: 'English',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: true,
      reminderFrequency: 'daily',
      studyGoalHours: 4,
      preferredStudyTime: ['Morning'],
      subjects: ['History', 'Polity', 'Geography']
    },
    tags: ['High Performer', 'Active Learner'],
    notes: 'Consistent performer with strong analytical skills'
  },
  {
    id: 'user-002',
    email: 'priya.sharma@gmail.com',
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    subscriptionPlan: {
      id: 'basic',
      name: 'Basic Plan',
      type: 'basic',
      price: 1999,
      duration: 6,
      features: ['Basic Courses', 'Practice Questions'],
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-12-01'),
      autoRenew: false
    },
    subscriptionStatus: 'expired',
    registrationDate: new Date('2024-06-01'),
    lastActive: new Date('2024-12-15'),
    totalLessonsCompleted: 89,
    totalTestsAttempted: 23,
    averageScore: 65.2,
    paymentHistory: [],
    supportTickets: [],
    learningProgress: {
      totalTimeSpent: 567,
      lessonsCompleted: 89,
      testsAttempted: 23,
      averageScore: 65.2,
      subjectProgress: {},
      weakAreas: ['Maths', 'Economics'],
      strongAreas: ['History'],
      lastLessonDate: new Date('2024-12-15'),
      streakDays: 12,
      milestones: []
    },
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    preferences: {
      language: 'Hindi',
      timezone: 'Asia/Kolkata',
      emailNotifications: false,
      pushNotifications: true,
      reminderFrequency: 'weekly',
      studyGoalHours: 2,
      preferredStudyTime: ['Evening'],
      subjects: ['History', 'Geography']
    },
    tags: ['Re-engagement Needed'],
    notes: 'Subscription expired, needs re-engagement campaign'
  },
  {
    id: 'user-003',
    email: 'kavita.agarwal@gmail.com',
    name: 'Kavita Agarwal',
    phone: '+91 9876543212',
    subscriptionPlan: {
      id: 'free',
      name: 'Free Plan',
      type: 'free',
      price: 0,
      duration: 0,
      features: ['Basic Access'],
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-01'),
      autoRenew: false
    },
    subscriptionStatus: 'active',
    registrationDate: new Date('2024-03-01'),
    lastActive: new Date('2025-01-10'),
    totalLessonsCompleted: 23,
    totalTestsAttempted: 5,
    averageScore: 58.3,
    paymentHistory: [],
    supportTickets: [],
    learningProgress: {
      totalTimeSpent: 156,
      lessonsCompleted: 23,
      testsAttempted: 5,
      averageScore: 58.3,
      subjectProgress: {},
      weakAreas: ['Polity', 'Economics'],
      strongAreas: ['General Knowledge'],
      lastLessonDate: new Date('2025-01-10'),
      streakDays: 7,
      milestones: []
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India'
    },
    preferences: {
      language: 'English',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: false,
      reminderFrequency: 'weekly',
      studyGoalHours: 1,
      preferredStudyTime: ['Evening'],
      subjects: ['General Studies']
    },
    tags: ['Potential Upgrade'],
    notes: 'Free user showing engagement, potential for conversion'
  }
]

interface FilterState {
  status: string
  plan: string
  location: string
  activity: string
  searchTerm: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('registrationDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    plan: 'all',
    location: 'all',
    activity: 'all',
    searchTerm: ''
  })

  const [stats, setStats] = useState({
    totalUsers: 78543,
    activeUsers: 34567,
    premiumUsers: 12456,
    newThisMonth: 3456,
    churnRate: 2.8,
    avgRevenue: 3250
  })

  // Filter and search logic
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.phone?.includes(filters.searchTerm)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.subscriptionStatus === filters.status)
    }

    // Plan filter
    if (filters.plan !== 'all') {
      filtered = filtered.filter(user => user.subscriptionPlan.type === filters.plan)
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(user => user.location.state === filters.location)
    }

    // Activity filter
    if (filters.activity !== 'all') {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      if (filters.activity === 'active') {
        filtered = filtered.filter(user => user.lastActive > sevenDaysAgo)
      } else if (filters.activity === 'inactive') {
        filtered = filtered.filter(user => user.lastActive < thirtyDaysAgo)
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof UserProfile]
      let bValue: any = b[sortBy as keyof UserProfile]

      if (aValue instanceof Date) aValue = aValue.getTime()
      if (bValue instanceof Date) bValue = bValue.getTime()

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [filters, users, sortBy, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers)
    // Implement bulk actions
  }

  const exportUsers = () => {
    console.log('Exporting users...')
    // Implement export functionality
  }

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your platform users</p>
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
            onClick={exportUsers}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue', change: '+12.5%' },
          { title: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: Activity, color: 'green', change: '+8.2%' },
          { title: 'Premium Users', value: stats.premiumUsers.toLocaleString(), icon: Star, color: 'purple', change: '+23.1%' },
          { title: 'New This Month', value: stats.newThisMonth.toLocaleString(), icon: TrendingUp, color: 'orange', change: '+15.7%' },
          { title: 'Churn Rate', value: `${stats.churnRate}%`, icon: AlertCircle, color: 'red', change: '-0.8%' },
          { title: 'Avg Revenue', value: `₹${stats.avgRevenue}`, icon: CreditCard, color: 'indigo', change: '+18.3%' }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
              <select
                value={filters.plan}
                onChange={(e) => setFilters({...filters, plan: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Locations</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
              <select
                value={filters.activity}
                onChange={(e) => setFilters({...filters, activity: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Activity</option>
                <option value="active">Active (7 days)</option>
                <option value="inactive">Inactive (30+ days)</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="">Bulk Actions</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="delete">Delete</option>
                <option value="export">Export</option>
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="registrationDate">Registration Date</option>
              <option value="lastActive">Last Active</option>
              <option value="name">Name</option>
              <option value="averageScore">Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(paginatedUsers.map(user => user.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan & Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && <div className="text-xs text-gray-400">{user.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.subscriptionPlan.type)}`}>
                        {user.subscriptionPlan.name}
                      </span>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscriptionStatus)}`}>
                          {user.subscriptionStatus}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 text-gray-400 mr-1" />
                        {user.averageScore.toFixed(1)}%
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {user.totalLessonsCompleted} lessons
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        {Math.floor((Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24))}d ago
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Activity className="w-3 h-3 mr-1" />
                        {user.learningProgress.streakDays} day streak
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {user.location.city}
                      </div>
                      <div className="text-xs text-gray-500">{user.location.state}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
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
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
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
    </div>
  )
}