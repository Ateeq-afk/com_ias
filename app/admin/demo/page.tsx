'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, Users, FileText, DollarSign, TrendingUp, Zap,
  MessageSquare, Activity, Shield, Play, Pause, RotateCcw,
  CheckCircle, Clock, Star, Award, Target, BarChart3,
  Globe, Database, Mail, Phone, Video, Code, Layers,
  Lock, Key, Eye, EyeOff, Lightbulb, Rocket, Heart,
  RefreshCw, Download, Settings, Bell, Search, Filter
} from 'lucide-react'
import Link from 'next/link'
import { useRBAC, ProtectedComponent } from '../lib/rbac-context'

const demoFeatures = [
  {
    id: 'analytics',
    title: 'Real-time Analytics Dashboard',
    description: 'Comprehensive analytics with live data updates, user metrics, and performance tracking',
    icon: BarChart3,
    color: 'blue',
    href: '/admin',
    features: [
      'Live user activity monitoring',
      'Revenue and financial metrics',
      'Engagement analytics',
      'System performance indicators',
      'Regional distribution maps',
      'Real-time notifications'
    ],
    permissions: ['analytics:read']
  },
  {
    id: 'users',
    title: 'Advanced User Management',
    description: 'Complete user lifecycle management with advanced filtering and bulk operations',
    icon: Users,
    color: 'green',
    href: '/admin/users',
    features: [
      'Advanced search and filtering',
      'Bulk user operations',
      'Subscription management',
      'Learning progress tracking',
      'Payment history analysis',
      'User communication tools'
    ],
    permissions: ['users:read']
  },
  {
    id: 'content',
    title: 'Content Management Suite',
    description: 'Comprehensive content creation, editing, and performance tracking system',
    icon: FileText,
    color: 'purple',
    href: '/admin/content',
    features: [
      'Multi-format content support',
      'Collaborative editing tools',
      'Performance analytics',
      'SEO optimization',
      'Version control',
      'Publication workflows'
    ],
    permissions: ['content:read']
  },
  {
    id: 'finance',
    title: 'Financial Dashboard',
    description: 'Complete financial oversight with revenue tracking and payment analytics',
    icon: DollarSign,
    color: 'orange',
    href: '/admin/finance',
    features: [
      'Revenue trend analysis',
      'Payment success tracking',
      'Regional revenue breakdown',
      'Subscription analytics',
      'Refund management',
      'Financial forecasting'
    ],
    permissions: ['finance:read']
  },
  {
    id: 'learning',
    title: 'Learning Analytics Engine',
    description: 'Deep insights into educational performance and learning patterns',
    icon: TrendingUp,
    color: 'indigo',
    href: '/admin/analytics',
    features: [
      'Subject performance analysis',
      'Learning completion funnels',
      'Weak area identification',
      'Success predictors',
      'Engagement metrics',
      'AI-powered insights'
    ],
    permissions: ['learning:read']
  },
  {
    id: 'automation',
    title: 'Automation Center',
    description: 'Intelligent workflow automation and campaign management system',
    icon: Zap,
    color: 'yellow',
    href: '/admin/automation',
    features: [
      'Automated workflows',
      'Email campaign management',
      'User engagement triggers',
      'Performance-based actions',
      'A/B testing capabilities',
      'Campaign analytics'
    ],
    permissions: ['automation:read']
  },
  {
    id: 'support',
    title: 'Support System',
    description: 'Comprehensive customer support with ticket management and live chat',
    icon: MessageSquare,
    color: 'pink',
    href: '/admin/support',
    features: [
      'Ticket management system',
      'Real-time messaging',
      'Priority classification',
      'Agent assignment',
      'Customer satisfaction tracking',
      'Knowledge base integration'
    ],
    permissions: ['support:read']
  },
  {
    id: 'system',
    title: 'Performance Monitoring',
    description: 'Real-time system health monitoring and performance optimization',
    icon: Activity,
    color: 'red',
    href: '/admin/system',
    features: [
      'Server health monitoring',
      'API performance tracking',
      'Database optimization',
      'Service status monitoring',
      'Alert management',
      'Performance analytics'
    ],
    permissions: ['system:read']
  },
  {
    id: 'rbac',
    title: 'Role-Based Access Control',
    description: 'Advanced permission management with role-based security controls',
    icon: Shield,
    color: 'emerald',
    href: '/admin/rbac',
    features: [
      'Role management system',
      'Permission group controls',
      'User role assignments',
      'Audit logging',
      'Security policies',
      'Access monitoring'
    ],
    permissions: ['admin:roles']
  }
]

