// Role-Based Access Control Types for Admin Dashboard

export type Permission = 
  // Analytics permissions
  | 'analytics:read' 
  | 'analytics:export'
  
  // User management permissions
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'users:export'
  | 'users:impersonate'
  
  // Content management permissions
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'content:publish'
  | 'content:moderate'
  
  // Financial permissions
  | 'finance:read'
  | 'finance:export'
  | 'finance:refunds'
  | 'finance:reports'
  
  // Learning analytics permissions
  | 'learning:read'
  | 'learning:export'
  | 'learning:insights'
  
  // Automation permissions
  | 'automation:read'
  | 'automation:write'
  | 'automation:execute'
  | 'automation:delete'
  
  // Support permissions
  | 'support:read'
  | 'support:write'
  | 'support:assign'
  | 'support:close'
  
  // System permissions
  | 'system:read'
  | 'system:monitor'
  | 'system:maintenance'
  | 'system:alerts'
  
  // Admin permissions
  | 'admin:users'
  | 'admin:roles'
  | 'admin:permissions'
  | 'admin:settings'
  | 'admin:logs'

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface UserRole {
  userId: string
  roleId: string
  assignedAt: Date
  assignedBy: string
  expiresAt?: Date
}

export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: Permission[]
  color: string
}

export interface RoleTemplate {
  id: string
  name: string
  description: string
  permissions: Permission[]
  category: 'educational' | 'technical' | 'business' | 'support'
}

export interface AccessLog {
  id: string
  userId: string
  action: string
  resource: string
  permission: Permission
  granted: boolean
  timestamp: Date
  ip: string
  userAgent: string
  details?: Record<string, any>
}

export interface PermissionCheck {
  permission: Permission
  resource?: string
  context?: Record<string, any>
}

export interface RBACContext {
  currentUser: {
    id: string
    email: string
    roles: Role[]
    permissions: Permission[]
  }
  checkPermission: (permission: Permission, resource?: string) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  getUserRoles: () => Role[]
  getUserPermissions: () => Permission[]
  logAccess: (action: string, resource: string, permission: Permission, granted: boolean) => void
}

export interface RoleAssignment {
  id: string
  userId: string
  userEmail: string
  userName: string
  roleId: string
  roleName: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  status: 'active' | 'expired' | 'revoked'
}

export interface PermissionMatrix {
  [roleName: string]: {
    [permission: string]: boolean
  }
}

export interface SecurityPolicy {
  id: string
  name: string
  description: string
  rules: SecurityRule[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SecurityRule {
  id: string
  type: 'time_based' | 'ip_based' | 'role_based' | 'resource_based'
  condition: string
  action: 'allow' | 'deny' | 'require_approval'
  priority: number
  isActive: boolean
}

export interface AuditEntry {
  id: string
  userId: string
  userEmail: string
  action: 'role_assigned' | 'role_revoked' | 'permission_granted' | 'permission_denied' | 'login' | 'logout'
  resource?: string
  details: Record<string, any>
  timestamp: Date
  ip: string
  userAgent: string
  success: boolean
}