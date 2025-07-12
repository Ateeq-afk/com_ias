import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

// User Profile Types
export type UserBackground = 'Fresher' | 'Working' | 'Repeater' | 'Dropper'
export type AvailableHours = '2-4' | '4-6' | '6-8' | '8+'
export type TargetExam = '2025' | '2026' | '2027'
export type LearningStyle = 'Visual' | 'Reading' | 'Practice-heavy' | 'Mixed'
export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type StudyPhase = 'Foundation' | 'Intermediate' | 'Advanced' | 'Revision' | 'Mock Test Phase'

export interface UserProfile {
  id: string
  name: string
  background: UserBackground
  availableHours: AvailableHours
  targetExam: TargetExam
  currentKnowledgeLevel: KnowledgeLevel
  learningStyle: LearningStyle
  strengths: SubjectStrength[]
  weaknesses: SubjectWeakness[]
  pastExperience?: PastExperience
  constraints: Constraint[]
  diagnosticResults?: DiagnosticResults
  preferences: StudyPreferences
  createdAt: Date
  updatedAt: Date
}

export interface SubjectStrength {
  subject: SubjectArea
  topics: string[]
  proficiencyLevel: number // 0-100
  lastAssessed: Date
}

export interface SubjectWeakness {
  subject: SubjectArea
  topics: string[]
  difficultyLevel: number // 0-100, higher = more difficult
  priorityLevel: 'High' | 'Medium' | 'Low'
  targetImprovement: number // target proficiency level
}

export interface PastExperience {
  previousAttempts: number
  lastAttemptYear?: number
  prelimsCleared?: boolean
  mainsExperience?: boolean
  bestScore?: number
  identifiedIssues: string[]
}

export interface Constraint {
  type: 'Job' | 'Other Exam' | 'Family' | 'Health' | 'Financial' | 'Other'
  description: string
  timeImpact: string // e.g., "9 AM - 6 PM unavailable"
  flexibility: 'Rigid' | 'Flexible' | 'Negotiable'
  validUntil?: Date
}

export interface DiagnosticResults {
  testId: string
  overallScore: number
  subjectScores: Record<SubjectArea, number>
  timeManagement: number // 0-100
  accuracy: number
  completionRate: number
  identifiedPatterns: string[]
  recommendedLevel: KnowledgeLevel
}

export interface StudyPreferences {
  preferredStudyTimes: TimeSlot[]
  maxContinuousHours: number
  breakFrequency: number // minutes
  varietyPreference: number // 0-100, higher = more variety needed
  difficultyProgression: 'Gradual' | 'Mixed' | 'Challenge-first'
  revisionFrequency: 'Daily' | 'Weekly' | 'Biweekly'
  mockTestFrequency: 'Weekly' | 'Biweekly' | 'Monthly'
}

export interface TimeSlot {
  startTime: string // "HH:MM"
  endTime: string // "HH:MM"
  energyLevel: 'High' | 'Medium' | 'Low'
  availability: 'Always' | 'Weekdays' | 'Weekends' | 'Flexible'
}

// Study Plan Types
export type PlanStrategy = 
  | 'FastTrack' 
  | 'Standard' 
  | 'Extended' 
  | 'RevisionOnly' 
  | 'MainsFocused' 
  | 'SubjectWise' 
  | 'Integrated'

export interface StudyPlan {
  id: string
  userId: string
  strategy: PlanStrategy
  startDate: Date
  targetDate: Date
  totalDuration: number // in days
  dailySchedules: DailySchedule[]
  weeklyTargets: WeeklyTarget[]
  monthlyMilestones: MonthlyMilestone[]
  revisionCycles: RevisionCycle[]
  mockTestSchedule: MockTestSchedule[]
  adaptiveAdjustments: AdaptiveAdjustment[]
  createdAt: Date
  lastUpdated: Date
}

export interface DailySchedule {
  date: Date
  dayOfWeek: string
  totalPlannedHours: number
  studySessions: StudySession[]
  breaks: BreakSlot[]
  flexibilityBuffer: number // minutes
  dailyGoals: string[]
  motivationalNote?: string
}

export interface StudySession {
  id: string
  startTime: string
  endTime: string
  duration: number // minutes
  subject: SubjectArea
  topic: string
  subtopics: string[]
  sessionType: SessionType
  difficulty: DifficultyLevel
  resources: ResourceMapping[]
  learningObjectives: string[]
  successCriteria: string[]
  prerequisites?: string[]
  followUpTasks?: string[]
}

export type SessionType = 
  | 'NewConcept' 
  | 'Revision' 
  | 'Practice' 
  | 'MockTest' 
  | 'CurrentAffairs' 
  | 'PYQPractice'
  | 'WeakAreaFocus'
  | 'StrengthReinforcement'

export interface BreakSlot {
  startTime: string
  endTime: string
  duration: number
  type: 'Short' | 'Meal' | 'Exercise' | 'Recreation'
  activity?: string
}

