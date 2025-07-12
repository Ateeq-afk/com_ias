'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Users, FileText, DollarSign, Settings, Bell,
  Search, Menu, X, ChevronDown, Shield, Activity, Zap,
  MessageSquare, TrendingUp, Globe, Database, Mail,
  HelpCircle, LogOut, User, Moon, Sun, Maximize2,
  RefreshCw, Download, Filter, Calendar, Clock, Key
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RBACProvider, useRBAC, ProtectedComponent } from './lib/rbac-context'
import type { Permission } from './types/rbac'

const navigationItems = [
  {
    name: 'Overview',
    href: '/admin',
    icon: BarChart3,
    badge: null,
    description: 'Real-time analytics and KPIs',
    permissions: ['analytics:read'] as Permission[]
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    badge: '78,543',
    description: 'User management and analytics',
    permissions: ['users:read'] as Permission[]
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    badge: 'Review',
    description: 'Content creation and management',
    permissions: ['content:read'] as Permission[]
  },
  {
    name: 'Finance',
    href: '/admin/finance',
    icon: DollarSign,
    badge: '₹2.4M',
    description: 'Revenue and payment tracking',
    permissions: ['finance:read'] as Permission[]
  },
  {
    name: 'Learning Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    badge: null,
    description: 'Educational insights and metrics',
    permissions: ['learning:read'] as Permission[]
  },
  {
    name: 'Automation',
    href: '/admin/automation',
    icon: Zap,
    badge: '12 Active',
    description: 'Automated campaigns and workflows',
    permissions: ['automation:read'] as Permission[]
  },
  {
    name: 'Support',
    href: '/admin/support',
    icon: MessageSquare,
    badge: '23',
    description: 'Customer support and tickets',
    permissions: ['support:read'] as Permission[]
  },
  {
    name: 'System Health',
    href: '/admin/system',
    icon: Activity,
    badge: '99.9%',
    description: 'Performance and monitoring',
    permissions: ['system:read'] as Permission[]
  },
  {
    name: 'RBAC',
    href: '/admin/rbac',
    icon: Key,
    badge: null,
    description: 'Role & access management',
    permissions: ['admin:roles'] as Permission[]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
    description: 'Platform configuration',
    permissions: ['admin:settings'] as Permission[]
  }
]

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const pathname = usePathname()
  const { hasAnyPermission, currentUser } = useRBAC()

  const quickActions = [
    { name: 'Send Announcement', icon: Mail, action: 'announcement' },
    { name: 'Generate Report', icon: Download, action: 'report' },
    { name: 'Create Campaign', icon: TrendingUp, action: 'campaign' },
    { name: 'Export Users', icon: Users, action: 'export' },
    { name: 'System Backup', icon: Database, action: 'backup' },
    { name: 'Emergency Alert', icon: Bell, action: 'alert' }
  ]

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Daily backup completed', time: '1 hr ago' },
    { id: 3, type: 'success', message: 'New milestone: 80K users!', time: '3 hrs ago' }
  ]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        // Open command palette
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        setSidebarOpen(!sidebarOpen)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [sidebarOpen])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="ml-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    UPSC Admin
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users, content, tickets... (Ctrl+K)"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quick Actions */}
              <div className="relative">
                <button
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Zap className="h-6 w-6" />
                </button>
                
                <AnimatePresence>
                  {quickActionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                      </div>
                      {quickActions.map((action) => (
                        <button
                          key={action.action}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <action.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{action.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser.roles[0]?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Logged in as</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.roles[0]?.name || 'User'}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{currentUser.permissions.length} permissions</p>
                      </div>
                      <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        View Profile
                      </Link>
                      <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Settings
                      </Link>
                      <Link href="/admin/audit-logs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Audit Logs
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-4 mb-6">
                    <div className="w-full">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">System Status</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs opacity-90">All systems operational</div>
                        <div className="text-xs opacity-75 mt-1">78,543 active users</div>
                      </div>
                    </div>
                  </div>

                  <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigationItems.map((item) => {
                      // Check if user has permission to view this navigation item
                      if (!hasAnyPermission(item.permissions)) {
                        return null
                      }

                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <item.icon
                            className={`mr-3 flex-shrink-0 h-5 w-5 ${
                              isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="truncate">{item.name}</span>
                            {item.description && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          {item.badge && (
                            <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                              isActive
                                ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* Recent Alerts */}
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Recent Alerts
                  </h3>
                  <div className="space-y-2">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          alert.type === 'warning' ? 'bg-yellow-400' :
                          alert.type === 'info' ? 'bg-blue-400' : 'bg-green-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>

      {/* Global Loading State */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Live</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RBACProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </RBACProvider>
  )
}