const platformStats = {
  totalUsers: 78543,
  monthlyRevenue: 3200000,
  courseCompletions: 156780,
  satisfactionScore: 4.7,
  systemUptime: 99.98,
  activeAutomations: 24,
  supportTickets: 89,
  contentItems: 2340
}

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Content Manager',
    avatar: '👩‍💼',
    quote: 'The content management system has revolutionized how we create and publish educational materials. The analytics help us understand what works best for our students.'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Finance Director',
    avatar: '👨‍💼',
    quote: 'Financial tracking and revenue analytics provide unprecedented visibility into our business performance. The automated reporting saves hours every week.'
  },
  {
    name: 'Anita Patel',
    role: 'Student Success Manager',
    avatar: '👩‍🎓',
    quote: 'The learning analytics engine helps us identify struggling students early and provide targeted support. Student success rates have improved by 35%.'
  }
]

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [liveStats, setLiveStats] = useState(platformStats)
  const { hasAnyPermission, currentUser } = useRBAC()

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationRunning) {
        setLiveStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers + Math.floor(Math.random() * 5),
          monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 1000),
          courseCompletions: prev.courseCompletions + Math.floor(Math.random() * 3),
          supportTickets: Math.max(0, prev.supportTickets + Math.floor(Math.random() * 3) - 1)
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [simulationRunning])

  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning)
  }

  const resetStats = () => {
    setLiveStats(platformStats)
    setSimulationRunning(false)
  }

  const accessibleFeatures = demoFeatures.filter(feature => 
    hasAnyPermission(feature.permissions)
  )

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">UPSC Admin Platform Demo</h1>
              <p className="text-xl text-blue-100 mt-2">Experience the future of educational administration</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-blue-200" />
                <motion.span 
                  key={liveStats.totalUsers}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold"
                >
                  {liveStats.totalUsers.toLocaleString()}
                </motion.span>
              </div>
              <p className="text-blue-100 text-sm mt-2">Total Students</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-green-200" />
                <motion.span 
                  key={liveStats.monthlyRevenue}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold"
                >
                  ₹{(liveStats.monthlyRevenue / 100000).toFixed(1)}L
                </motion.span>
              </div>
              <p className="text-blue-100 text-sm mt-2">Monthly Revenue</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Award className="w-8 h-8 text-yellow-200" />
                <motion.span 
                  key={liveStats.courseCompletions}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold"
                >
                  {liveStats.courseCompletions.toLocaleString()}
                </motion.span>
              </div>
              <p className="text-blue-100 text-sm mt-2">Completions</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <Star className="w-8 h-8 text-purple-200" />
                <span className="text-2xl font-bold">{liveStats.satisfactionScore}/5</span>
              </div>
              <p className="text-blue-100 text-sm mt-2">Satisfaction</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={toggleSimulation}
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              {simulationRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {simulationRunning ? 'Pause Live Demo' : 'Start Live Demo'}
            </button>
            
            <button
              onClick={resetStats}
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </button>

            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${simulationRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{simulationRunning ? 'Live Updates Active' : 'Updates Paused'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Welcome, {currentUser.roles[0]?.name || 'User'}</h3>
              <p className="text-gray-600">{currentUser.email}</p>
              <p className="text-sm text-gray-500">{currentUser.permissions.length} permissions • {accessibleFeatures.length} accessible features</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Role-Based Access Active</p>
            <p className="text-xs text-green-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Security Enabled
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature Showcase */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
            <p className="text-gray-600">Explore the comprehensive admin capabilities</p>
          </div>
          <div className="text-sm text-gray-500">
            Showing {accessibleFeatures.length} of {demoFeatures.length} features based on your permissions
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {accessibleFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${feature.color}-100`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={feature.href}
                    className={`px-3 py-1 rounded-lg text-sm font-medium bg-${feature.color}-100 text-${feature.color}-700 hover:bg-${feature.color}-200 transition-colors`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Live
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    {activeDemo === feature.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>

              {activeDemo === feature.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 pt-4"
                >
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {accessibleFeatures.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className={`flex flex-col items-center p-4 rounded-xl hover:bg-${feature.color}-50 transition-colors group`}
            >
              <div className={`p-2 rounded-lg bg-${feature.color}-100 group-hover:bg-${feature.color}-200 transition-colors`}>
                <feature.icon className={`w-5 h-5 text-${feature.color}-600`} />
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">{feature.title}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">What Our Team Says</h3>
          <p className="text-gray-600">Real feedback from platform administrators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              <div className="flex items-center mt-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technical Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Technical Architecture</h3>
            <p className="text-gray-300">Built with modern technologies for scale and reliability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 rounded-xl p-4">
            <Layers className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="font-semibold mb-2">Frontend</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Next.js 14 with App Router</li>
              <li>• TypeScript for type safety</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Framer Motion animations</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <Database className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="font-semibold mb-2">Backend</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• RESTful API architecture</li>
              <li>• Real-time data updates</li>
              <li>• Comprehensive analytics</li>
              <li>• Automated workflows</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="font-semibold mb-2">Security</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Role-based access control</li>
              <li>• Permission management</li>
              <li>• Audit logging</li>
              <li>• Data encryption</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <Rocket className="w-8 h-8 text-orange-400 mb-3" />
            <h4 className="font-semibold mb-2">Performance</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Real-time monitoring</li>
              <li>• Optimized queries</li>
              <li>• Responsive design</li>
              <li>• Progressive loading</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Heart className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Education?</h3>
          <p className="text-blue-100 mb-6">
            Experience the future of educational administration with our comprehensive platform. 
            Built specifically for UPSC preparation institutes and educational organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Dashboard
            </Link>
            <Link
              href="/admin/rbac"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              View Security Features
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}