export interface ResourceMapping {
  type: 'Lesson' | 'Video' | 'Article' | 'Questions' | 'Test' | 'Notes' | 'Book'
  resourceId: string
  title: string
  source: string
  estimatedTime: number
  difficulty: DifficultyLevel
  priority: 'Must-do' | 'Recommended' | 'Optional'
  completionTracking: boolean
}

export interface WeeklyTarget {
  weekNumber: number
  startDate: Date
  endDate: Date
  subjects: WeeklySubjectTarget[]
  totalHours: number
  majorMilestones: string[]
  assessmentPlanned: boolean
  revisionTopics: string[]
  currentAffairsGoals: string[]
}

export interface WeeklySubjectTarget {
  subject: SubjectArea
  topics: string[]
  targetHours: number
  expectedCompletion: number // percentage
  practiceQuestions: number
  revisionSessions: number
}

export interface MonthlyMilestone {
  month: number
  startDate: Date
  endDate: Date
  phase: StudyPhase
  syllabusCompletion: Record<SubjectArea, number>
  majorGoals: string[]
  assessments: MilestoneAssessment[]
  adjustmentPoints: string[]
  nextMonthPreparation: string[]
}

export interface MilestoneAssessment {
  type: 'FullLength' | 'Sectional' | 'SubjectTest' | 'Diagnostic'
  scheduledDate: Date
  subjects: SubjectArea[]
  expectedOutcome: string
  preparationRequired: string[]
}

export interface RevisionCycle {
  cycleNumber: number
  startDate: Date
  endDate: Date
  subjects: SubjectArea[]
  topics: RevisionTopic[]
  spacingInterval: number // days since last revision
  intensity: 'Light' | 'Medium' | 'Intensive'
  method: 'Reading' | 'Practice' | 'Mixed' | 'TestBased'
}

export interface RevisionTopic {
  subject: SubjectArea
  topic: string
  lastRevised: Date
  masteryLevel: number // 0-100
  nextRevisionDue: Date
  revisionMethod: string[]
  timeRequired: number // minutes
}

export interface MockTestSchedule {
  testNumber: number
  scheduledDate: Date
  testType: 'Prelims' | 'Mains' | 'Sectional'
  subjects: SubjectArea[]
  preparationDays: number
  analysisTime: number // hours for post-test analysis
  targetScore?: number
  focusAreas: string[]
}

// Adaptive Scheduling Types
export interface AdaptiveAdjustment {
  adjustmentId: string
  date: Date
  trigger: AdjustmentTrigger
  originalPlan: any
  adjustedPlan: any
  reason: string
  impact: string[]
  userNotified: boolean
}

export type AdjustmentTrigger = 
  | 'MissedSession'
  | 'LowPerformance'
  | 'HighPerformance'
  | 'TimeConstraintChange'
  | 'UserRequest'
  | 'SystemOptimization'

export interface ProgressTracking {
  userId: string
  date: Date
  plannedSessions: number
  completedSessions: number
  plannedHours: number
  actualHours: number
  subjectProgress: Record<SubjectArea, SubjectProgress>
  overallCompletion: number
  efficiencyScore: number
  adherenceScore: number
  trends: ProgressTrend[]
}

export interface SubjectProgress {
  subject: SubjectArea
  topicsCompleted: number
  totalTopics: number
  hoursSpent: number
  plannedHours: number
  averageScore: number
  lastStudied: Date
  nextScheduled: Date
  momentum: 'Building' | 'Stable' | 'Declining'
}

export interface ProgressTrend {
  metric: string
  direction: 'Improving' | 'Stable' | 'Declining'
  magnitude: number
  confidence: number
  recommendedAction: string
}

// Performance Integration Types
export interface PerformanceData {
  userId: string
  testResults: TestResult[]
  studyLogs: StudyLog[]
  weaknessAnalysis: WeaknessAnalysis
  improvementVelocity: ImprovementVelocity
  readinessPrediction: ReadinessPrediction
}

export interface TestResult {
  testId: string
  date: Date
  testType: 'Mock' | 'Sectional' | 'Practice'
  subjects: SubjectArea[]
  score: number
  maxScore: number
  accuracy: number
  timeManagement: number
  subjectScores: Record<SubjectArea, number>
  identifiedWeaknesses: string[]
  improvementAreas: string[]
}

export interface StudyLog {
  sessionId: string
  date: Date
  subject: SubjectArea
  topic: string
  plannedTime: number
  actualTime: number
  comprehensionLevel: number // 0-100
  engagementLevel: number // 0-100
  completionStatus: 'Complete' | 'Partial' | 'Skipped'
  notes?: string
  difficultyConcepts: string[]
}

export interface WeaknessAnalysis {
  persistentWeaknesses: WeakArea[]
  emergingWeaknesses: WeakArea[]
  improvingAreas: ImprovingArea[]
  timeAllocationSuggestions: TimeAllocation[]
}

export interface WeakArea {
  subject: SubjectArea
  topics: string[]
  severity: number // 0-100
  trend: 'Worsening' | 'Stable' | 'Improving'
  recommendedActions: string[]
  estimatedResolutionTime: number // hours
}

