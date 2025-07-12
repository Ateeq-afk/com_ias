import { Question, QuestionType, DifficultyLevel, SubjectArea } from '../../question-generator/types'

// Test Types
export type TestType = 'Prelims' | 'Mains' | 'Sectional' | 'Topic' | 'Adaptive' | 'Grand'
export type TestDuration = 30 | 60 | 90 | 120 | 180 // in minutes
export type WordLimit = 150 | 250

// Subject Distribution
export interface SubjectDistribution {
  subject: SubjectArea
  minQuestions: number
  maxQuestions: number
  subTopicDistribution?: Record<string, number>
}

// Test Configuration
export interface TestConfiguration {
  testType: TestType
  duration: TestDuration
  totalQuestions: number
  negativeMarking: number
  subjectDistribution: SubjectDistribution[]
  difficultyDistribution: {
    easy: number
    medium: number
    hard: number
  }
  questionTypeDistribution?: Partial<Record<QuestionType, number>>
  avoidTopics?: string[]
  focusTopics?: string[]
}

// Prelims Test
export interface PrelimsTest {
  id: string
  title: string
  series: string
  testNumber: number
  duration: TestDuration
  totalQuestions: number
  negativeMarking: number
  questions: PrelimsQuestion[]
  subjectWiseBreakdown: Record<SubjectArea, number>
  difficultyBreakdown: Record<DifficultyLevel, number>
  createdAt: Date
  instructions: string[]
}

export interface PrelimsQuestion extends Question {
  marks: number
  negativeMarks: number
  section?: string
  previousYearReference?: string
}

// Mains Test
export interface MainsTest {
  id: string
  title: string
  paper: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay'
  series: string
  testNumber: number
  duration: TestDuration
  totalQuestions: number
  questions: MainsQuestion[]
  totalMarks: number
  createdAt: Date
  instructions: string[]
}

export interface MainsQuestion {
  id: string
  questionNumber: number
  question: string
  subParts?: string[]
  marks: number
  wordLimit: WordLimit
  subject: SubjectArea
  topic: string
  modelAnswerFramework: ModelAnswerFramework
  keywords: string[]
  approachHint: string
}

export interface ModelAnswerFramework {
  introduction: string
  mainPoints: string[]
  conclusion: string
  diagrams?: string[]
  examples: string[]
  currentAffairsLinks: string[]
}

// Essay Paper
export interface EssayPaper {
  id: string
  title: string
  series: string
  testNumber: number
  duration: TestDuration
  sections: EssaySection[]
  totalMarks: number
  createdAt: Date
  instructions: string[]
}

export interface EssaySection {
  sectionName: 'Section A' | 'Section B'
  theme: string
  topics: EssayTopic[]
}

export interface EssayTopic {
  id: string
  topic: string
  hints: string[]
  expectedApproach: string
  keyPoints: string[]
  wordLimit: number
  marks: number
}

// Sectional Test
export interface SectionalTest {
  id: string
  title: string
  subject: SubjectArea
  topics: string[]
  duration: TestDuration
  totalQuestions: number
  questions: Question[]
  difficultyLevel: DifficultyLevel | 'Mixed'
  createdAt: Date
}

// Adaptive Test
export interface AdaptiveTest {
  id: string
  title: string
  userProfile: UserProfile
  duration: TestDuration
  totalQuestions: number
  questions: Question[]
  focusAreas: string[]
  difficultyProgression: DifficultyLevel[]
  createdAt: Date
}

export interface UserProfile {
  userId: string
  weakAreas: Array<{
    subject: SubjectArea
    topics: string[]
    averageScore: number
  }>
  strongAreas: Array<{
    subject: SubjectArea
    topics: string[]
    averageScore: number
  }>
  overallAccuracy: number
  averageTimePerQuestion: number
  attemptHistory: TestAttempt[]
}

// Test Attempt & Analytics
export interface TestAttempt {
  testId: string
  userId: string
  attemptedAt: Date
  completedAt?: Date
  responses: QuestionResponse[]
  score: number
  accuracy: number
  percentile?: number
  timeSpent: number
  analytics?: TestAnalytics
}

export interface QuestionResponse {
  questionId: string
  selectedOption?: number | number[] // Single or multiple for MCQs
  answer?: string // For Mains questions
  timeSpent: number
  isCorrect?: boolean
  marksAwarded?: number
}

