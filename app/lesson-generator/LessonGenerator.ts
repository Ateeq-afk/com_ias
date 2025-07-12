import { TemplateGenerator, Lesson, GeneratorConfig, LessonTemplate, SubjectArea } from './types'
import { UPSCSyllabusParser } from './syllabus/upsc-syllabus'
import { ConceptExplanationTemplate } from './templates/ConceptExplanation'
import { ComparativeAnalysisTemplate } from './templates/ComparativeAnalysis'
import { TimelineExplorationTemplate } from './templates/TimelineExploration'
import { ProcessFlowTemplate } from './templates/ProcessFlow'

// Additional template imports (placeholders for now)
class CaseStudyAnalysisTemplate extends ConceptExplanationTemplate {
  protected templateName = 'CaseStudyAnalysis'
}
class MapBasedTemplate extends ConceptExplanationTemplate {
  protected templateName = 'MapBased'
}
class DataInterpretationTemplate extends ConceptExplanationTemplate {
  protected templateName = 'DataInterpretation'
}
class ConstitutionalArticlesTemplate extends ConceptExplanationTemplate {
  protected templateName = 'ConstitutionalArticles'
}
class CurrentAffairsLinkTemplate extends ConceptExplanationTemplate {
  protected templateName = 'CurrentAffairsLink'
}
class ProblemSolvingTemplate extends ConceptExplanationTemplate {
  protected templateName = 'ProblemSolving'
}

export class LessonGenerator {
  private templates: Map<LessonTemplate, TemplateGenerator> = new Map()
  private syllabusParser: UPSCSyllabusParser
  private generatedLessons: Lesson[] = []
  
  constructor() {
    this.syllabusParser = new UPSCSyllabusParser()
    this.initializeTemplates()
  }
  
  private initializeTemplates() {
    this.templates.set('ConceptExplanation', new ConceptExplanationTemplate())
    this.templates.set('ComparativeAnalysis', new ComparativeAnalysisTemplate())
    this.templates.set('TimelineExploration', new TimelineExplorationTemplate())
    this.templates.set('ProcessFlow', new ProcessFlowTemplate())
    this.templates.set('CaseStudyAnalysis', new CaseStudyAnalysisTemplate())
    this.templates.set('MapBased', new MapBasedTemplate())
    this.templates.set('DataInterpretation', new DataInterpretationTemplate())
    this.templates.set('ConstitutionalArticles', new ConstitutionalArticlesTemplate())
    this.templates.set('CurrentAffairsLink', new CurrentAffairsLinkTemplate())
    this.templates.set('ProblemSolving', new ProblemSolvingTemplate())
  }
  
  /**
   * Generate a single lesson
   */
  async generateLesson(config: GeneratorConfig): Promise<Lesson> {
    const template = this.templates.get(config.template)
    if (!template) {
      throw new Error(`Template ${config.template} not found`)
    }
    
    if (!template.validateInput(config)) {
      throw new Error(`Invalid configuration for template ${config.template}`)
    }
    
    const lesson = await template.generate(config)
    this.generatedLessons.push(lesson)
    return lesson
  }
  
