'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity, Server, Database, Wifi, Cpu, HardDrive, Globe,
  AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown,
  RefreshCw, Download, Settings, Bell, Zap, BarChart3,
  Monitor, Gauge, Eye, MoreVertical, Filter, Calendar
} from 'lucide-react'
import type { SystemHealth, ServiceStatus } from '../types'

// Mock system health data
const mockSystemHealth: SystemHealth = {
  server: {
    cpu: 67,
    memory: 78,
    disk: 45,
    uptime: 99.98
  },
  database: {
    connections: 247,
    queryTime: 45,
    slowQueries: 12,
    size: 2340000000 // 2.34 GB
  },
  api: {
    responseTime: 245,
    errorRate: 0.08,
    requestsPerSecond: 1247,
    activeEndpoints: 47
  },
  cdn: {
    hitRate: 96.8,
    bandwidth: 12400000, // 12.4 MB/s
    requests: 234567,
    errors: 23
  },
  services: [
    {
      name: 'User Authentication',
      status: 'healthy',
      responseTime: 123,
      lastCheck: new Date('2025-01-12T10:30:00'),
      errorCount: 0,
      uptime: 99.99
    },
    {
      name: 'Content Delivery',
      status: 'healthy',
      responseTime: 89,
      lastCheck: new Date('2025-01-12T10:29:30'),
      errorCount: 2,
      uptime: 99.95
    },
    {
      name: 'Payment Gateway',
      status: 'warning',
      responseTime: 2340,
      lastCheck: new Date('2025-01-12T10:29:00'),
      errorCount: 5,
      uptime: 99.87
    },
    {
      name: 'Email Service',
      status: 'healthy',
      responseTime: 567,
      lastCheck: new Date('2025-01-12T10:28:45'),
      errorCount: 1,
      uptime: 99.92
    },
    {
      name: 'Video Streaming',
      status: 'critical',
      responseTime: 5670,
      lastCheck: new Date('2025-01-12T10:28:00'),
      errorCount: 23,
      uptime: 98.45
    },
    {
      name: 'Search Engine',
      status: 'healthy',
      responseTime: 234,
      lastCheck: new Date('2025-01-12T10:27:30'),
      errorCount: 0,
      uptime: 99.98
    }
  ]
}

const mockAlerts = [
  {
    id: 'alert-001',
    type: 'critical',
    title: 'High Error Rate in Video Streaming',
    message: 'Video streaming service showing 15% error rate for the last 10 minutes',
    timestamp: new Date('2025-01-12T10:25:00'),
    resolved: false,
    service: 'Video Streaming'
  },
  {
    id: 'alert-002',
    type: 'warning',
    title: 'Payment Gateway Response Time',
    message: 'Payment gateway response time exceeding 2 seconds',
    timestamp: new Date('2025-01-12T10:20:00'),
    resolved: false,
    service: 'Payment Gateway'
  },
  {
    id: 'alert-003',
    type: 'info',
    title: 'Database Maintenance Completed',
    message: 'Scheduled database maintenance completed successfully',
    timestamp: new Date('2025-01-12T09:30:00'),
    resolved: true,
    service: 'Database'
  }
]

