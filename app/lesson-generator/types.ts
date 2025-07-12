// Comprehensive type definitions for the lesson generation system

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

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type LessonTemplate = 
  | 'ConceptExplanation'
  | 'ComparativeAnalysis'
  | 'TimelineExploration'
  | 'ProcessFlow'
  | 'CaseStudyAnalysis'
  | 'MapBased'
  | 'DataInterpretation'
  | 'ConstitutionalArticles'
  | 'CurrentAffairsLink'
  | 'ProblemSolving'

export interface LessonMetadata {
  id: string
  title: string
  subject: SubjectArea
  topic: string
  subtopic?: string
  difficulty: DifficultyLevel
  template: LessonTemplate
  duration: number // in minutes
  prerequisites: string[]
  tags: string[]
  examWeight: 'high' | 'medium' | 'low'
  createdAt: string
  lastUpdated: string
}

export interface InteractiveElement {
  type: string
  data: any
}

export interface PracticeQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: DifficultyLevel
  conceptsTested: string[]
  timeToSolve: number // in seconds
}

export interface PreviousYearQuestion {
  year: number
  question: string
  marks: number
  expectedAnswer: string
  examinerInsight: string
}

export interface Lesson {
  metadata: LessonMetadata
  content: {
    introduction: string
    mainExplanation: string
    examples: string[]
    visualElements?: string[] // URLs or descriptions
    interactiveElements: InteractiveElement[]
  }
  practice: {
    questions: PracticeQuestion[]
    previousYearQuestion: PreviousYearQuestion
  }
  summary: {
    keyTakeaways: string[]
    mnemonics?: string[]
    commonMistakes: string[]
    examTips: string[]
  }
  connections: {
    relatedTopics: string[]
    prerequisiteTopics: string[]
    nextTopics: string[]
    crossSubjectLinks: string[]
  }
}

export interface SyllabusTopic {
  id: string
  subject: SubjectArea
  mainTopic: string
  subTopics: string[]
  microTopics: string[]
  weight: number // 1-10 scale
  examFrequency: 'very-high' | 'high' | 'medium' | 'low'
  suggestedTemplate: LessonTemplate
  prerequisites: string[]
  estimatedLessons: number
}

export interface GeneratorConfig {
  topic: string
  subject: SubjectArea
  difficulty: DifficultyLevel
  template: LessonTemplate
  prerequisites?: string[]
  customParams?: Record<string, any>
}

export interface TemplateGenerator {
  generate(config: GeneratorConfig): Promise<Lesson>
  validateInput(config: GeneratorConfig): boolean
  getSupportedSubjects(): SubjectArea[]
}