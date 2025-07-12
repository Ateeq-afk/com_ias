'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, BookOpen, FileText, Trophy, User, CreditCard, 
  Settings, LogOut, Menu, X, ChevronRight, Sparkles,
  BarChart3, Clock, Target, Brain, GraduationCap, Zap,
  Flame, Bell
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
  { name: 'Lessons', href: '/dashboard/lessons', icon: Brain },
  { name: 'Tests', href: '/dashboard/tests', icon: FileText },
  { name: 'Performance', href: '/dashboard/performance', icon: BarChart3 },
  { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
]

const secondaryItems = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#FBFBFD]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-[#1D1D1F]">
                Community IAS
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-blue-600"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 p-3">
              <div className="space-y-1">
                {secondaryItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => signOut()}
                  className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-semibold text-[#1D1D1F]">
                      Community IAS
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* User Section */}
                <div className="border-t border-gray-200 p-3">
                  <div className="space-y-1">
                    {secondaryItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <button
                      onClick={() => signOut()}
                      className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center px-4 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="flex flex-1 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">
                Welcome back, {session?.user?.name || 'Student'}!
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Study Streak */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-orange-50 rounded-lg">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">7 day streak</span>
              </div>

              {/* Study Timer */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">2h 15m today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}