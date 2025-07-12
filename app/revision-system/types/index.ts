import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

// Core Revision Types
export interface RevisionItem {
  id: string
  userId: string
  contentId: string
  contentType: 'Lesson' | 'Question' | 'CurrentAffairs' | 'Concept' | 'Formula' | 'Date' | 'Scheme'
  subject: SubjectArea
  topic: string
  subtopic?: string
  content: RevisionContent
  difficulty: DifficultyLevel
  importance: 'Critical' | 'High' | 'Medium' | 'Low'
  
  // Spaced Repetition Data
  interval: number // days until next revision
  repetition: number // number of times revised
  easeFactor: number // SM-2 ease factor (1.3 - 2.5)
  nextRevisionDate: Date
  lastRevisionDate: Date
  
  // Performance Data
  retentionScore: number // 0-100
  recallAccuracy: number // 0-100
  timeToRecall: number // seconds
  strugglingCount: number // times marked as difficult
  masteryLevel: 'Learning' | 'Reviewing' | 'Mastered' | 'Overlearned'
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  tags: string[]
  source: string
}

export interface RevisionContent {
  title: string
  keyPoints: string[]
  factoids: string[]
  dates?: string[]
  numbers?: string[]
  formulas?: string[]
  mnemonics?: string[]
  visualAids?: string[]
  connections?: string[]
  examples?: string[]
}

// Spaced Repetition Configuration
export interface SpacedRepetitionConfig {
  easyIntervals: number[] // [1, 3, 7, 14, 30, 90]
  mediumIntervals: number[] // [1, 2, 5, 10, 21, 60]
  hardIntervals: number[] // [1, 1, 3, 7, 14, 30]
  initialEaseFactor: number // 2.5
  minEaseFactor: number // 1.3
  maxEaseFactor: number // 2.5
  easeIncrement: number // 0.1
  easeDecrement: number // 0.2
  examDateWeight: number // 0.3 (30% weight for exam proximity)
}

// Revision Session Types
export interface RevisionSession {
  id: string
  userId: string
  sessionType: RevisionSessionType
  scheduledDate: Date
  actualDate?: Date
  duration: number // minutes
  items: RevisionSessionItem[]
  performance: SessionPerformance
  completed: boolean
  feedback?: string
}

export type RevisionSessionType = 
  | 'MorningRevision' 
  | 'EveningRecall' 
  | 'WeekendReview'
  | 'PreTestRevision'
  | 'SubjectCycle'
  | 'MixedTopics'
  | 'WeakAreaFocus'
  | 'RapidFire'
  | 'ComprehensiveReview'

export interface RevisionSessionItem {
  revisionItemId: string
  format: RevisionFormat
  startTime: Date
  endTime?: Date
  response: UserResponse
  performance: ItemPerformance
}

export type RevisionFormat = 
  | 'FlashCard'
  | 'QuickQuiz'
  | 'FillInBlanks'
  | 'BlankPaper'
  | 'TeachBack'
  | 'DiagramDraw'
  | 'Timeline'
  | 'MindMap'
  | 'SummaryRecall'
  | 'AudioRecall'

export interface UserResponse {
  answer: string
  confidence: number // 1-5
  timeSpent: number // seconds
  hintsUsed: number
  selfRating: 'Easy' | 'Good' | 'Hard' | 'Again'
  notes?: string
}

export interface ItemPerformance {
  accuracy: number // 0-100
  speed: number // responses per minute
  retention: number // 0-100
  improvement: number // delta from last attempt
}

export interface SessionPerformance {
  overallAccuracy: number
  averageSpeed: number
  completionRate: number
  retentionScore: number
  timeEfficiency: number
  strugglingItems: string[]
  masteredItems: string[]
}

// Revision Materials
export interface FlashCard {
  id: string
  front: string
  back: string
  hints: string[]
  images?: string[]
  examples?: string[]
  mnemonics?: string[]
  difficulty: DifficultyLevel
  tags: string[]
}

