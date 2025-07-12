'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare, Plus, Search, Filter, RefreshCw, Download,
  Clock, AlertCircle, CheckCircle, XCircle, User, Calendar,
  Tag, Star, TrendingUp, TrendingDown, Eye, Edit3, Send,
  MessageCircle, Phone, Mail, MoreVertical, Paperclip
} from 'lucide-react'
import type { SupportTicket, TicketMessage } from '../types'

// Mock support ticket data
const mockTickets: SupportTicket[] = [
  {
    id: 'ticket-001',
    subject: 'Unable to access premium content after payment',
    category: 'billing',
    priority: 'high',
    status: 'open',
    assignedTo: 'Support Agent 1',
    messages: [
      {
        id: 'msg-001',
        content: 'I made the payment yesterday but still cannot access premium content. My transaction ID is UPI123456789.',
        sender: 'user',
        senderName: 'Rahul Kumar',
        timestamp: new Date('2025-01-12T09:30:00')
      }
    ],
    createdAt: new Date('2025-01-12T09:30:00'),
    updatedAt: new Date('2025-01-12T09:30:00'),
    tags: ['payment_issue', 'premium_access'],
    satisfaction: undefined
  },
  {
    id: 'ticket-002',
    subject: 'Video lessons not loading properly',
    category: 'technical',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Tech Support Team',
    messages: [
      {
        id: 'msg-002',
        content: 'The video lessons keep buffering and sometimes don\'t load at all. This is affecting my study schedule.',
        sender: 'user',
        senderName: 'Priya Sharma',
        timestamp: new Date('2025-01-11T14:20:00')
      },
      {
        id: 'msg-003',
        content: 'We\'re looking into this issue. Can you please share your internet speed and device details?',
        sender: 'admin',
        senderName: 'Support Agent 2',
        timestamp: new Date('2025-01-11T15:45:00')
      }
    ],
    createdAt: new Date('2025-01-11T14:20:00'),
    updatedAt: new Date('2025-01-11T15:45:00'),
    tags: ['video_issue', 'technical'],
    satisfaction: undefined
  },
  {
    id: 'ticket-003',
    subject: 'Request for additional mock tests',
    category: 'content',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'Content Team',
    messages: [
      {
        id: 'msg-004',
        content: 'Can you please add more mock tests for Economics? The current ones are not sufficient for practice.',
        sender: 'user',
        senderName: 'Amit Patel',
        timestamp: new Date('2025-01-10T11:15:00')
      },
      {
        id: 'msg-005',
        content: 'Thank you for the suggestion. We have added 5 new Economics mock tests to your dashboard.',
        sender: 'admin',
        senderName: 'Content Manager',
        timestamp: new Date('2025-01-10T16:30:00')
      }
    ],
    createdAt: new Date('2025-01-10T11:15:00'),
    updatedAt: new Date('2025-01-10T16:30:00'),
    resolvedAt: new Date('2025-01-10T16:30:00'),
    tags: ['content_request', 'mock_tests'],
    satisfaction: 5
  },
  {
    id: 'ticket-004',
    subject: 'How to download study materials for offline use?',
    category: 'general',
    priority: 'low',
    status: 'closed',
    assignedTo: 'Support Agent 3',
    messages: [
      {
        id: 'msg-006',
        content: 'I want to download PDF materials for offline study. How can I do this?',
        sender: 'user',
        senderName: 'Neha Singh',
        timestamp: new Date('2025-01-09T10:00:00')
      },
      {
        id: 'msg-007',
        content: 'You can download PDFs from the Resources section of each lesson. Click the download icon next to each material.',
        sender: 'admin',
        senderName: 'Support Agent 3',
        timestamp: new Date('2025-01-09T10:30:00')
      }
    ],
    createdAt: new Date('2025-01-09T10:00:00'),
    updatedAt: new Date('2025-01-09T10:30:00'),
    resolvedAt: new Date('2025-01-09T10:30:00'),
    tags: ['how_to', 'downloads'],
    satisfaction: 4
  },
  {
    id: 'ticket-005',
    subject: 'Account login issues after password reset',
    category: 'account',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'Security Team',
    messages: [
      {
        id: 'msg-008',
        content: 'I reset my password but still cannot login. Getting error "Invalid credentials" even with the new password.',
        sender: 'user',
        senderName: 'Vikash Kumar',
        timestamp: new Date('2025-01-12T08:45:00')
      }
    ],
    createdAt: new Date('2025-01-12T08:45:00'),
    updatedAt: new Date('2025-01-12T08:45:00'),
    tags: ['login_issue', 'password_reset', 'urgent'],
    satisfaction: undefined
  }
]

