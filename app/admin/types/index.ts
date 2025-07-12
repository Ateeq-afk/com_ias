// Admin Dashboard Types

// Re-export RBAC types
export * from './rbac'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  permissions: Permission[]
  lastLogin: Date
  isActive: boolean
  createdAt: Date
}

export type AdminRole = 'super_admin' | 'content_manager' | 'support_agent' | 'finance_manager' | 'marketing_manager'

export type Permission = 
  | 'view_analytics' | 'manage_users' | 'manage_content' | 'manage_finances'
  | 'manage_support' | 'manage_automation' | 'view_system_health' | 'export_data'
  | 'manage_roles' | 'send_announcements' | 'manage_campaigns' | 'access_logs'

export interface RealTimeMetrics {
  activeUsers: {
    current: number
    peak24h: number
    byRegion: Record<string, number>
    byDevice: Record<string, number>
  }
  revenue: {
    mrr: number
    arr: number
    ltv: number
    churnRate: number
    conversionRate: number
  }
  engagement: {
    dau: number
    mau: number
    sessionDuration: number
    pagesPerSession: number
    bounceRate: number
  }
  content: {
    mostViewed: ContentMetric[]
    leastViewed: ContentMetric[]
    completionRates: Record<string, number>
    averageRating: number
  }
  system: {
    uptime: number
    responseTime: number
    errorRate: number
    activeConnections: number
    serverLoad: number
  }
}

export interface ContentMetric {
  id: string
  title: string
  type: 'lesson' | 'test' | 'article'
  views: number
  completions: number
  rating: number
  lastUpdated: Date
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: 'active' | 'inactive' | 'expired' | 'cancelled'
  registrationDate: Date
  lastActive: Date
  totalLessonsCompleted: number
  totalTestsAttempted: number
  averageScore: number
  paymentHistory: Payment[]
  supportTickets: SupportTicket[]
  learningProgress: LearningProgress
  location: {
    city: string
    state: string
    country: string
  }
  preferences: UserPreferences
  tags: string[]
  notes: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  type: 'free' | 'basic' | 'premium' | 'enterprise'
  price: number
  duration: number // in months
  features: string[]
  startDate: Date
  endDate: Date
  autoRenew: boolean
}

export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'success' | 'failed' | 'pending' | 'refunded'
  paymentMethod: string
  transactionId: string
  date: Date
  invoice?: string
  refundReason?: string
}

export interface SupportTicket {
  id: string
  subject: string
  category: 'technical' | 'billing' | 'content' | 'account' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assignedTo?: string
  messages: TicketMessage[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  satisfaction?: number
  tags: string[]
}

export interface TicketMessage {
  id: string
  content: string
  sender: 'user' | 'admin'
  senderName: string
  timestamp: Date
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
}

export interface LearningProgress {
  totalTimeSpent: number // in minutes
  lessonsCompleted: number
  testsAttempted: number
  averageScore: number
  subjectProgress: Record<string, SubjectProgress>
  weakAreas: string[]
  strongAreas: string[]
  lastLessonDate: Date
  streakDays: number
  milestones: Milestone[]
}

export interface SubjectProgress {
  subject: string
  lessonsTotal: number
  lessonsCompleted: number
  averageScore: number
  timeSpent: number
  lastAccessed: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  achievedAt: Date
  points: number
}

export interface UserPreferences {
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  reminderFrequency: 'daily' | 'weekly' | 'monthly'
  studyGoalHours: number
  preferredStudyTime: string[]
  subjects: string[]
}

export interface ContentItem {
  id: string
  title: string
  type: 'lesson' | 'test' | 'article' | 'video' | 'quiz'
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // in minutes
  status: 'draft' | 'review' | 'published' | 'archived'
  author: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  content: string
  metadata: ContentMetadata
  analytics: ContentAnalytics
  tags: string[]
  prerequisites: string[]
  learningObjectives: string[]
}

export interface ContentMetadata {
  wordCount: number
  readingTime: number
  keywords: string[]
  targetAudience: string[]
  revisionNumber: number
  lastReviewer?: string
  reviewNotes?: string
  seoTitle?: string
  seoDescription?: string
}

export interface ContentAnalytics {
  views: number
  uniqueViews: number
  completions: number
  averageTimeSpent: number
  dropOffPoints: DropOffPoint[]
  ratings: Rating[]
  comments: Comment[]
  shareCount: number
  downloadCount: number
}

export interface DropOffPoint {
  position: number // percentage through content
  dropOffRate: number
  timestamp: Date
}

export interface Rating {
  userId: string
  rating: number
  review?: string
  timestamp: Date
}

export interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  replies: Comment[]
  likes: number
  isModerated: boolean
}

export interface FinancialMetrics {
  revenue: {
    total: number
    monthly: number[]
    byPlan: Record<string, number>
    byRegion: Record<string, number>
    growth: number
  }
  subscriptions: {
    active: number
    new: number
    cancelled: number
    churnRate: number
    upgrades: number
    downgrades: number
  }
  payments: {
    successful: number
    failed: number
    pending: number
    refunds: number
    chargebacks: number
  }
  metrics: {
    arpu: number // Average Revenue Per User
    ltv: number // Lifetime Value
    cac: number // Customer Acquisition Cost
    paybackPeriod: number
  }
}