export interface TestAnalytics {
  testId: string
  attemptId: string
  overallAnalysis: {
    score: number
    maxScore: number
    accuracy: number
    percentile: number
    rank?: number
    timeTaken: number
    questionsAttempted: number
    correctAnswers: number
    wrongAnswers: number
    unattempted: number
  }
  subjectWiseAnalysis: Array<{
    subject: SubjectArea
    attempted: number
    correct: number
    accuracy: number
    averageTime: number
    score: number
    maxScore: number
  }>
  difficultyAnalysis: Array<{
    difficulty: DifficultyLevel
    attempted: number
    correct: number
    accuracy: number
    averageTime: number
  }>
  topicWisePerformance: Array<{
    topic: string
    attempted: number
    correct: number
    accuracy: number
    suggestion: string
  }>
  timeManagement: {
    totalTime: number
    averageTimePerQuestion: number
    fastestQuestion: { id: string; time: number }
    slowestQuestion: { id: string; time: number }
    rushHourAnalysis: string // Last 30 mins performance
  }
  weakAreaIdentification: Array<{
    area: string
    accuracy: number
    suggestion: string
    recommendedResources: string[]
  }>
  improvementSuggestions: string[]
  comparisonWithToppers: {
    topperAverage: number
    yourScore: number
    gap: number
    areasToImprove: string[]
  }
}

// Test Series
export interface TestSeries {
  id: string
  name: string
  type: 'Prelims' | 'Mains' | 'Integrated'
  totalTests: number
  schedule: TestSchedule[]
  currentTestIndex: number
  enrolledUsers: number
  averageScore: number
  createdAt: Date
}

export interface TestSchedule {
  testNumber: number
  testId?: string
  title: string
  type: TestType
  subjects?: SubjectArea[]
  scheduledDate: Date
  status: 'Upcoming' | 'Live' | 'Completed'
  syllabusCoverage: string[]
}

// Paper Composition Rules
export interface PaperCompositionRules {
  ensureConceptualCoverage: boolean
  avoidQuestionClustering: boolean
  balanceStaticVsCurrent: {
    staticPercentage: number
    currentPercentage: number
  }
  includeTrapQuestions: {
    enabled: boolean
    percentage: number
  }
  statementSequencing: {
    maxConsecutiveStatements: number
    spacingBetweenStatements: number
  }
  questionTypeSpacing: {
    noConsecutiveSameType: boolean
    minSpacing: number
  }
}

// Solution Generation
export interface SolutionSet {
  testId: string
  solutions: Array<{
    questionId: string
    correctAnswer: number | number[] | string
    explanation: string
    conceptsCovered: string[]
    difficulty: DifficultyLevel
    averageTime: number
    commonMistakes: string[]
    videoScriptOutline?: string
    relatedPYQs?: string[]
    furtherReading?: string[]
  }>
  detailedAnalytics: TestAnalytics
}

// Generator Interfaces
export interface TestPaperGenerator {
  generateTest(config: TestConfiguration): Promise<PrelimsTest | MainsTest>
  validateTest(test: PrelimsTest | MainsTest): boolean
  ensureQualityStandards(test: PrelimsTest | MainsTest): boolean
}

export interface AdaptiveTestGenerator {
  analyzeUserProfile(userId: string): Promise<UserProfile>
  generateAdaptiveTest(profile: UserProfile, config: Partial<TestConfiguration>): Promise<AdaptiveTest>
  updateProfileAfterAttempt(profile: UserProfile, attempt: TestAttempt): Promise<UserProfile>
}

export interface AnalyticsGenerator {
  generateTestAnalytics(attempt: TestAttempt): Promise<TestAnalytics>
  generateSolutionSet(test: PrelimsTest | MainsTest): Promise<SolutionSet>
  generateVideoScript(questionId: string, solution: string): Promise<string>
  calculatePercentile(score: number, testId: string): Promise<number>
}

export interface TestSeriesManager {
  createTestSeries(config: TestSeriesConfig): Promise<TestSeries>
  scheduleTests(seriesId: string): Promise<TestSchedule[]>
  getNextTest(seriesId: string, userId: string): Promise<PrelimsTest | MainsTest>
  updateProgress(seriesId: string, userId: string, testId: string): Promise<void>
}

export interface TestSeriesConfig {
  name: string
  type: 'Prelims' | 'Mains' | 'Integrated'
  totalTests: number
  frequency: 'Daily' | 'Weekly' | 'Biweekly'
  startDate: Date
  syllabusProgression: 'Linear' | 'Mixed' | 'Spiral'
}

// Question Bank Integration
export interface QuestionBankConfig {
  sources: Array<'Generated' | 'PreviousYear' | 'CurrentAffairs'>
  yearRange?: { start: number; end: number }
  excludeUsedQuestions: boolean
  qualityThreshold: number
}