export interface ImprovingArea {
  subject: SubjectArea
  topics: string[]
  improvementRate: number
  confidenceLevel: number
  maintenanceRequired: boolean
}

export interface TimeAllocation {
  subject: SubjectArea
  currentAllocation: number // percentage
  recommendedAllocation: number // percentage
  reason: string
  expectedImpact: string
}

export interface ImprovementVelocity {
  overall: number // improvement per week
  bySubject: Record<SubjectArea, number>
  accelerationFactors: string[]
  bottlenecks: string[]
  projectedTimeline: number // weeks to target level
}

export interface ReadinessPrediction {
  currentReadiness: number // 0-100
  projectedReadiness: number // on exam date
  confidenceInterval: [number, number]
  keyFactors: string[]
  riskAreas: string[]
  recommendations: string[]
}

// Plan Generation Interfaces
export interface PlanGeneratorConfig {
  strategy: PlanStrategy
  userProfile: UserProfile
  customizations?: PlanCustomization
  constraints?: PlanConstraint[]
}

export interface PlanCustomization {
  prioritySubjects?: SubjectArea[]
  excludedTopics?: string[]
  intensivePhases?: IntensivePhase[]
  specialGoals?: SpecialGoal[]
  deadlines?: CustomDeadline[]
}

export interface IntensivePhase {
  subject: SubjectArea
  startDate: Date
  duration: number // days
  dailyHours: number
  goals: string[]
}

export interface SpecialGoal {
  description: string
  targetDate: Date
  measurementCriteria: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface CustomDeadline {
  milestone: string
  date: Date
  requirements: string[]
}

export interface PlanConstraint {
  type: 'TimeLimit' | 'ResourceLimit' | 'TopicExclusion' | 'Other'
  description: string
  impact: string
  workaround?: string
}

// Visualization Types
export interface PlanVisualization {
  calendarView: CalendarEvent[]
  ganttChart: GanttItem[]
  progressRings: ProgressRing[]
  milestoneTracker: MilestoneTracker
  analytics: VisualizationAnalytics
}

export interface CalendarEvent {
  id: string
  date: Date
  title: string
  subject: SubjectArea
  duration: number
  type: SessionType
  color: string
  priority: number
}

export interface GanttItem {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  dependencies: string[]
  category: string
  color: string
}

export interface ProgressRing {
  subject: SubjectArea
  completion: number
  target: number
  trend: 'up' | 'down' | 'stable'
  color: string
  details: ProgressRingDetail[]
}

export interface ProgressRingDetail {
  label: string
  value: number
  target: number
  unit: string
}

export interface MilestoneTracker {
  milestones: TrackedMilestone[]
  overallProgress: number
  timeRemaining: number
  projectedCompletion: Date
}

export interface TrackedMilestone {
  id: string
  title: string
  targetDate: Date
  status: 'Completed' | 'OnTrack' | 'AtRisk' | 'Delayed'
  progress: number
  dependencies: string[]
  criticalPath: boolean
}

export interface VisualizationAnalytics {
  studyStreak: number
  mostProductiveTime: string
  averageSessionLength: number
  subjectBalance: Record<SubjectArea, number>
  weeklyTrends: WeeklyTrend[]
  achievements: Achievement[]
}

export interface WeeklyTrend {
  week: string
  hoursStudied: number
  efficiency: number
  subjectFocus: SubjectArea
  keyAchievements: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  earnedDate: Date
  category: 'Consistency' | 'Performance' | 'Milestone' | 'Special'
  points: number
}

// Generator Interfaces
export interface StudyPlanGenerator {
  generatePlan(config: PlanGeneratorConfig): Promise<StudyPlan>
  validatePlan(plan: StudyPlan): Promise<boolean>
  optimizePlan(plan: StudyPlan, constraints: PlanConstraint[]): Promise<StudyPlan>
}

export interface AdaptiveScheduler {
  trackProgress(userId: string, actualData: StudyLog[]): Promise<ProgressTracking>
  adjustSchedule(plan: StudyPlan, triggers: AdjustmentTrigger[]): Promise<StudyPlan>
  predictOutcomes(userId: string): Promise<ReadinessPrediction>
  optimizeSchedule(userId: string): Promise<ScheduleOptimization>
}

export interface ScheduleOptimization {
  originalEfficiency: number
  optimizedEfficiency: number
  changes: OptimizationChange[]
  expectedImpact: string[]
  implementationPlan: string[]
}

export interface OptimizationChange {
  type: 'TimeShift' | 'SubjectReorder' | 'DurationAdjust' | 'MethodChange'
  description: string
  rationale: string
  impact: number
  effort: number
}

export interface ResourceMapper {
  mapResources(session: StudySession): Promise<ResourceMapping[]>
  findAlternatives(resourceId: string): Promise<ResourceMapping[]>
  validateAvailability(resources: ResourceMapping[]): Promise<boolean>
}