export interface Campaign {
  id: string
  name: string
  type: 'email' | 'push' | 'sms' | 'in_app'
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused'
  target: CampaignTarget
  content: CampaignContent
  schedule: CampaignSchedule
  metrics: CampaignMetrics
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CampaignTarget {
  userSegment: string[]
  filters: UserFilter[]
  excludeSegments?: string[]
  estimatedReach: number
}

export interface UserFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

export interface CampaignContent {
  subject?: string
  title: string
  message: string
  cta?: CallToAction
  template?: string
  personalization: Record<string, string>
  attachments?: Attachment[]
}

export interface CallToAction {
  text: string
  url: string
  style: 'primary' | 'secondary' | 'link'
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring'
  sendAt?: Date
  timezone: string
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
}

export interface CampaignMetrics {
  sent: number
  delivered: number
  opened: number
  clicked: number
  converted: number
  unsubscribed: number
  bounced: number
  deliveryRate: number
  openRate: number
  clickRate: number
  conversionRate: number
}

export interface SystemHealth {
  server: {
    cpu: number
    memory: number
    disk: number
    uptime: number
  }
  database: {
    connections: number
    queryTime: number
    slowQueries: number
    size: number
  }
  api: {
    responseTime: number
    errorRate: number
    requestsPerSecond: number
    activeEndpoints: number
  }
  cdn: {
    hitRate: number
    bandwidth: number
    requests: number
    errors: number
  }
  services: ServiceStatus[]
}

export interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'offline'
  responseTime: number
  lastCheck: Date
  errorCount: number
  uptime: number
}

export interface LearningAnalytics {
  subjectPerformance: SubjectPerformance[]
  questionAnalytics: QuestionAnalytics[]
  timeMetrics: TimeMetrics
  completionFunnels: CompletionFunnel[]
  userJourneys: UserJourney[]
  weakAreaAnalysis: WeakAreaAnalysis
  successPredictors: SuccessPredictor[]
}

export interface SubjectPerformance {
  subject: string
  totalUsers: number
  averageScore: number
  completionRate: number
  timeSpent: number
  difficulty: number
  engagement: number
  trend: 'up' | 'down' | 'stable'
}

export interface QuestionAnalytics {
  questionId: string
  question: string
  attempts: number
  correctAnswers: number
  averageTime: number
  difficulty: number
  discriminationIndex: number
  distractorAnalysis: DistractorAnalysis[]
}

export interface DistractorAnalysis {
  option: string
  selectedCount: number
  percentage: number
  analysis: string
}

export interface TimeMetrics {
  averageSessionDuration: number
  averageLessonTime: number
  averageTestTime: number
  peakUsageHours: number[]
  usageByDay: Record<string, number>
  timeToCompletion: Record<string, number>
}

export interface CompletionFunnel {
  stage: string
  users: number
  dropOffRate: number
  conversionRate: number
  averageTime: number
}

export interface UserJourney {
  pathId: string
  steps: JourneyStep[]
  userCount: number
  completionRate: number
  averageDuration: number
}

export interface JourneyStep {
  step: string
  action: string
  timestamp: number
  userCount: number
  dropOffRate: number
}

export interface WeakAreaAnalysis {
  subject: string
  topics: TopicWeakness[]
  overallWeakness: number
  recommendedActions: string[]
}

export interface TopicWeakness {
  topic: string
  averageScore: number
  attemptCount: number
  improvementPotential: number
}

export interface SuccessPredictor {
  factor: string
  importance: number
  correlation: number
  description: string
  recommendation: string
}

export interface DashboardWidget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'list' | 'map'
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
  config: WidgetConfig
  data: any
  refreshInterval: number
  lastUpdated: Date
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter'
  dataSource: string
  filters: Record<string, any>
  groupBy?: string
  timeRange?: string
  limit?: number
  sortBy?: string
  showLegend?: boolean
  showDataLabels?: boolean
  colors?: string[]
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: Date
  acknowledged: boolean
  acknowledgedBy?: string
  resolvedAt?: Date
  actions: AlertAction[]
}

export interface AlertAction {
  label: string
  action: string
  style: 'primary' | 'secondary' | 'danger'
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  result: 'success' | 'failure'
  error?: string
}

export interface ExportJob {
  id: string
  type: 'users' | 'content' | 'analytics' | 'financial' | 'logs'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestedBy: string
  filters: Record<string, any>
  format: 'csv' | 'excel' | 'json' | 'pdf'
  downloadUrl?: string
  progress: number
  startedAt: Date
  completedAt?: Date
  error?: string
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  isActive: boolean
  executionCount: number
  lastExecuted?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface AutomationTrigger {
  type: 'user_signup' | 'subscription_end' | 'inactivity' | 'score_threshold' | 'time_based' | 'api_event'
  config: Record<string, any>
}

export interface AutomationCondition {
  field: string
  operator: string
  value: any
  logicalOperator: 'AND' | 'OR'
}

export interface AutomationAction {
  type: 'send_email' | 'send_push' | 'update_user' | 'create_ticket' | 'webhook' | 'assign_content'
  config: Record<string, any>
  delay?: number // in minutes
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  action: string
  params?: Record<string, any>
  confirmRequired: boolean
  requiredPermissions: Permission[]
  category: 'user' | 'content' | 'system' | 'communication' | 'financial'
}

export interface DashboardLayout {
  userId: string
  widgets: DashboardWidget[]
  theme: 'light' | 'dark'
  sidebar: {
    collapsed: boolean
    pinnedItems: string[]
  }
  preferences: {
    defaultTimeRange: string
    autoRefresh: boolean
    refreshInterval: number
    timezone: string
  }
}