interface TicketFilters {
  search: string
  status: string
  category: string
  priority: string
  assignedTo: string
}

export default function SupportSystemPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const [filteredTickets, setFilteredTickets] = useState(mockTickets)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  
  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    assignedTo: 'all'
  })

  const [stats, setStats] = useState({
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: 2.4,
    avgSatisfaction: 4.2
  })

  // Filter logic
  useEffect(() => {
    let filtered = [...tickets]

    if (filters.search) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.messages.some(msg => msg.content.toLowerCase().includes(filters.search.toLowerCase())) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filters.status)
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === filters.category)
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority)
    }

    if (filters.assignedTo !== 'all') {
      filtered = filtered.filter(ticket => ticket.assignedTo === filters.assignedTo)
    }

    setFilteredTickets(filtered)
  }, [filters, tickets])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'closed': return <XCircle className="w-4 h-4 text-gray-600" />
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />
    }
  }

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return

    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: 'admin',
      senderName: 'Support Agent',
      timestamp: new Date()
    }

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, messages: [...ticket.messages, message], updatedAt: new Date() }
        : ticket
    ))

    setNewMessage('')
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support System</h1>
          <p className="text-gray-600 mt-1">Manage customer support tickets and communications</p>
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
            Create Ticket
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { title: 'Total Tickets', value: stats.totalTickets.toString(), icon: MessageSquare, color: 'blue', change: '+5' },
          { title: 'Open Tickets', value: stats.openTickets.toString(), icon: AlertCircle, color: 'red', change: '+2' },
          { title: 'In Progress', value: stats.inProgressTickets.toString(), icon: Clock, color: 'yellow', change: '+1' },
          { title: 'Resolved', value: stats.resolvedTickets.toString(), icon: CheckCircle, color: 'green', change: '+8' },
          { title: 'Avg Response', value: `${stats.avgResponseTime}h`, icon: TrendingUp, color: 'purple', change: '-0.3h' },
          { title: 'Satisfaction', value: `${stats.avgSatisfaction}/5`, icon: Star, color: 'orange', change: '+0.2' }
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
                stat.change.startsWith('+') && !stat.change.includes('h') ? 'text-green-600' : 
                stat.change.startsWith('-') || stat.change.includes('+0.') ? 'text-green-600' : 'text-red-600'
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
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="content">Content</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filters.assignedTo}
            onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Agents</option>
            <option value="Support Agent 1">Support Agent 1</option>
            <option value="Support Agent 2">Support Agent 2</option>
            <option value="Support Agent 3">Support Agent 3</option>
            <option value="Tech Support Team">Tech Support Team</option>
            <option value="Content Team">Content Team</option>
            <option value="Security Team">Security Team</option>
          </select>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="xl:col-span-2 space-y-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer ${
                selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(ticket.status)}
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{ticket.subject}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {ticket.messages[0]?.senderName}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatTimeAgo(ticket.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {ticket.messages.length} messages
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.messages[ticket.messages.length - 1]?.content}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {ticket.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {ticket.satisfaction && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600">{ticket.satisfaction}</span>
                    </div>
                  )}
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Assigned to: {ticket.assignedTo}
                </span>
                <div className="flex space-x-1">
                  {ticket.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {tag}
                    </span>
                  ))}
                  {ticket.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{ticket.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ticket Detail Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-6">
          {selectedTicket ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTicket.subject}</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Created: {selectedTicket.createdAt.toLocaleDateString()} by{' '}
                    {selectedTicket.messages[0]?.senderName}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-gray-50 ml-4' 
                        : 'bg-blue-50 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {message.senderName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                ))}
              </div>
              
              {/* Reply Form */}
              <div className="space-y-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      Close
                    </button>
                    <button
                      onClick={() => handleSendMessage(selectedTicket.id)}
                      disabled={!newMessage.trim()}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
              <p className="text-gray-600">Choose a ticket from the list to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}