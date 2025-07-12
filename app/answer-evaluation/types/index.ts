// Answer Evaluation System Types

export interface AnswerInput {
  id: string
  questionId: string
  userId: string
  content: string
  format: 'text' | 'structured' | 'bullet' | 'mixed' | 'voice' | 'handwritten'
  wordCount: number
  timeSpent: number // in seconds
  diagrams?: DiagramDescription[]
  attachments?: FileAttachment[]
  submittedAt: Date
}

export interface DiagramDescription {
  id: string
  title: string
  description: string
  type: 'flowchart' | 'mindmap' | 'timeline' | 'process' | 'comparison'
  placement: 'inline' | 'appendix'
}

export interface FileAttachment {
  id: string
  fileName: string
  fileType: 'image' | 'audio'
  url: string
  processedText?: string // for handwriting recognition
}

export interface EvaluationScore {
  total: number
  maxTotal: number
  breakdown: {
    contentRelevance: ContentScore
    structurePresentation: StructureScore
    analyticalDepth: AnalyticalScore
    innovation: InnovationScore
    language: LanguageScore
    wordLimit: WordLimitScore
  }
}

export interface ContentScore {
  score: number
  maxScore: 25
  keywordCoverage: number // percentage
  conceptAccuracy: number
  factsAndFigures: number
  currentAffairsIntegration: number
  details: {
    coveredKeywords: string[]
    missedKeywords: string[]
    factualErrors: string[]
    relevantCurrentAffairs: string[]
  }
}

export interface StructureScore {
  score: number
  maxScore: 20
  introduction: number
  logicalFlow: number
  paragraphOrganization: number
  conclusion: number
  details: {
    hasIntroduction: boolean
    hasConclusion: boolean
    paragraphCount: number
    transitionQuality: 'poor' | 'average' | 'good' | 'excellent'
  }
}

export interface AnalyticalScore {
  score: number
  maxScore: 20
  criticalThinking: number
  multiplePerspectives: number
  causeEffectAnalysis: number
  solutionsProvided: number
  details: {
    perspectivesCount: number
    analysisDepth: 'surface' | 'moderate' | 'deep'
    solutionsPracticality: 'poor' | 'average' | 'good' | 'excellent'
  }
}

export interface InnovationScore {
  score: number
  maxScore: 15
  uniqueInsights: number
  caseStudies: number
  diagrams: number
  contemporaryRelevance: number
  details: {
    innovativePoints: string[]
    caseStudiesUsed: string[]
    diagramsCount: number
    uniquenessLevel: 'common' | 'somewhat_unique' | 'highly_unique'
  }
}

export interface LanguageScore {
  score: number
  maxScore: 10
  clarity: number
  grammar: number
  vocabulary: number
  technicalTerms: number
  details: {
    grammarErrors: GrammarError[]
    vocabularyLevel: 'basic' | 'intermediate' | 'advanced'
    clarityIssues: string[]
  }
}

export interface WordLimitScore {
  score: number
  maxScore: 10
  adherence: number
  efficiency: number
  details: {
    requiredWords: number
    actualWords: number
    penalty: number
    efficiency: 'poor' | 'average' | 'good' | 'excellent'
  }
}

export interface GrammarError {
  text: string
  type: 'spelling' | 'grammar' | 'punctuation' | 'style'
  suggestion: string
  severity: 'low' | 'medium' | 'high'
}

export interface DetailedFeedback {
  overall: OverallFeedback
  specific: SpecificFeedback[]
  suggestions: ImprovementSuggestion[]
  modelComparison: ModelComparison
}

export interface OverallFeedback {
  strengths: string[]
  weaknesses: string[]
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  percentile: number
  predictedExamScore: number
}

export interface SpecificFeedback {
  lineNumber?: number
  paragraph?: number
  text: string
  type: 'positive' | 'negative' | 'suggestion' | 'warning'
  category: 'content' | 'structure' | 'language' | 'analysis' | 'innovation'
  priority: 'low' | 'medium' | 'high'
}