export interface QuickQuiz {
  id: string
  questions: QuickQuizQuestion[]
  timeLimit: number // seconds
  passingScore: number // percentage
  category: string
  difficulty: DifficultyLevel
}

export interface QuickQuizQuestion {
  id: string
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  points: number
  timeLimit: number
}

export interface MindMap {
  id: string
  centralTopic: string
  branches: MindMapBranch[]
  connections: MindMapConnection[]
  layout: 'Radial' | 'Tree' | 'Circular' | 'Timeline'
  visualElements: VisualElement[]
}

export interface MindMapBranch {
  id: string
  parentId?: string
  title: string
  content: string[]
  color: string
  importance: number
  position: { x: number; y: number }
}

export interface MindMapConnection {
  fromBranchId: string
  toBranchId: string
  type: 'Causes' | 'Leads to' | 'Related to' | 'Opposite of' | 'Example of'
  label?: string
}

export interface VisualElement {
  type: 'Image' | 'Icon' | 'Chart' | 'Timeline' | 'Flow'
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface SummaryNotes {
  id: string
  title: string
  keyPoints: string[]
  bulletPoints: string[]
  onePageSummary: string
  formulaSheet?: string[]
  importantDates?: DateFact[]
  mnemonics?: string[]
  quickFacts: string[]
}

export interface DateFact {
  date: string
  event: string
  significance: string
  context: string
}

// Memory and Retention Analytics
export interface RetentionAnalytics {
  userId: string
  subject: SubjectArea
  topic: string
  retentionCurve: RetentionPoint[]
  forgettingCurve: ForgettingPoint[]
  optimalRevisionTimes: Date[]
  memoryStrength: number // 0-100
  longTermRetention: number // 0-100
  examReadiness: number // 0-100
  predictions: RetentionPrediction[]
}

export interface RetentionPoint {
  date: Date
  retentionPercentage: number
  confidenceLevel: number
  testType: string
}

export interface ForgettingPoint {
  hoursAfterLearning: number
  estimatedRetention: number
  actualRetention?: number
  factors: ForgettingFactor[]
}

export interface ForgettingFactor {
  factor: 'Difficulty' | 'Interference' | 'Time' | 'Sleep' | 'Stress' | 'Interest'
  impact: number // -100 to +100
}

export interface RetentionPrediction {
  date: Date
  predictedRetention: number
  confidence: number
  recommendedAction: 'Revise' | 'Test' | 'Review' | 'Skip'
  reasoning: string
}

// Adaptive Difficulty System
export interface AdaptiveDifficulty {
  userId: string
  itemId: string
  currentDifficulty: DifficultyLevel
  performanceHistory: PerformanceSnapshot[]
  adaptationTriggers: AdaptationTrigger[]
  nextDifficulty: DifficultyLevel
  adjustmentReason: string
  effectiveDate: Date
}

export interface PerformanceSnapshot {
  date: Date
  accuracy: number
  speed: number
  confidence: number
  streak: number
  context: string
}

export interface AdaptationTrigger {
  type: 'HighAccuracy' | 'LowAccuracy' | 'FastResponse' | 'SlowResponse' | 'HighConfidence' | 'LowConfidence'
  threshold: number
  consecutiveCount: number
  adjustmentDirection: 'Increase' | 'Decrease' | 'Maintain'
}

// Gamification Elements
export interface RevisionStreak {
  userId: string
  currentStreak: number
  longestStreak: number
  streakType: 'Daily' | 'Weekly' | 'Perfect' | 'Subject'
  lastActivity: Date
  milestones: StreakMilestone[]
}

export interface StreakMilestone {
  days: number
  title: string
  reward: string
  achieved: boolean
  achievedDate?: Date
}

export interface RevisionAchievement {
  id: string
  userId: string
  title: string
  description: string
  category: 'Memory' | 'Speed' | 'Consistency' | 'Mastery' | 'Special'
  criteria: AchievementCriteria
  progress: number // 0-100
  achieved: boolean
  achievedDate?: Date
  reward: AchievementReward
}

export interface AchievementCriteria {
  type: 'Streak' | 'Accuracy' | 'Speed' | 'Volume' | 'Perfect' | 'Improvement'
  target: number
  timeframe?: string
  conditions?: string[]
}

export interface AchievementReward {
  type: 'XP' | 'Badge' | 'Title' | 'Feature' | 'Content'
  value: number | string
  description: string
}

export interface RevisionGameProfile {
  userId: string
  level: number
  xp: number
  nextLevelXP: number
  title: string
  badges: GameBadge[]
  stats: GameStats
  leaderboards: LeaderboardEntry[]
}

export interface GameBadge {
  id: string
  name: string
  description: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
  earnedDate: Date
  category: string
}

export interface GameStats {
  totalRevisions: number
  perfectSessions: number
  timeSpent: number
  itemsMastered: number
  averageAccuracy: number
  favoriteTime: string
  strongestSubject: SubjectArea
}

export interface LeaderboardEntry {
  rank: number
  category: string
  value: number
  comparison: 'Better' | 'Same' | 'Worse'
}

// Scheduling and Planning
export interface RevisionSchedule {
  userId: string
  date: Date
  sessions: ScheduledSession[]
  totalTime: number
  priority: 'High' | 'Medium' | 'Low'
  flexibility: number // 0-100
  completed: boolean
  adjustments: ScheduleAdjustment[]
}

export interface ScheduledSession {
  sessionId: string
  startTime: string
  endTime: string
  type: RevisionSessionType
  items: string[] // revision item IDs
  estimatedDuration: number
  priority: number
  prerequisites?: string[]
}

export interface ScheduleAdjustment {
  reason: string
  originalTime: string
  newTime: string
  impact: string
  automatic: boolean
  timestamp: Date
}

// Content Generation
export interface ContentGenerator {
  generateFlashCards(source: any): Promise<FlashCard[]>
  generateQuickQuiz(topic: string, difficulty: DifficultyLevel): Promise<QuickQuiz>
  generateMindMap(concept: string): Promise<MindMap>
  generateSummaryNotes(lesson: any): Promise<SummaryNotes>
  generateMnemonics(facts: string[]): Promise<string[]>
}

// Integration Interfaces
export interface RevisionSystemConfig {
  spacedRepetition: SpacedRepetitionConfig
  dailyRevisionTime: number // minutes
  maxDailyItems: number
  reminderSettings: ReminderSettings
  gamificationEnabled: boolean
  analyticsLevel: 'Basic' | 'Advanced' | 'Expert'
  integrationSettings: IntegrationSettings
}

export interface ReminderSettings {
  enabled: boolean
  morningTime: string
  eveningTime: string
  weekendTime: string
  preTestDays: number
  methods: ('Push' | 'Email' | 'SMS')[]
  urgencyLevels: UrgencyLevel[]
}

export interface UrgencyLevel {
  daysOverdue: number
  reminderFrequency: number // hours
  message: string
  escalation: boolean
}

export interface IntegrationSettings {
  questionGenerator: boolean
  testGenerator: boolean
  currentAffairs: boolean
  studyPlanner: boolean
  performanceAnalytics: boolean
  contentLibrary: boolean
}

// System Interfaces
export interface SpacedRepetitionEngine {
  calculateNextInterval(item: RevisionItem, performance: UserResponse): number
  updateEaseFactor(item: RevisionItem, performance: UserResponse): number
  optimizeForExamDate(item: RevisionItem, examDate: Date): number
  getBatchForRevision(userId: string, date: Date): Promise<RevisionItem[]>
  processRevisionResult(item: RevisionItem, performance: UserResponse): Promise<RevisionItem>
}

export interface ContentTracker {
  trackLessonCompletion(userId: string, lessonId: string): Promise<void>
  trackQuestionAttempt(userId: string, questionId: string, accuracy: number): Promise<void>
  trackCurrentAffairsRead(userId: string, articleId: string, importance: string): Promise<void>
  getTrackingData(userId: string): Promise<TrackingData>
  updateRetentionScore(userId: string, itemId: string, score: number): Promise<void>
}

export interface TrackingData {
  lessonsCompleted: LessonTracking[]
  questionsAttempted: QuestionTracking[]
  currentAffairsRead: CurrentAffairsTracking[]
  conceptsMastered: ConceptTracking[]
  totalTimeSpent: number
  retentionScores: Record<string, number>
}

export interface LessonTracking {
  lessonId: string
  subject: SubjectArea
  topic: string
  completedAt: Date
  timeSpent: number
  comprehensionScore: number
  keyPointsExtracted: string[]
}

export interface QuestionTracking {
  questionId: string
  subject: SubjectArea
  topic: string
  attemptedAt: Date
  accuracy: number
  timeSpent: number
  difficulty: DifficultyLevel
  conceptsUsed: string[]
}

export interface CurrentAffairsTracking {
  articleId: string
  readAt: Date
  importance: string
  timeSpent: number
  staticConnections: string[]
  retentionScore: number
}

export interface ConceptTracking {
  conceptId: string
  subject: SubjectArea
  topic: string
  masteryLevel: number
  firstLearned: Date
  lastRevised: Date
  revisionCount: number
  retentionTrend: 'Improving' | 'Stable' | 'Declining'
}

export interface RevisionScheduler {
  generateDailySchedule(userId: string, date: Date): Promise<RevisionSchedule>
  getRevisionQueue(userId: string): Promise<RevisionItem[]>
  scheduleSession(userId: string, sessionType: RevisionSessionType, items: RevisionItem[]): Promise<RevisionSession>
  adjustScheduleForMissed(userId: string, missedSessions: string[]): Promise<RevisionSchedule>
  optimizeScheduleForExam(userId: string, examDate: Date): Promise<RevisionSchedule[]>
}

export interface RetentionAnalyzer {
  analyzeRetentionPattern(userId: string, subject?: SubjectArea): Promise<RetentionAnalytics>
  predictForgettingCurve(item: RevisionItem): Promise<ForgettingPoint[]>
  recommendRevisionTiming(userId: string, itemIds: string[]): Promise<Date[]>
  calculateMemoryStrength(userId: string, topic: string): Promise<number>
  generateRetentionReport(userId: string): Promise<RetentionReport>
}

export interface RetentionReport {
  userId: string
  generatedAt: Date
  overallRetention: number
  subjectRetention: Record<SubjectArea, number>
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  examReadiness: number
  priorityRevisions: string[]
}

export interface RevisionAnalytics {
  getRevisionStats(userId: string): Promise<RevisionStats>
  getPerformanceTrends(userId: string): Promise<PerformanceTrend[]>
  getEfficiencyMetrics(userId: string): Promise<EfficiencyMetrics>
  generateInsights(userId: string): Promise<RevisionInsight[]>
}

export interface RevisionStats {
  totalRevisions: number
  averageAccuracy: number
  totalTimeSpent: number
  itemsMastered: number
  currentStreak: number
  retentionRate: number
  improvementRate: number
}

export interface PerformanceTrend {
  date: Date
  metric: string
  value: number
  trend: 'Up' | 'Down' | 'Stable'
  significance: 'High' | 'Medium' | 'Low'
}

export interface EfficiencyMetrics {
  averageTimePerItem: number
  accuracyRate: number
  retentionEfficiency: number
  learningVelocity: number
  memoryConsolidation: number
}

export interface RevisionInsight {
  type: 'Performance' | 'Pattern' | 'Recommendation' | 'Warning' | 'Opportunity'
  title: string
  description: string
  actionable: boolean
  priority: 'High' | 'Medium' | 'Low'
  data: any
}