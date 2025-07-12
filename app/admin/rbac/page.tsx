'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, Settings, Key, Plus, Search, Filter, 
  Edit3, Trash2, Eye, MoreVertical, AlertTriangle, 
  CheckCircle, Clock, UserCheck, UserX, Download,
  RefreshCw, Copy, Lock, Unlock, Activity, Star,
  Globe, Calendar, Tag, Target, Zap
} from 'lucide-react'
import type { Role, UserRole, Permission, PermissionGroup, RoleAssignment, AuditEntry } from '../types/rbac'

// Mock RBAC data
const mockRoles: Role[] = [
  {
    id: 'role-001',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: [
      'analytics:read', 'analytics:export', 'users:read', 'users:write', 'users:delete',
      'content:read', 'content:write', 'content:publish', 'finance:read', 'finance:export',
      'automation:read', 'automation:write', 'support:read', 'support:write',
      'system:read', 'system:monitor', 'admin:users', 'admin:roles', 'admin:permissions'
    ] as Permission[],
    isSystem: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'system'
  },
  {
    id: 'role-002',
    name: 'Content Manager',
    description: 'Manage educational content and course materials',
    permissions: [
      'analytics:read', 'content:read', 'content:write', 'content:publish',
      'content:moderate', 'learning:read', 'users:read'
    ] as Permission[],
    isSystem: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20'),
    createdBy: 'admin@upsc.com'
  },
  {
    id: 'role-003',
    name: 'Support Agent',
    description: 'Handle customer support and user queries',
    permissions: [
      'support:read', 'support:write', 'support:assign', 'users:read',
      'analytics:read'
    ] as Permission[],
    isSystem: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-15'),
    createdBy: 'hr@upsc.com'
  },
  {
    id: 'role-004',
    name: 'Financial Analyst',
    description: 'Access financial data and generate reports',
    permissions: [
      'finance:read', 'finance:export', 'finance:reports', 'analytics:read',
      'users:read'
    ] as Permission[],
    isSystem: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-20'),
    createdBy: 'finance@upsc.com'
  },
  {
    id: 'role-005',
    name: 'Technical Admin',
    description: 'System monitoring and technical maintenance',
    permissions: [
      'system:read', 'system:monitor', 'system:maintenance', 'system:alerts',
      'automation:read', 'automation:write', 'analytics:read'
    ] as Permission[],
    isSystem: false,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-09-30'),
    createdBy: 'tech@upsc.com'
  }
]

const mockPermissionGroups: PermissionGroup[] = [
  {
    id: 'group-001',
    name: 'Analytics',
    description: 'Access to analytics and reporting features',
    permissions: ['analytics:read', 'analytics:export'],
    color: 'blue'
  },
  {
    id: 'group-002',
    name: 'User Management',
    description: 'Manage user accounts and profiles',
    permissions: ['users:read', 'users:write', 'users:delete', 'users:export', 'users:impersonate'],
    color: 'green'
  },
  {
    id: 'group-003',
    name: 'Content Management',
    description: 'Create and manage educational content',
    permissions: ['content:read', 'content:write', 'content:delete', 'content:publish', 'content:moderate'],
    color: 'purple'
  },
  {
    id: 'group-004',
    name: 'Financial Operations',
    description: 'Access financial data and transactions',
    permissions: ['finance:read', 'finance:export', 'finance:refunds', 'finance:reports'],
    color: 'orange'
  },
  {
    id: 'group-005',
    name: 'System Administration',
    description: 'System-level access and configuration',
    permissions: ['admin:users', 'admin:roles', 'admin:permissions', 'admin:settings', 'admin:logs'],
    color: 'red'
  }
]

const mockRoleAssignments: RoleAssignment[] = [
  {
    id: 'assign-001',
    userId: 'user-001',
    userEmail: 'admin@upsc.com',
    userName: 'System Administrator',
    roleId: 'role-001',
    roleName: 'Super Admin',
    assignedBy: 'system',
    assignedAt: new Date('2024-01-01'),
    status: 'active'
  },
  {
    id: 'assign-002',
    userId: 'user-002',
    userEmail: 'content@upsc.com',
    userName: 'Priya Sharma',
    roleId: 'role-002',
    roleName: 'Content Manager',
    assignedBy: 'admin@upsc.com',
    assignedAt: new Date('2024-02-15'),
    status: 'active'
  },
  {
    id: 'assign-003',
    userId: 'user-003',
    userEmail: 'support@upsc.com',
    userName: 'Rahul Kumar',
    roleId: 'role-003',
    roleName: 'Support Agent',
    assignedBy: 'admin@upsc.com',
    assignedAt: new Date('2024-03-01'),
    expiresAt: new Date('2025-03-01'),
    status: 'active'
  },
  {
    id: 'assign-004',
    userId: 'user-004',
    userEmail: 'finance@upsc.com',
    userName: 'Amit Patel',
    roleId: 'role-004',
    roleName: 'Financial Analyst',
    assignedBy: 'admin@upsc.com',
    assignedAt: new Date('2024-04-01'),
    status: 'active'
  },
  {
    id: 'assign-005',
    userId: 'user-005',
    userEmail: 'tech@upsc.com',
    userName: 'Vikash Singh',
    roleId: 'role-005',
    roleName: 'Technical Admin',
    assignedBy: 'admin@upsc.com',
    assignedAt: new Date('2024-05-01'),
    status: 'active'
  }
]