export interface ImprovementSuggestion {
  id: string
  title: string
  description: string
  example: string
  category: 'immediate' | 'short_term' | 'long_term'
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  resources: Resource[]
}

export interface Resource {
  type: 'lesson' | 'practice' | 'reading' | 'video'
  title: string
  url: string
  estimatedTime: number // in minutes
}

export interface ModelComparison {
  modelAnswer: string
  similarities: string[]
  differences: string[]
  scoreDifference: number
  improvementAreas: string[]
}

export interface AnswerPattern {
  pattern: string
  frequency: number
  effectiveness: number
  examinerPreference: number
  examples: string[]
}

export interface UPSCAnswerAnalysis {
  preferredPatterns: AnswerPattern[]
  scoringKeywords: string[]
  examinerFriendlyFormats: string[]
  diagramOpportunities: string[]
  commonMistakes: string[]
}

export interface ProgressTracking {
  userId: string
  attempts: AnswerAttempt[]
  overallTrend: 'improving' | 'stable' | 'declining'
  strengthAreas: string[]
  weaknessAreas: string[]
  personalizedPlan: PersonalizedPlan
}

export interface AnswerAttempt {
  attemptId: string
  questionId: string
  score: number
  submittedAt: Date
  timeSpent: number
  wordCount: number
  feedback: DetailedFeedback
}

export interface PersonalizedPlan {
  focusAreas: string[]
  practiceQuestions: string[]
  studyResources: Resource[]
  targetScores: Record<string, number>
  timeline: PlanMilestone[]
}

export interface PlanMilestone {
  title: string
  description: string
  targetDate: Date
  completed: boolean
  metrics: Record<string, number>
}

export interface Question {
  id: string
  text: string
  subject: 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' | 'Optional'
  topic: string
  subtopic: string
  difficulty: 'easy' | 'medium' | 'hard'
  wordLimit: number
  timeLimit: number // in minutes
  year?: number
  source: 'upsc' | 'test_series' | 'practice'
  keywords: string[]
  expectedPoints: string[]
  modelAnswers: ModelAnswer[]
}

export interface ModelAnswer {
  id: string
  content: string
  wordCount: number
  approach: string
  score: number
  author: 'topper' | 'expert' | 'ai'
  style: 'formal' | 'analytical' | 'descriptive' | 'comparative'
}

export interface EvaluationRequest {
  questionId: string
  answer: AnswerInput
  evaluationType: 'quick' | 'detailed' | 'comparative'
  options: {
    generateModelAnswer: boolean
    compareWithToppers: boolean
    providePeerComparison: boolean
    includeImprovementPlan: boolean
  }
}

export interface EvaluationResponse {
  evaluationId: string
  score: EvaluationScore
  feedback: DetailedFeedback
  upscAnalysis: UPSCAnswerAnalysis
  modelAnswer?: ModelAnswer
  peerComparison?: PeerComparison
  improvementPlan?: PersonalizedPlan
  processingTime: number
}

export interface PeerComparison {
  averageScore: number
  percentile: number
  betterThan: number // percentage of peers
  topPerformingAnswers: AnonymizedAnswer[]
  commonApproaches: string[]
}

export interface AnonymizedAnswer {
  score: number
  approach: string
  keyStrengths: string[]
  excerpt: string // partial content for learning
}

export interface PracticeMode {
  type: 'timed' | 'untimed' | 'peer_review' | 'topic_wise' | 'daily_challenge' | 'previous_year'
  settings: {
    timeLimit?: number
    wordLimit?: number
    allowDiagrams: boolean
    allowVoiceInput: boolean
    showRealTimeWordCount: boolean
    enableAutoSave: boolean
    provideLiveHints: boolean
  }
}

export interface HandwritingAnalysis {
  legibilityScore: number
  speedEstimate: number // words per minute
  suggestions: string[]
  digitizedText: string
  confidence: number // OCR confidence
}

export interface VoiceAnalysis {
  transcribedText: string
  confidence: number
  speakingPace: number // words per minute
  clarity: number
  suggestions: string[]
}