export default function PerformanceMonitoringPage() {
  const [systemHealth, setSystemHealth] = useState(mockSystemHealth)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('1h')
  const [alertFilter, setAlertFilter] = useState('all')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        server: {
          ...prev.server,
          cpu: Math.max(20, Math.min(90, prev.server.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(30, Math.min(95, prev.server.memory + (Math.random() - 0.5) * 5))
        },
        api: {
          ...prev.api,
          responseTime: Math.max(100, Math.min(500, prev.api.responseTime + (Math.random() - 0.5) * 50)),
          requestsPerSecond: Math.max(800, Math.min(1500, prev.api.requestsPerSecond + (Math.random() - 0.5) * 100))
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'offline': return <AlertTriangle className="w-4 h-4 text-gray-600" />
      default: return <CheckCircle className="w-4 h-4 text-green-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getHealthColor = (value: number, type: string) => {
    if (type === 'uptime') {
      if (value >= 99.9) return 'text-green-600'
      if (value >= 99) return 'text-yellow-600'
      return 'text-red-600'
    }
    
    if (value >= 80) return 'text-red-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatBytes = (bytes: number) => {
    if (bytes >= 1000000000) {
      return `${(bytes / 1000000000).toFixed(1)} GB`
    } else if (bytes >= 1000000) {
      return `${(bytes / 1000000).toFixed(1)} MB`
    } else if (bytes >= 1000) {
      return `${(bytes / 1000).toFixed(1)} KB`
    }
    return `${bytes} B`
  }

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true
    if (alertFilter === 'active') return !alert.resolved
    if (alertFilter === 'resolved') return alert.resolved
    return alert.type === alertFilter
  })

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Performance</h1>
          <p className="text-gray-600 mt-1">Monitor system health and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
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

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'CPU Usage',
            value: `${systemHealth.server.cpu.toFixed(1)}%`,
            icon: Cpu,
            color: systemHealth.server.cpu > 80 ? 'red' : systemHealth.server.cpu > 60 ? 'yellow' : 'green',
            trend: systemHealth.server.cpu > 70 ? 'up' : 'down'
          },
          {
            title: 'Memory Usage',
            value: `${systemHealth.server.memory.toFixed(1)}%`,
            icon: Monitor,
            color: systemHealth.server.memory > 80 ? 'red' : systemHealth.server.memory > 60 ? 'yellow' : 'green',
            trend: systemHealth.server.memory > 70 ? 'up' : 'down'
          },
          {
            title: 'Disk Usage',
            value: `${systemHealth.server.disk.toFixed(1)}%`,
            icon: HardDrive,
            color: systemHealth.server.disk > 80 ? 'red' : systemHealth.server.disk > 60 ? 'yellow' : 'green',
            trend: 'stable'
          },
          {
            title: 'System Uptime',
            value: `${systemHealth.server.uptime.toFixed(2)}%`,
            icon: Activity,
            color: 'green',
            trend: 'up'
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
              <div className={`flex items-center ${
                metric.trend === 'up' ? 'text-red-600' : 
                metric.trend === 'down' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                 metric.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
                 <Activity className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* API Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">API Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Real-time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{systemHealth.api.responseTime}ms</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{systemHealth.api.requestsPerSecond.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Requests/sec</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <span className="text-sm text-red-600 font-medium">{systemHealth.api.errorRate.toFixed(2)}%</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{systemHealth.api.errorRate.toFixed(2)}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Globe className="w-6 h-6 text-purple-600" />
                <span className="text-sm text-purple-600 font-medium">Active</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{systemHealth.api.activeEndpoints}</div>
              <div className="text-sm text-gray-600">Endpoints</div>
            </div>
          </div>
        </motion.div>

        {/* Database Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Database Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Active Connections</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{systemHealth.database.connections}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Avg Query Time</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{systemHealth.database.queryTime}ms</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Slow Queries</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{systemHealth.database.slowQueries}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <HardDrive className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Database Size</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{formatBytes(systemHealth.database.size)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Services Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Monitoring</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth.services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                service.status === 'healthy' ? 'border-green-200 bg-green-50' :
                service.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                service.status === 'critical' ? 'border-red-200 bg-red-50' :
                'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getStatusIcon(service.status)}
                  <span className="ml-2 font-medium text-gray-900">{service.name}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Response:</span>
                  <div className="font-medium text-gray-900">{service.responseTime}ms</div>
                </div>
                <div>
                  <span className="text-gray-600">Uptime:</span>
                  <div className={`font-medium ${getHealthColor(service.uptime, 'uptime')}`}>
                    {service.uptime.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Errors:</span>
                  <div className="font-medium text-gray-900">{service.errorCount}</div>
                </div>
                <div>
                  <span className="text-gray-600">Last Check:</span>
                  <div className="font-medium text-gray-900">
                    {service.lastCheck.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Alerts Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">All Alerts</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
        
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                alert.resolved ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.type)}`}>
                      {alert.type}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">{alert.service}</span>
                    {alert.resolved && (
                      <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleString()}
                  </span>
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}