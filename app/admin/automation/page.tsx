'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Plus, Play, Pause, Settings, Trash2, Edit3, Copy,
  Mail, MessageSquare, Clock, Users, Target, Calendar,
  AlertCircle, CheckCircle, XCircle, Eye, MoreVertical,
  Filter, Search, Download, RefreshCw, TrendingUp, BarChart3,
  Bell, Send, UserPlus, CreditCard, Activity, Award
} from 'lucide-react'
import type { Automation, Campaign } from '../types'

// Mock automation data
const mockAutomations: Automation[] = [
  {
    id: 'auto-001',
    name: 'Welcome Email Sequence',
    description: 'Send welcome emails to new users with course recommendations',
    trigger: {
      type: 'user_signup',
      config: { delay: 0 }
    },
    conditions: [
      { field: 'subscription_status', operator: 'equals', value: 'active', logicalOperator: 'AND' }
    ],
    actions: [
      {
        type: 'send_email',
        config: {
          template: 'welcome_sequence',
          delay: 0,
          subject: 'Welcome to UPSC Preparation Journey!',
          content: 'Welcome email with personalized recommendations'
        }
      },
      {
        type: 'assign_content',
        config: {
          contentType: 'course',
          contentId: 'foundation_course',
          delay: 24 * 60 // 24 hours
        }
      }
    ],
    isActive: true,
    executionCount: 2847,
    lastExecuted: new Date('2025-01-12T10:30:00'),
    createdBy: 'Admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-10')
  },
  {
    id: 'auto-002',
    name: 'Subscription Renewal Reminder',
    description: 'Remind users 7 days before subscription expires',
    trigger: {
      type: 'subscription_end',
      config: { days_before: 7 }
    },
    conditions: [
      { field: 'subscription_status', operator: 'equals', value: 'active', logicalOperator: 'AND' },
      { field: 'auto_renew', operator: 'equals', value: false, logicalOperator: 'AND' }
    ],
    actions: [
      {
        type: 'send_email',
        config: {
          template: 'renewal_reminder',
          subject: 'Your UPSC Course Expires Soon - Renew Now!',
          content: 'Renewal reminder with discount offer'
        }
      },
      {
        type: 'send_push',
        config: {
          title: 'Renewal Reminder',
          message: 'Don\'t lose access to your UPSC preparation materials',
          delay: 2 * 60 // 2 hours
        }
      }
    ],
    isActive: true,
    executionCount: 1234,
    lastExecuted: new Date('2025-01-11T15:45:00'),
    createdBy: 'Marketing Team',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: 'auto-003',
    name: 'Inactive User Re-engagement',
    description: 'Re-engage users who haven\'t logged in for 14 days',
    trigger: {
      type: 'inactivity',
      config: { days: 14 }
    },
    conditions: [
      { field: 'subscription_status', operator: 'equals', value: 'active', logicalOperator: 'AND' },
      { field: 'last_login', operator: 'less_than', value: '14_days_ago', logicalOperator: 'AND' }
    ],
    actions: [
      {
        type: 'send_email',
        config: {
          template: 'reengagement',
          subject: 'We Miss You! Continue Your UPSC Journey',
          content: 'Personalized re-engagement with progress summary'
        }
      },
      {
        type: 'create_ticket',
        config: {
          category: 'engagement',
          priority: 'low',
          message: 'User inactive for 14 days - requires follow-up',
          delay: 7 * 24 * 60 // 7 days
        }
      }
    ],
    isActive: false,
    executionCount: 567,
    lastExecuted: new Date('2025-01-08T09:20:00'),
    createdBy: 'Support Team',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'auto-004',
    name: 'High Performer Recognition',
    description: 'Automatically recognize and reward high-performing students',
    trigger: {
      type: 'score_threshold',
      config: { threshold: 85, subject: 'any' }
    },
    conditions: [
      { field: 'average_score', operator: 'greater_than', value: 85, logicalOperator: 'AND' },
      { field: 'tests_completed', operator: 'greater_than', value: 5, logicalOperator: 'AND' }
    ],
    actions: [
      {
        type: 'send_email',
        config: {
          template: 'achievement_recognition',
          subject: 'Congratulations on Your Outstanding Performance!',
          content: 'Recognition email with badge and certificate'
        }
      },
      {
        type: 'update_user',
        config: {
          field: 'badges',
          value: 'high_performer',
          action: 'add'
        }
      }
    ],
    isActive: true,
    executionCount: 892,
    lastExecuted: new Date('2025-01-12T14:15:00'),
    createdBy: 'Education Team',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2025-01-01')
  }
]

