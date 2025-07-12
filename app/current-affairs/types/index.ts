// Type definitions for Current Affairs System

export type NewsSource = 
  | 'PIB'
  | 'TheHindu'
  | 'IndianExpress'
  | 'EconomicTimes'
  | 'DownToEarth'

export type SubjectArea = 
  | 'Polity'
  | 'Economy'
  | 'Geography'
  | 'History'
  | 'Environment'
  | 'Science & Technology'
  | 'International Relations'
  | 'Social Issues'
  | 'Art & Culture'
  | 'Ethics'

export type MainsPaper = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay'
export type RelevanceLevel = 'High' | 'Medium' | 'Low'

export interface NewsItem {
  id: string
  source: NewsSource
  title: string
  content: string
  publishedDate: Date
  url: string
  author?: string
  tags: string[]
  imageUrl?: string
  originalLength: number
}

export interface ProcessedNewsItem extends NewsItem {
  upscRelevanceScore: number
  primarySubject: SubjectArea
  secondarySubjects: SubjectArea[]
  syllabusTopic: string[]
  prelimsRelevance: RelevanceLevel
  mainsRelevance: {
    papers: MainsPaper[]
    relevanceLevel: RelevanceLevel
  }
  questionProbability: number
  processingMetadata: {
    processedAt: Date
    version: string
    confidence: number
  }
}

export interface NewsAnalysis {
  newsItem: ProcessedNewsItem
  summary: {
    twoMinuteRead: string
    wordCount: number
  }
  keyPoints: string[]
  factsAndFigures: Array<{
    fact: string
    source: string
    importance: string
  }>
  backgroundContext: string
  upscAngle: string
  staticConnections: Array<{
    topic: string
    subject: SubjectArea
    connection: string
  }>
  probableQuestions: {
    prelims: PrelimsQuestion[]
    mains: MainsQuestion[]
  }
  relatedPYQs: string[]
}

export interface PrelimsQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
}

export interface MainsQuestion {
  id: string
  question: string
  wordLimit: number
  paper: MainsPaper
  marks: number
  modelAnswerPoints: string[]
  approach: string
}

export interface DailyCompilation {
  date: Date
  topStories: NewsAnalysis[]
  quiz: PrelimsQuestion[]
  briefSummary: string
  importantUpdates: {
    government: string[]
    economy: string[]
    international: string[]
    environment: string[]
  }
  totalNewsProcessed: number
  totalNewsSelected: number
}

export interface WeeklyCompilation {
  weekNumber: number
  startDate: Date
  endDate: Date
  highlights: string[]
  trendingTopics: Array<{
    topic: string
    frequency: number
    importance: string
  }>
  consolidatedQuiz: PrelimsQuestion[]
  mainsTopics: MainsQuestion[]
  revisionNotes: Array<{
    subject: SubjectArea
    points: string[]
  }>
  predictedTopics: Array<{
    topic: string
    probability: number
    reasoning: string
  }>
}

export interface TrendAnalysis {
  period: {
    start: Date
    end: Date
  }
  recurringThemes: Array<{
    theme: string
    occurrences: number
    newsItems: string[]
    importance: 'Critical' | 'Important' | 'Moderate'
  }>
  emergingTopics: Array<{
    topic: string
    growthRate: number
    firstAppeared: Date
    predictedImportance: string
  }>
  subjectDistribution: Record<SubjectArea, number>
  sourceBias: Record<NewsSource, number>
  examPredictions: Array<{
    topic: string
    examType: 'Prelims' | 'Mains' | 'Both'
    probability: number
    reasoning: string
  }>
}

export interface ContentGenerationConfig {
  summaryLength: number
  keyPointsCount: number
  prelimsQuestionsCount: number
  mainsQuestionsCount: number
  includeInfographics: boolean
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface RelevanceScoreFactors {
  syllabusMatch: number          // 0-25
  governmentPolicy: number       // 0-20
  constitutionalImportance: number // 0-15
  internationalImpact: number    // 0-10
  economicImplications: number   // 0-10
  environmentalSignificance: number // 0-10
  historicalPrecedent: number    // 0-10
}

export interface NewsAggregator {
  fetchNews(source: NewsSource, date: Date): Promise<NewsItem[]>
  parseRSSFeed(feedUrl: string): Promise<NewsItem[]>
  validateNewsItem(item: NewsItem): boolean
}

export interface RelevanceFilter {
  calculateRelevanceScore(newsItem: NewsItem): Promise<number>
  getScoreBreakdown(newsItem: NewsItem): Promise<RelevanceScoreFactors>
  filterByRelevance(newsItems: NewsItem[], threshold: number): Promise<ProcessedNewsItem[]>
}

export interface ContentAnalyzer {
  categorizeNews(newsItem: NewsItem): Promise<ProcessedNewsItem>
  generateAnalysis(processedNews: ProcessedNewsItem): Promise<NewsAnalysis>
  createQuestions(analysis: NewsAnalysis): Promise<{
    prelims: PrelimsQuestion[]
    mains: MainsQuestion[]
  }>
}

export interface CompilationGenerator {
  generateDailyBrief(analyses: NewsAnalysis[], date: Date): Promise<DailyCompilation>
  generateWeeklyCompilation(dailyCompilations: DailyCompilation[]): Promise<WeeklyCompilation>
  generatePDF(compilation: DailyCompilation | WeeklyCompilation): Promise<Buffer>
  generateQuiz(questions: PrelimsQuestion[]): Promise<string>
}

export interface TrendAnalyzer {
  analyzeTrends(newsAnalyses: NewsAnalysis[], period: { start: Date, end: Date }): Promise<TrendAnalysis>
  predictExamTopics(trendAnalysis: TrendAnalysis): Promise<Array<{
    topic: string
    probability: number
    reasoning: string
  }>>
  generateRevisionNotes(recurringThemes: any[]): Promise<string>
}

export interface IntegrationService {
  linkToStaticContent(newsAnalysis: NewsAnalysis): Promise<Array<{
    lessonId: string
    lessonTitle: string
    relevance: string
  }>>
  updateLessonsWithExamples(lessonId: string, examples: string[]): Promise<void>
  tagQuestionsWithCurrentAffairs(questionId: string, newsReferences: string[]): Promise<void>
}