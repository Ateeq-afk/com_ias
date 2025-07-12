'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, DollarSign, TrendingUp, Clock, Activity, Zap,
  Globe, Server, Database, Wifi, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown, BarChart3, PieChart, LineChart,
  Target, BookOpen, MessageSquare, Star, Download, 
  Bell, RefreshCw, Filter, Calendar, Eye, PlayCircle,
  AlertCircle, FileText
} from 'lucide-react'

// Real-time UPSC platform data
const mockStats = {
  totalUsers: 78543,
  activeUsers: 12456,
  totalRevenue: 24750000,
  monthlyRevenue: 3140000,
  totalLessons: 847,
  publishedLessons: 823,
  totalTests: 456,
  activeTests: 389,
  conversionRate: 12.3,
  avgSessionTime: 42.8
}

interface MetricCard {
  title: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: any
  color: string
}

interface SystemMetric {
  name: string
  value: number
  status: 'healthy' | 'warning' | 'critical'
  unit: string
}

const recentActivity = [
  { id: 1, user: 'Arjun Verma (Delhi)', action: 'Completed', item: 'Article 32 & Fundamental Rights', time: '1 min ago', type: 'lesson' },
  { id: 2, user: 'Kavya Iyer (Chennai)', action: 'Achieved 89% in', item: 'UPSC Prelims Mock Test 12', time: '3 min ago', type: 'test' },
  { id: 3, user: 'Rohit Agarwal (Mumbai)', action: 'Upgraded to', item: 'Premium Plus Plan (₹4,999)', time: '7 min ago', type: 'payment' },
  { id: 4, user: 'Anisha Gupta (Bangalore)', action: 'Started', item: 'Economic Survey 2024 Analysis', time: '12 min ago', type: 'lesson' },
  { id: 5, user: 'Vikash Singh (Patna)', action: 'Completed', item: 'Ethics Case Study: Corruption Dilemma', time: '18 min ago', type: 'lesson' },
]

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue' 
}: {
  title: string
  value: string | number
  change?: string
  icon: any
  color?: string
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      {change && (
        <span className={`text-sm font-medium ${
          change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
)

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)
  const [liveData, setLiveData] = useState({
    activeUsers: 2847,
    revenue: 247850,
    registrations: 156,
    systemLoad: 67
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        registrations: prev.registrations + Math.floor(Math.random() * 5),
        systemLoad: Math.max(20, Math.min(90, prev.systemLoad + Math.floor(Math.random() * 6) - 3))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const metricsCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: mockStats.totalUsers.toLocaleString(),
      change: '+15.2%',
      changeType: 'increase',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Now',
      value: liveData.activeUsers.toLocaleString(),
      change: '+8.3%',
      changeType: 'increase',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${(mockStats.monthlyRevenue / 100000).toFixed(1)}L`,
      change: '+23.4%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Conversion Rate',
      value: `${mockStats.conversionRate}%`,
      change: '+2.8%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      title: 'Avg Session Time',
      value: `${mockStats.avgSessionTime}min`,
      change: '+12.5%',
      changeType: 'increase',
      icon: Clock,
      color: 'indigo'
    },
    {
      title: 'UPSC Selections',
      value: '142',
      change: '+18 this year',
      changeType: 'increase',
      icon: Target,
      color: 'emerald'
    }
  ]

  const systemMetrics: SystemMetric[] = [
    { name: 'CPU Usage', value: liveData.systemLoad, status: liveData.systemLoad > 80 ? 'critical' : liveData.systemLoad > 60 ? 'warning' : 'healthy', unit: '%' },
    { name: 'Memory Usage', value: 45, status: 'healthy', unit: '%' },
    { name: 'Disk Usage', value: 32, status: 'healthy', unit: '%' },
    { name: 'Network I/O', value: 78, status: 'warning', unit: 'MB/s' },
    { name: 'Database Queries', value: 1247, status: 'healthy', unit: '/min' },
    { name: 'Active Connections', value: 892, status: 'healthy', unit: '' }
  ]

  const topContent = [
    { title: 'Article 32 & Fundamental Rights', views: 23847, completion: 94, rating: 4.9, subject: 'Polity' },
    { title: 'Economic Survey 2024 Highlights', views: 19245, completion: 87, rating: 4.8, subject: 'Economy' },
    { title: 'UPSC Prelims 2024 Paper Analysis', views: 18567, completion: 91, rating: 4.9, subject: 'Current Affairs' },
    { title: 'Indian Freedom Struggle Timeline', views: 16234, completion: 89, rating: 4.7, subject: 'History' },
    { title: 'Climate Change & Environmental Issues', views: 14892, completion: 82, rating: 4.6, subject: 'Environment' }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of your UPSC learning platform</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metricsCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center ${
                metric.changeType === 'increase' ? 'text-green-600' : 
                metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changeType === 'increase' ? <ArrowUp className="w-4 h-4" /> : 
                 metric.changeType === 'decrease' ? <ArrowDown className="w-4 h-4" /> : null}
                <span className="text-sm font-medium ml-1">{metric.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity Feed</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'lesson' ? 'bg-blue-100' :
                  activity.type === 'test' ? 'bg-purple-100' :
                  activity.type === 'payment' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {activity.type === 'lesson' ? <BookOpen className="w-4 h-4 text-blue-600" /> :
                   activity.type === 'test' ? <Target className="w-4 h-4 text-purple-600" /> :
                   activity.type === 'payment' ? <DollarSign className="w-4 h-4 text-green-600" /> :
                   <Activity className="w-4 h-4 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-600">{activity.action}</span>{' '}
                    <span className="font-medium text-blue-600">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Activity →
            </button>
          </div>
        </motion.div>

        {/* System Health Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Monitoring</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'healthy' ? 'bg-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm text-gray-700">{metric.name}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    metric.status === 'healthy' ? 'text-green-600' :
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Uptime</span>
                <div className="font-semibold text-green-600">99.97%</div>
              </div>
              <div>
                <span className="text-gray-600">Response Time</span>
                <div className="font-semibold text-blue-600">247ms</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Content Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Analytics →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="pb-3">Content</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Completion</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {topContent.map((content, index) => (
                <tr key={content.title} className="border-t border-gray-100">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{content.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {content.subject}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{content.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${content.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{content.completion}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{content.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Content Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Total Lessons</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Published</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.publishedLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Total Tests</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.totalTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">Active Tests</span>
                </div>
                <span className="font-semibold text-gray-900">{mockStats.activeTests}</span>
              </div>
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Gateway Issue</p>
                  <p className="text-xs text-gray-600">Some payments are failing. Check logs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Database Backup</p>
                  <p className="text-xs text-gray-600">Scheduled backup completed successfully.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Revenue Analytics & Geographic Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Revenue Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">₹{(mockStats.monthlyRevenue / 100000).toFixed(1)}L</div>
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-xs text-green-600 mt-1">+23.4% from last month</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">₹{(mockStats.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-blue-600 mt-1">Annual Run Rate</div>
            </div>
          </div>

          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Revenue trend chart</p>
            </div>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Distribution</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { state: 'Delhi', users: 12847, percentage: 16.4, color: 'bg-blue-500' },
              { state: 'Maharashtra', users: 9234, percentage: 11.8, color: 'bg-green-500' },
              { state: 'Uttar Pradesh', users: 8756, percentage: 11.1, color: 'bg-purple-500' },
              { state: 'Karnataka', users: 7432, percentage: 9.5, color: 'bg-orange-500' },
              { state: 'West Bengal', users: 6789, percentage: 8.6, color: 'bg-pink-500' },
              { state: 'Others', users: 33485, percentage: 42.6, color: 'bg-gray-400' }
            ].map((region) => (
              <div key={region.state} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                  <span className="text-sm text-gray-700">{region.state}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{region.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{region.percentage}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Add New Lesson', href: '/admin/content/lessons/new' },
            { title: 'Create Test', href: '/admin/tests/new' },
            { title: 'Send Notification', href: '/admin/notifications/new' },
            { title: 'View Reports', href: '/admin/analytics' }
          ].map((action, index) => (
            <button
              key={action.title}
              className="p-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all text-left"
            >
              <p className="font-medium">{action.title}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}