const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'New Year Study Plan 2025',
    type: 'email',
    status: 'completed',
    target: {
      userSegment: ['active_users', 'premium_users'],
      filters: [],
      estimatedReach: 25000
    },
    content: {
      title: 'Start 2025 with a Perfect UPSC Study Plan',
      message: 'Get your personalized study plan for UPSC 2025',
      cta: {
        text: 'Get My Study Plan',
        url: '/study-plan',
        style: 'primary'
      },
      template: 'new_year_2025',
      personalization: {
        'first_name': 'user.first_name',
        'weak_subjects': 'user.weak_subjects'
      }
    },
    schedule: {
      type: 'scheduled',
      sendAt: new Date('2025-01-01T09:00:00'),
      timezone: 'Asia/Kolkata'
    },
    metrics: {
      sent: 24567,
      delivered: 24234,
      opened: 14540,
      clicked: 3625,
      converted: 892,
      unsubscribed: 23,
      bounced: 333,
      deliveryRate: 98.6,
      openRate: 60.0,
      clickRate: 14.7,
      conversionRate: 24.6
    },
    createdBy: 'Marketing Team',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-02')
  },
  {
    id: 'camp-002',
    name: 'Mock Test Series Launch',
    type: 'push',
    status: 'running',
    target: {
      userSegment: ['test_takers'],
      filters: [],
      estimatedReach: 15000
    },
    content: {
      title: 'New Mock Test Series Available!',
      message: 'Practice with our latest UPSC Prelims mock tests',
      cta: {
        text: 'Start Test',
        url: '/mock-tests',
        style: 'primary'
      },
      template: 'mock_test_launch',
      personalization: {
        'last_score': 'user.last_test_score'
      }
    },
    schedule: {
      type: 'immediate',
      timezone: 'Asia/Kolkata'
    },
    metrics: {
      sent: 14234,
      delivered: 13987,
      opened: 8234,
      clicked: 2456,
      converted: 567,
      unsubscribed: 12,
      bounced: 247,
      deliveryRate: 98.3,
      openRate: 58.9,
      clickRate: 17.2,
      conversionRate: 23.1
    },
    createdBy: 'Content Team',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12')
  }
]

export default function AutomationCenterPage() {
  const [automations, setAutomations] = useState(mockAutomations)
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [activeTab, setActiveTab] = useState('automations')
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAutomations(prev => prev.map(auto => ({
        ...auto,
        executionCount: auto.isActive ? auto.executionCount + Math.floor(Math.random() * 3) : auto.executionCount
      })))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const toggleAutomation = (automationId: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === automationId ? { ...auto, isActive: !auto.isActive } : auto
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': 
      case true: return 'bg-green-100 text-green-800'
      case 'paused': 
      case false: return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string | boolean) => {
    if (status === 'running' || status === true) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === 'paused' || status === false) return <Pause className="w-4 h-4 text-yellow-600" />
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-blue-600" />
    return <XCircle className="w-4 h-4 text-gray-600" />
  }

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'user_signup': return <UserPlus className="w-4 h-4" />
      case 'subscription_end': return <CreditCard className="w-4 h-4" />
      case 'inactivity': return <Clock className="w-4 h-4" />
      case 'score_threshold': return <Award className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const filteredAutomations = automations.filter(auto => {
    const matchesSearch = auto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auto.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && auto.isActive) ||
                         (statusFilter === 'inactive' && !auto.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalStats = {
    totalAutomations: automations.length,
    activeAutomations: automations.filter(a => a.isActive).length,
    totalExecutions: automations.reduce((sum, a) => sum + a.executionCount, 0),
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'running').length,
    avgOpenRate: campaigns.reduce((sum, c) => sum + c.metrics.openRate, 0) / campaigns.length
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation Center</h1>
          <p className="text-gray-600 mt-1">Automate workflows, campaigns, and user communications</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Automation
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { title: 'Total Automations', value: totalStats.totalAutomations.toString(), icon: Zap, color: 'blue', change: '+3' },
          { title: 'Active Automations', value: totalStats.activeAutomations.toString(), icon: Play, color: 'green', change: '+2' },
          { title: 'Total Executions', value: totalStats.totalExecutions.toLocaleString(), icon: Activity, color: 'purple', change: '+1.2K' },
          { title: 'Campaigns', value: totalStats.totalCampaigns.toString(), icon: Send, color: 'orange', change: '+1' },
          { title: 'Active Campaigns', value: totalStats.activeCampaigns.toString(), icon: TrendingUp, color: 'indigo', change: '+1' },
          { title: 'Avg Open Rate', value: `${totalStats.avgOpenRate.toFixed(1)}%`, icon: Eye, color: 'emerald', change: '+2.3%' }
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
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'automations', name: 'Automations', icon: Zap },
              { id: 'campaigns', name: 'Campaigns', icon: Send },
              { id: 'templates', name: 'Templates', icon: Mail },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search automations or campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
              
              {selectedAutomations.length > 0 && (
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Bulk Actions</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="delete">Delete</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'automations' && (
            <div className="space-y-4">
              {filteredAutomations.map((automation, index) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedAutomations.includes(automation.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAutomations([...selectedAutomations, automation.id])
                          } else {
                            setSelectedAutomations(selectedAutomations.filter(id => id !== automation.id))
                          }
                        }}
                        className="mt-1 rounded border-gray-300"
                      />
                      
                      <div className={`p-3 rounded-lg ${automation.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {getTriggerIcon(automation.trigger.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(automation.isActive)}`}>
                            {automation.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{automation.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-1" />
                            {automation.executionCount.toLocaleString()} executions
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Last run: {automation.lastExecuted?.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {automation.createdBy}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAutomation(automation.id)}
                        className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          automation.isActive 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {automation.isActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                        {automation.isActive ? 'Pause' : 'Start'}
                      </button>
                      
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {campaign.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{campaign.metrics.sent.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{campaign.metrics.openRate.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">Open Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{campaign.metrics.clickRate.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">Click Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{campaign.metrics.conversionRate.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">Conversion</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{campaign.target.estimatedReach.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Reach</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Templates</h3>
              <p className="text-gray-600 mb-6">Create and manage email templates for your automations</p>
              <button className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Performance</h3>
                  <div className="h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Automation performance chart</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Metrics</h3>
                  <div className="h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Campaign metrics visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}