const mockAuditLog: AuditEntry[] = [
  {
    id: 'audit-001',
    userId: 'user-001',
    userEmail: 'admin@upsc.com',
    action: 'role_assigned',
    resource: 'role-002',
    details: { roleName: 'Content Manager', targetUser: 'content@upsc.com' },
    timestamp: new Date('2025-01-12T10:30:00'),
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    success: true
  },
  {
    id: 'audit-002',
    userId: 'user-003',
    userEmail: 'support@upsc.com',
    action: 'permission_denied',
    resource: 'users:delete',
    details: { attemptedAction: 'Delete user account', reason: 'Insufficient permissions' },
    timestamp: new Date('2025-01-12T09:15:00'),
    ip: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    success: false
  }
]

export default function RBACManagementPage() {
  const [activeTab, setActiveTab] = useState('roles')
  const [roles, setRoles] = useState(mockRoles)
  const [permissionGroups] = useState(mockPermissionGroups)
  const [roleAssignments, setRoleAssignments] = useState(mockRoleAssignments)
  const [auditLog] = useState(mockAuditLog)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getRoleStatusColor = (isSystem: boolean) => {
    return isSystem ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  const getPermissionGroupColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800'
    }
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'revoked': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'system' && role.isSystem) ||
                         (statusFilter === 'custom' && !role.isSystem)
    return matchesSearch && matchesStatus
  })

  const filteredAssignments = roleAssignments.filter(assignment => {
    const matchesSearch = assignment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalRoles: roles.length,
    systemRoles: roles.filter(r => r.isSystem).length,
    customRoles: roles.filter(r => !r.isSystem).length,
    totalAssignments: roleAssignments.length,
    activeAssignments: roleAssignments.filter(a => a.status === 'active').length,
    totalPermissions: Array.from(new Set(roles.flatMap(r => r.permissions))).length
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role & Access Management</h1>
          <p className="text-gray-600 mt-1">Manage roles, permissions, and user access controls</p>
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
            Create Role
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {[
          { title: 'Total Roles', value: stats.totalRoles.toString(), icon: Shield, color: 'blue', change: '+2' },
          { title: 'System Roles', value: stats.systemRoles.toString(), icon: Lock, color: 'indigo', change: '0' },
          { title: 'Custom Roles', value: stats.customRoles.toString(), icon: Key, color: 'purple', change: '+2' },
          { title: 'Total Assignments', value: stats.totalAssignments.toString(), icon: Users, color: 'green', change: '+5' },
          { title: 'Active Users', value: stats.activeAssignments.toString(), icon: UserCheck, color: 'emerald', change: '+3' },
          { title: 'Permissions', value: stats.totalPermissions.toString(), icon: Settings, color: 'orange', change: '+8' }
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

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'roles', name: 'Roles', icon: Shield },
              { id: 'permissions', name: 'Permission Groups', icon: Key },
              { id: 'assignments', name: 'Role Assignments', icon: Users },
              { id: 'audit', name: 'Audit Log', icon: Activity }
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
                placeholder="Search roles, permissions, or users..."
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
                {activeTab === 'roles' && (
                  <>
                    <option value="system">System Roles</option>
                    <option value="custom">Custom Roles</option>
                  </>
                )}
                {activeTab === 'assignments' && (
                  <>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </>
                )}
              </select>
              
              {selectedRoles.length > 0 && (
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">Bulk Actions</option>
                  <option value="activate">Activate</option>
                  <option value="deactivate">Deactivate</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="delete">Delete</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'roles' && (
            <div className="space-y-4">
              {filteredRoles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles([...selectedRoles, role.id])
                          } else {
                            setSelectedRoles(selectedRoles.filter(id => id !== role.id))
                          }
                        }}
                        className="mt-1 rounded border-gray-300"
                      />
                      
                      <div className={`p-3 rounded-lg ${role.isSystem ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {role.isSystem ? <Lock className="w-6 h-6 text-blue-600" /> : <Key className="w-6 h-6 text-green-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleStatusColor(role.isSystem)}`}>
                            {role.isSystem ? 'System' : 'Custom'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{role.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-1" />
                            {role.permissions.length} permissions
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {roleAssignments.filter(a => a.roleId === role.id).length} assignments
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {role.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.slice(0, 5).map(permission => (
                            <span key={permission} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {permission}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                              +{role.permissions.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {!role.isSystem && (
                        <>
                          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {permissionGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${group.color}-100`}>
                      <Shield className={`w-6 h-6 text-${group.color}-600`} />
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPermissionGroupColor(group.color)}`}>
                      {group.permissions.length} permissions
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="space-y-2">
                    {group.permissions.map(permission => (
                      <div key={permission} className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-700">{permission}</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {filteredAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        assignment.status === 'active' ? 'bg-green-100' :
                        assignment.status === 'expired' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {assignment.status === 'active' ? <UserCheck className="w-6 h-6 text-green-600" /> :
                         assignment.status === 'expired' ? <UserX className="w-6 h-6 text-red-600" /> :
                         <Users className="w-6 h-6 text-gray-600" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.userName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{assignment.userEmail}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            {assignment.roleName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Assigned {assignment.assignedAt.toLocaleDateString()}
                          </div>
                          {assignment.expiresAt && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Expires {assignment.expiresAt.toLocaleDateString()}
                            </div>
                          )}
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
                      <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                        <UserX className="w-4 h-4" />
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

          {activeTab === 'audit' && (
            <div className="space-y-4">
              {auditLog.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${entry.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        {entry.success ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{entry.action.replace('_', ' ').toUpperCase()}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <p className="text-gray-600">User: {entry.userEmail}</p>
                          {entry.resource && <p className="text-gray-600">Resource: {entry.resource}</p>}
                          <p className="text-gray-600">IP: {entry.ip}</p>
                        </div>
                        
                        {entry.details && (
                          <div className="bg-gray-50 rounded p-3 text-sm">
                            <pre className="text-gray-700">{JSON.stringify(entry.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}