  /**
   * Bulk generate lessons for entire syllabus
   */
  async generateBulkLessons(
    subjects?: SubjectArea[],
    difficultyLevels: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'],
    options: {
      maxLessonsPerTopic?: number
      priorityOnly?: boolean
      outputFormat?: 'json' | 'database'
    } = {}
  ): Promise<{
    lessons: Lesson[]
    summary: {
      totalLessons: number
      lessonsPerSubject: Record<SubjectArea, number>
      lessonsPerTemplate: Record<LessonTemplate, number>
      estimatedStudyHours: number
    }
  }> {
    const { maxLessonsPerTopic = 3, priorityOnly = false, outputFormat = 'json' } = options
    
    // Get syllabus topics
    let syllabusTopics = subjects 
      ? subjects.flatMap(subject => this.syllabusParser.getTopicsBySubject(subject))
      : this.syllabusParser.getAllTopics()
      
    if (priorityOnly) {
      syllabusTopics = syllabusTopics.filter(topic => topic.weight >= 8)
    }
    
    const lessons: Lesson[] = []
    const lessonsPerSubject: Record<SubjectArea, number> = {} as any
    const lessonsPerTemplate: Record<LessonTemplate, number> = {} as any
    
    // Initialize counters
    subjects?.forEach(subject => {
      lessonsPerSubject[subject] = 0
    })
    
    for (const topic of syllabusTopics) {
      // Generate lessons for each difficulty level
      for (const difficulty of difficultyLevels) {
        const lessonsForTopic = Math.min(
          maxLessonsPerTopic,
          Math.ceil(topic.estimatedLessons / difficultyLevels.length)
        )
        
        for (let i = 0; i < lessonsForTopic; i++) {
          const lessonTopic = topic.microTopics[i] || `${topic.mainTopic} - Part ${i + 1}`
          
          const config: GeneratorConfig = {
            topic: lessonTopic,
            subject: topic.subject,
            difficulty,
            template: topic.suggestedTemplate,
            prerequisites: topic.prerequisites
          }
          
          try {
            const lesson = await this.generateLesson(config)
            lessons.push(lesson)
            
            // Update counters
            lessonsPerSubject[topic.subject] = (lessonsPerSubject[topic.subject] || 0) + 1
            lessonsPerTemplate[topic.suggestedTemplate] = (lessonsPerTemplate[topic.suggestedTemplate] || 0) + 1
            
            // Add small delay to prevent overwhelming
            await this.delay(10)
            
          } catch (error) {
            console.error(`Failed to generate lesson for ${lessonTopic}:`, error)
          }
        }
      }
    }
    
    // Output lessons based on format
    if (outputFormat === 'json') {
      await this.saveToJSON(lessons)
    }
    
    const summary = {
      totalLessons: lessons.length,
      lessonsPerSubject,
      lessonsPerTemplate,
      estimatedStudyHours: lessons.length * 0.25 // 15 minutes per lesson
    }
    
    return { lessons, summary }
  }
  
  /**
   * Generate lessons for specific topic with variations
   */
  async generateTopicVariations(
    topic: string,
    subject: SubjectArea,
    variations: {
      templates: LessonTemplate[]
      difficulties: ('beginner' | 'intermediate' | 'advanced')[]
      customParams?: Record<string, any>[]
    }
  ): Promise<Lesson[]> {
    const lessons: Lesson[] = []
    
    for (const template of variations.templates) {
      for (const difficulty of variations.difficulties) {
        const config: GeneratorConfig = {
          topic,
          subject,
          difficulty,
          template,
          customParams: variations.customParams?.[0] || {}
        }
        
        try {
          const lesson = await this.generateLesson(config)
          lessons.push(lesson)
        } catch (error) {
          console.error(`Failed to generate ${template} lesson for ${topic}:`, error)
        }
      }
    }
    
    return lessons
  }
  
  /**
   * Get lesson recommendations based on user progress
   */
  getPersonalizedRecommendations(
    userProgress: {
      completedTopics: string[]
      weakAreas: SubjectArea[]
      preferredDifficulty: 'beginner' | 'intermediate' | 'advanced'
      timeAvailable: number // minutes per day
    }
  ): {
    recommendedLessons: string[] // lesson IDs
    studyPlan: {
      week: number
      lessons: string[]
      estimatedTime: number
    }[]
  } {
    const allTopics = this.syllabusParser.getAllTopics()
    
    // Filter topics based on user progress and weak areas
    const uncompletedTopics = allTopics.filter(topic => 
      !userProgress.completedTopics.includes(topic.id) &&
      (userProgress.weakAreas.length === 0 || userProgress.weakAreas.includes(topic.subject))
    )
    
    // Sort by priority (weight) and exam frequency
    const prioritizedTopics = uncompletedTopics.sort((a, b) => {
      const priorityA = a.weight + (a.examFrequency === 'very-high' ? 3 : a.examFrequency === 'high' ? 2 : 1)
      const priorityB = b.weight + (b.examFrequency === 'very-high' ? 3 : b.examFrequency === 'high' ? 2 : 1)
      return priorityB - priorityA
    })
    
    // Calculate lessons per week based on available time
    const lessonsPerWeek = Math.floor(userProgress.timeAvailable * 7 / 15) // 15 min per lesson
    
    const studyPlan = []
    let currentWeek = 1
    let currentWeekLessons: string[] = []
    
    for (const topic of prioritizedTopics.slice(0, 50)) { // Limit to top 50 topics
      const lessonId = `${topic.subject.toLowerCase()}-${topic.mainTopic.toLowerCase().replace(/\s+/g, '-')}`
      currentWeekLessons.push(lessonId)
      
      if (currentWeekLessons.length >= lessonsPerWeek) {
        studyPlan.push({
          week: currentWeek,
          lessons: [...currentWeekLessons],
          estimatedTime: currentWeekLessons.length * 15
        })
        currentWeek++
        currentWeekLessons = []
      }
    }
    
    // Add remaining lessons to last week
    if (currentWeekLessons.length > 0) {
      studyPlan.push({
        week: currentWeek,
        lessons: currentWeekLessons,
        estimatedTime: currentWeekLessons.length * 15
      })
    }
    
    return {
      recommendedLessons: prioritizedTopics.slice(0, 20).map(t => t.id),
      studyPlan
    }
  }
  
