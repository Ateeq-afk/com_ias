'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Users, 
  Calendar, BarChart3, PieChart, LineChart, Download, RefreshCw,
  AlertCircle, CheckCircle, XCircle, Clock, Target, Zap,
  ArrowUpRight, ArrowDownRight, Filter, Search, Eye, MoreVertical
} from 'lucide-react'
import type { FinancialMetrics, Payment } from '../types'

// Mock financial data
const mockFinancialData: FinancialMetrics = {
  revenue: {
    total: 127500000, // ₹12.75 Crores
    monthly: [2100000, 2300000, 2800000, 3100000, 3400000, 3200000], // Last 6 months
    byPlan: {
      'Premium Plus': 65000000,
      'Basic Plan': 35000000,
      'Free Plan': 0
    },
    byRegion: {
      'Delhi': 32000000,
      'Maharashtra': 28000000,
      'Karnataka': 18000000,
      'Uttar Pradesh': 15000000,
      'Others': 34500000
    },
    growth: 24.3
  },
  subscriptions: {
    active: 45678,
    new: 3456,
    cancelled: 234,
    churnRate: 2.8,
    upgrades: 567,
    downgrades: 89
  },
  payments: {
    successful: 12456,
    failed: 234,
    pending: 45,
    refunds: 67,
    chargebacks: 12
  },
  metrics: {
    arpu: 2850, // Average Revenue Per User
    ltv: 12400, // Lifetime Value
    cac: 1200, // Customer Acquisition Cost
    paybackPeriod: 4.2
  }
}

const mockRecentTransactions: Payment[] = [
  {
    id: 'txn-001',
    amount: 4999,
    currency: 'INR',
    status: 'success',
    paymentMethod: 'UPI',
    transactionId: 'UPI123456789',
    date: new Date('2025-01-12T10:30:00'),
    invoice: 'INV-2025-001'
  },
  {
    id: 'txn-002',
    amount: 1999,
    currency: 'INR',
    status: 'success',
    paymentMethod: 'Credit Card',
    transactionId: 'CC987654321',
    date: new Date('2025-01-12T09:15:00'),
    invoice: 'INV-2025-002'
  },
  {
    id: 'txn-003',
    amount: 4999,
    currency: 'INR',
    status: 'failed',
    paymentMethod: 'Net Banking',
    transactionId: 'NB456789123',
    date: new Date('2025-01-12T08:45:00')
  },
  {
    id: 'txn-004',
    amount: 999,
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'Wallet',
    transactionId: 'WL789123456',
    date: new Date('2025-01-12T07:20:00')
  }
]

export default function FinancialDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [financialData, setFinancialData] = useState(mockFinancialData)
  const [transactions, setTransactions] = useState(mockRecentTransactions)
  const [refreshing, setRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFinancialData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          total: prev.revenue.total + Math.floor(Math.random() * 5000)
        },
        subscriptions: {
          ...prev.subscriptions,
          active: prev.subscriptions.active + Math.floor(Math.random() * 3) - 1
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    } else {
      return `₹${amount}`
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor revenue, payments, and financial metrics</p>
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Revenue',
            value: formatCurrency(financialData.revenue.total),
            change: `+${financialData.revenue.growth}%`,
            changeType: 'increase',
            icon: DollarSign,
            color: 'green'
          },
          {
            title: 'Monthly Revenue',
            value: formatCurrency(financialData.revenue.monthly[financialData.revenue.monthly.length - 1]),
            change: '+18.2%',
            changeType: 'increase',
            icon: TrendingUp,
            color: 'blue'
          },
          {
            title: 'Active Subscriptions',
            value: financialData.subscriptions.active.toLocaleString(),
            change: '+12.5%',
            changeType: 'increase',
            icon: Users,
            color: 'purple'
          },
          {
            title: 'Churn Rate',
            value: `${financialData.subscriptions.churnRate}%`,
            change: '-0.8%',
            changeType: 'decrease',
            icon: AlertCircle,
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
              <div className={`flex items-center ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.changeType === 'increase' ? 
                  <ArrowUpRight className="w-4 h-4" /> : 
                  <ArrowDownRight className="w-4 h-4" />
                }
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

      {/* Revenue Charts and Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Monthly Revenue</span>
              </div>
              <div className="flex items-center ml-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Revenue Trend Chart</p>
              <p className="text-xs text-gray-400">6-month growth visualization</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.metrics.arpu)}</p>
              <p className="text-sm text-gray-600">ARPU</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.metrics.ltv)}</p>
              <p className="text-sm text-gray-600">LTV</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(financialData.metrics.cac)}</p>
              <p className="text-sm text-gray-600">CAC</p>
            </div>
          </div>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Plan</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(financialData.revenue.byPlan).map(([plan, revenue], index) => {
              const percentage = (revenue / financialData.revenue.total) * 100
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500']
              
              return (
                <div key={plan} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colors[index]} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700">{plan}</span>
                    </div>
                    <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{formatCurrency(revenue)}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Upgrades</span>
                <div className="font-semibold text-green-600">+{financialData.subscriptions.upgrades}</div>
              </div>
              <div>
                <span className="text-gray-600">Downgrades</span>
                <div className="font-semibold text-red-600">-{financialData.subscriptions.downgrades}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Analytics & Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Payment Success Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Analytics</h3>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-sm text-green-600 font-medium">+2.1%</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-600">{financialData.payments.successful.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <XCircle className="w-8 h-8 text-red-600" />
                <span className="text-sm text-red-600 font-medium">-0.8%</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-red-600">{financialData.payments.failed.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">
                {((financialData.payments.successful / (financialData.payments.successful + financialData.payments.failed)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Payments</span>
              <span className="font-semibold text-yellow-600">{financialData.payments.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Refunds</span>
              <span className="font-semibold text-purple-600">{financialData.payments.refunds}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Chargebacks</span>
              <span className="font-semibold text-red-600">{financialData.payments.chargebacks}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.status === 'success' ? 'bg-green-100' :
                    transaction.status === 'failed' ? 'bg-red-100' :
                    transaction.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    {transaction.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     transaction.status === 'failed' ? <XCircle className="w-4 h-4 text-red-600" /> :
                     transaction.status === 'pending' ? <Clock className="w-4 h-4 text-yellow-600" /> :
                     <AlertCircle className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                    <div className="text-sm text-gray-500">{transaction.paymentMethod}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {transaction.date.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All Transactions →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Regional Revenue Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue by Region</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(financialData.revenue.byRegion).map(([region, revenue], index) => {
            const percentage = (revenue / financialData.revenue.total) * 100
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500']
            
            return (
              <div key={region} className="text-center">
                <div className={`w-full h-24 ${colors[index]} rounded-lg mb-3 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-2 left-0 right-0 text-white text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="font-medium text-gray-900">{region}</div>
                <div className="text-sm text-gray-600">{formatCurrency(revenue)}</div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}