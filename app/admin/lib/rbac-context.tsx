'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Role, Permission, RBACContext, AccessLog } from '../types/rbac'

// Mock current user data - in real app this would come from authentication
const mockCurrentUser = {
  id: 'user-001',
  email: 'admin@upsc.com',
  name: 'System Administrator',
  roles: [
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
    }
  ]
}

// Create the RBAC context
const RBACContextProvider = createContext<RBACContext | undefined>(undefined)

interface RBACProviderProps {
  children: ReactNode
}

export function RBACProvider({ children }: RBACProviderProps) {
  const [currentUser] = useState(mockCurrentUser)
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])

  // Get all permissions from user's roles
  const getUserPermissions = (): Permission[] => {
    const allPermissions = currentUser.roles.flatMap(role => role.permissions)
    return Array.from(new Set(allPermissions)) // Remove duplicates
  }

  // Get user's roles
  const getUserRoles = (): Role[] => {
    return currentUser.roles
  }

  // Check if user has a specific permission
  const checkPermission = (permission: Permission, resource?: string): boolean => {
    const userPermissions = getUserPermissions()
    const hasPermission = userPermissions.includes(permission)
    
    // Log the access attempt
    logAccess(`check_permission_${permission}`, resource || 'unknown', permission, hasPermission)
    
    return hasPermission
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    const userPermissions = getUserPermissions()
    return permissions.some(permission => userPermissions.includes(permission))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    const userPermissions = getUserPermissions()
    return permissions.every(permission => userPermissions.includes(permission))
  }

  // Log access attempts for audit trail
  const logAccess = (action: string, resource: string, permission: Permission, granted: boolean): void => {
    const logEntry: AccessLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      action,
      resource,
      permission,
      granted,
      timestamp: new Date(),
      ip: '192.168.1.100', // In real app, get from request
      userAgent: navigator.userAgent,
      details: {
        userEmail: currentUser.email,
        userName: currentUser.name
      }
    }

    setAccessLogs(prev => [logEntry, ...prev.slice(0, 999)]) // Keep last 1000 logs
  }

  // Context value
  const contextValue: RBACContext = {
    currentUser: {
      id: currentUser.id,
      email: currentUser.email,
      roles: currentUser.roles,
      permissions: getUserPermissions()
    },
    checkPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUserRoles,
    getUserPermissions,
    logAccess
  }

  return (
    <RBACContextProvider.Provider value={contextValue}>
      {children}
    </RBACContextProvider.Provider>
  )
}

// Custom hook to use RBAC context
export function useRBAC(): RBACContext {
  const context = useContext(RBACContextProvider)
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider')
  }
  return context
}

// Higher-order component for protecting routes/components
interface ProtectedComponentProps {
  children: ReactNode
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function ProtectedComponent({ 
  children, 
  permissions = [], 
  requireAll = false, 
  fallback = <div className="p-4 text-red-600">Access Denied</div> 
}: ProtectedComponentProps) {
  const { hasAnyPermission, hasAllPermissions } = useRBAC()

  if (permissions.length === 0) {
    return <>{children}</>
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Hook for conditional rendering based on permissions
export function usePermissions() {
  const { checkPermission, hasAnyPermission, hasAllPermissions } = useRBAC()

  return {
    can: checkPermission,
    canAny: hasAnyPermission,
    canAll: hasAllPermissions
  }
}

// Permission-based button component
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  children: ReactNode
}

export function PermissionButton({ 
  permission, 
  permissions = [], 
  requireAll = false, 
  children, 
  ...props 
}: PermissionButtonProps) {
  const { checkPermission, hasAnyPermission, hasAllPermissions } = useRBAC()

  let hasAccess = true

  if (permission) {
    hasAccess = checkPermission(permission)
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
  }

  if (!hasAccess) {
    return null
  }

  return <button {...props}>{children}</button>
}

export default RBACProvider