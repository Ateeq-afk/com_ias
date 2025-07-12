// Comprehensive type definitions for the question generation system

export type QuestionType = 
  | 'SingleCorrectMCQ'
  | 'MultipleCorrectMCQ'
  | 'MatchTheFollowing'
  | 'AssertionReasoning'
  | 'StatementBased'
  | 'SequenceArrangement'
  | 'OddOneOut'
  | 'CaseStudyBased'
  | 'MapBased'
  | 'DataBased'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type SubjectArea = 
  | 'History'
  | 'Geography' 
  | 'Polity'
  | 'Economy'
  | 'Environment'
  | 'Science & Technology'
  | 'Current Affairs'
  | 'Ethics'
  | 'Art & Culture'
  | 'International Relations'

export interface BaseFact {
  id: string
  content: string
  subject: SubjectArea
  topic: string
  source: string // Article number, book reference, etc.
  importance: 'high' | 'medium' | 'low'
  concepts: string[]
  relatedFacts: string[]
  tags: string[]
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

export interface MatchPair {
  left: string
  right: string
  explanation: string
}

export interface Statement {
  number: number
  text: string
  isCorrect: boolean
  explanation: string
}

export interface QuestionData {
  // Common fields
  singleCorrect?: {
    options: QuestionOption[]
  }
  multipleCorrect?: {
    options: QuestionOption[]
    correctCount: number
  }
  matchTheFollowing?: {
    leftColumn: string[]
    rightColumn: string[]
    correctPairs: MatchPair[]
  }
  assertionReasoning?: {
    assertion: string
    reason: string
    correctRelation: 'both-true-reason-correct' | 'both-true-reason-incorrect' | 'assertion-true-reason-false' | 'assertion-false-reason-true' | 'both-false'
  }
  statementBased?: {
    statements: Statement[]
    correctCombination: number[]
  }
  sequenceArrangement?: {
    items: string[]
    correctSequence: number[]
    criterion: string // 'chronological' | 'logical' | 'geographical' etc.
  }
  oddOneOut?: {
    options: string[]
    oddOneIndex: number
    category: string
  }
  caseStudy?: {
    passage: string
    questions: Question[]
  }
  mapBased?: {
    mapDescription: string
    locations: string[]
    correctLocation: string
  }
  dataBased?: {
    dataSource: string // table, graph, chart description
    interpretationQuestion: string
    options: QuestionOption[]
  }
}

export interface Question {
  id: string
  type: QuestionType
  questionText: string
  data: QuestionData
  difficulty: DifficultyLevel
  subject: SubjectArea
  topic: string
  baseFact: string
  timeToSolve: number // in seconds
  marks: number
  conceptsTested: string[]
  explanation: {
    correctAnswer: string
    whyCorrect: string
    whyOthersWrong: string[]
    conceptClarity: string
    memoryTrick?: string
    commonMistakes: string[]
    relatedPYQs: string[]
  }
  metadata: {
    created: string
    qualityScore: number
    pyqSimilarity: number
    highYieldTopic: boolean
    difficultyValidated: boolean
    factuallyAccurate: boolean
  }
  tags: string[]
}

export interface QuestionGenerationConfig {
  baseFact: BaseFact
  questionTypes: QuestionType[]
  difficulties: DifficultyLevel[]
  generateNegatives: boolean
  includeVariations: boolean
  maxQuestionsPerType: number
}

export interface ValidationResult {
  isValid: boolean
  qualityScore: number
  issues: string[]
  suggestions: string[]
  factualAccuracy: boolean
  difficultyAppropriate: boolean
  ambiguityFree: boolean
}

export interface QuestionGenerator {
  generateQuestion(config: QuestionGenerationConfig): Promise<Question[]>
  validateQuestion(question: Question): Promise<ValidationResult>
  getSupportedTypes(): QuestionType[]
}

export interface DifficultyCalculator {
  calculateDifficulty(question: Question): DifficultyLevel
  validateDifficulty(question: Question, expectedDifficulty: DifficultyLevel): boolean
  getDifficultyFactors(): string[]
}

export interface ExplanationEngine {
  generateExplanation(question: Question, baseFact: BaseFact): Question['explanation']
  generateMemoryTrick(concept: string): string
  findCommonMistakes(concept: string): string[]
  findRelatedPYQs(concept: string): string[]
}

export interface PatternAnalyzer {
  analyzePYQSimilarity(question: Question): number
  identifyHighYieldTopics(questions: Question[]): string[]
  generateSimilarPatterns(pyqPattern: string): Question[]
  trackTrends(questions: Question[]): TrendAnalysis
}

export interface TrendAnalysis {
  popularTopics: Array<{topic: string, frequency: number}>
  difficultyDistribution: Record<DifficultyLevel, number>
  questionTypePreference: Record<QuestionType, number>
  emergingPatterns: string[]
}

export interface MultiplicationEngine {
  multiplyFromBaseFact(baseFact: BaseFact): Promise<Question[]>
  generateVariations(baseQuestion: Question): Question[]
  createNegativeVersions(baseQuestion: Question): Question[]
  calculateMultiplicationFactor(baseFact: BaseFact): number
}

export interface QualityValidator {
  validateQuestion(question: Question): ValidationResult
  checkFactualAccuracy(question: Question): boolean
  detectAmbiguity(question: Question): string[]
  verifyDifficulty(question: Question): boolean
  calculateQualityScore(question: Question): number
}