  /**
   * Validate lesson quality
   */
  validateLessonQuality(lesson: Lesson): {
    isValid: boolean
    issues: string[]
    score: number // 0-100
  } {
    const issues: string[] = []
    let score = 100
    
    // Check metadata completeness
    if (!lesson.metadata.title || lesson.metadata.title.length < 10) {
      issues.push('Title too short or missing')
      score -= 10
    }
    
    if (!lesson.metadata.tags || lesson.metadata.tags.length < 3) {
      issues.push('Insufficient tags')
      score -= 5
    }
    
    // Check content quality
    if (!lesson.content.mainExplanation || lesson.content.mainExplanation.length < 500) {
      issues.push('Main explanation too brief')
      score -= 15
    }
    
    if (!lesson.content.examples || lesson.content.examples.length < 2) {
      issues.push('Insufficient examples')
      score -= 10
    }
    
    // Check practice questions
    if (!lesson.practice.questions || lesson.practice.questions.length < 5) {
      issues.push('Insufficient practice questions')
      score -= 20
    }
    
    const hasAllDifficulties = ['beginner', 'intermediate', 'advanced'].every(level =>
      lesson.practice.questions.some(q => q.difficulty === level)
    )
    if (!hasAllDifficulties) {
      issues.push('Missing difficulty levels in questions')
      score -= 10
    }
    
    // Check summary completeness
    if (!lesson.summary.keyTakeaways || lesson.summary.keyTakeaways.length < 3) {
      issues.push('Insufficient key takeaways')
      score -= 10
    }
    
    if (!lesson.summary.examTips || lesson.summary.examTips.length < 3) {
      issues.push('Insufficient exam tips')
      score -= 10
    }
    
    // Check connections
    if (!lesson.connections.relatedTopics || lesson.connections.relatedTopics.length < 2) {
      issues.push('Insufficient topic connections')
      score -= 10
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, score)
    }
  }
  
  /**
   * Export lessons to various formats
   */
  async exportLessons(
    lessons: Lesson[],
    format: 'json' | 'csv' | 'database' | 'pdf',
    options: {
      includeInteractive?: boolean
      compression?: boolean
      batchSize?: number
    } = {}
  ): Promise<string> {
    const { includeInteractive = true, compression = false, batchSize = 100 } = options
    
    switch (format) {
      case 'json':
        return this.exportToJSON(lessons, { includeInteractive, compression })
      case 'csv':
        return this.exportToCSV(lessons)
      case 'database':
        return this.exportToDatabase(lessons, batchSize)
      case 'pdf':
        return this.exportToPDF(lessons)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }
  
  // Helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  private async saveToJSON(lessons: Lesson[]): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `lessons-${timestamp}.json`
    const filepath = `/Users/ateeq/com_ias/app/lesson-generator/output/${filename}`
    
    // Note: In a real implementation, you'd use fs.writeFile
    console.log(`Saving ${lessons.length} lessons to ${filepath}`)
  }
  
  private exportToJSON(lessons: Lesson[], options: any): string {
    const data = JSON.stringify(lessons, null, options.compression ? 0 : 2)
    return data
  }
  
  private exportToCSV(lessons: Lesson[]): string {
    const headers = [
      'ID', 'Title', 'Subject', 'Topic', 'Difficulty', 'Template', 
      'Duration', 'Weight', 'Questions Count', 'Created Date'
    ]
    
    const rows = lessons.map(lesson => [
      lesson.metadata.id,
      lesson.metadata.title,
      lesson.metadata.subject,
      lesson.metadata.topic,
      lesson.metadata.difficulty,
      lesson.metadata.template,
      lesson.metadata.duration,
      lesson.metadata.examWeight,
      lesson.practice.questions.length,
      lesson.metadata.createdAt
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
  
  private async exportToDatabase(lessons: Lesson[], batchSize: number): Promise<string> {
    // Implementation would depend on your database choice
    console.log(`Exporting ${lessons.length} lessons to database in batches of ${batchSize}`)
    return 'Database export completed'
  }
  
  private exportToPDF(lessons: Lesson[]): string {
    // Implementation would use PDF generation library
    console.log(`Generating PDF for ${lessons.length} lessons`)
    return 'PDF export completed'
  }
}