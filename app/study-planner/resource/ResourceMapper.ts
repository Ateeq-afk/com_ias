import {
  ResourceMapper,
  StudySession,
  ResourceMapping,
  SessionType
} from '../types'
import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class UPSCResourceMapper implements ResourceMapper {
  
  private resourceSources = {
    lessons: new Map<string, any>(),
    questions: new Map<string, any>(),
    tests: new Map<string, any>(),
    currentAffairs: new Map<string, any>(),
    books: new Map<string, any>(),
    videos: new Map<string, any>()
  }

  constructor() {
    this.initializeResourceDatabase()
  }

  async mapResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []
    
    // Always add primary lesson content
    const lessonResource = await this.findLessonResource(session)
    if (lessonResource) {
      resources.push(lessonResource)
    }

    // Add session-type specific resources
    switch (session.sessionType) {
      case 'NewConcept':
        resources.push(...await this.getNewConceptResources(session))
        break
      case 'Practice':
        resources.push(...await this.getPracticeResources(session))
        break
      case 'Revision':
        resources.push(...await this.getRevisionResources(session))
        break
      case 'MockTest':
        resources.push(...await this.getMockTestResources(session))
        break
      case 'CurrentAffairs':
        resources.push(...await this.getCurrentAffairsResources(session))
        break
      case 'PYQPractice':
        resources.push(...await this.getPYQResources(session))
        break
      case 'WeakAreaFocus':
        resources.push(...await this.getWeakAreaResources(session))
        break
      case 'StrengthReinforcement':
        resources.push(...await this.getStrengthResources(session))
        break
    }

    // Add supplementary resources
    const supplementaryResources = await this.getSupplementaryResources(session)
    resources.push(...supplementaryResources)

    // Validate and prioritize resources
    return this.prioritizeAndValidateResources(resources, session)
  }

  async findAlternatives(resourceId: string): Promise<ResourceMapping[]> {
    const alternatives: ResourceMapping[] = []
    
    // Parse resource ID to understand type and content
    const resourceInfo = this.parseResourceId(resourceId)
    
    if (!resourceInfo) {
      return alternatives
    }

    // Find alternative lessons
    if (resourceInfo.type === 'lesson') {
      const altLessons = await this.findAlternativeLessons(resourceInfo.subject, resourceInfo.topic)
      alternatives.push(...altLessons)
    }

    // Find alternative questions
    if (resourceInfo.type === 'questions') {
      const altQuestions = await this.findAlternativeQuestions(resourceInfo.subject, resourceInfo.topic)
      alternatives.push(...altQuestions)
    }

    // Find alternative videos
    const altVideos = await this.findAlternativeVideos(resourceInfo.subject, resourceInfo.topic)
    alternatives.push(...altVideos)

    // Find alternative books/articles
    const altBooks = await this.findAlternativeBooks(resourceInfo.subject, resourceInfo.topic)
    alternatives.push(...altBooks)

    return this.rankAlternatives(alternatives, resourceInfo)
  }

  async validateAvailability(resources: ResourceMapping[]): Promise<boolean> {
    const unavailableResources = []
    
    for (const resource of resources) {
      const isAvailable = await this.checkResourceAvailability(resource)
      if (!isAvailable) {
        unavailableResources.push(resource)
      }
    }

    // If critical resources are unavailable, return false
    const criticalUnavailable = unavailableResources.filter(r => r.priority === 'Must-do')
    
    return criticalUnavailable.length === 0
  }

  private async findLessonResource(session: StudySession): Promise<ResourceMapping | null> {
    const lessonKey = this.generateResourceKey(session.subject, session.topic)
    
    return {
      type: 'Lesson',
      resourceId: `lesson-${lessonKey}`,
      title: `${session.topic} - Comprehensive Study Material`,
      source: 'Lesson Database',
      estimatedTime: Math.floor(session.duration * 0.7), // 70% of session time
      difficulty: session.difficulty,
      priority: 'Must-do',
      completionTracking: true
    }
  }

  private async getNewConceptResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add video explanation
    resources.push({
      type: 'Video',
      resourceId: `video-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Video Explanation`,
      source: 'Video Library',
      estimatedTime: 20,
      difficulty: session.difficulty,
      priority: 'Recommended',
      completionTracking: true
    })

    // Add introductory notes
    resources.push({
      type: 'Notes',
      resourceId: `notes-intro-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Introduction Notes`,
      source: 'Study Notes',
      estimatedTime: 15,
      difficulty: 'easy',
      priority: 'Recommended',
      completionTracking: false
    })

    // Add basic practice questions
    resources.push({
      type: 'Questions',
      resourceId: `questions-basic-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Basic Practice Questions`,
      source: 'Question Bank',
      estimatedTime: 15,
      difficulty: 'easy',
      priority: 'Recommended',
      completionTracking: true
    })

    return resources
  }

  private async getPracticeResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add main practice question set
    resources.push({
      type: 'Questions',
      resourceId: `questions-practice-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Practice Question Set`,
      source: 'Question Generator',
      estimatedTime: Math.floor(session.duration * 0.8),
      difficulty: session.difficulty,
      priority: 'Must-do',
      completionTracking: true
    })

    // Add previous year questions
    resources.push({
      type: 'Questions',
      resourceId: `pyq-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Previous Year Questions`,
      source: 'PYQ Database',
      estimatedTime: 20,
      difficulty: session.difficulty,
      priority: 'Recommended',
      completionTracking: true
    })

    // Add solution explanations
    resources.push({
      type: 'Notes',
      resourceId: `solutions-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Detailed Solutions`,
      source: 'Solution Bank',
      estimatedTime: 10,
      difficulty: session.difficulty,
      priority: 'Optional',
      completionTracking: false
    })

    return resources
  }

  private async getRevisionResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add quick revision notes
    resources.push({
      type: 'Notes',
      resourceId: `revision-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Quick Revision Notes`,
      source: 'Revision Notes',
      estimatedTime: Math.floor(session.duration * 0.5),
      difficulty: 'easy',
      priority: 'Must-do',
      completionTracking: true
    })

    // Add flashcards
    resources.push({
      type: 'Notes',
      resourceId: `flashcards-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Key Points Flashcards`,
      source: 'Flashcard System',
      estimatedTime: 15,
      difficulty: 'easy',
      priority: 'Recommended',
      completionTracking: false
    })

    // Add mixed review questions
    resources.push({
      type: 'Questions',
      resourceId: `review-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Review Questions`,
      source: 'Question Bank',
      estimatedTime: Math.floor(session.duration * 0.4),
      difficulty: session.difficulty,
      priority: 'Recommended',
      completionTracking: true
    })

    return resources
  }

  private async getMockTestResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add full-length mock test
    resources.push({
      type: 'Test',
      resourceId: `mock-test-${Date.now()}`,
      title: 'Full Length Mock Test',
      source: 'Test Generator',
      estimatedTime: 120, // 2 hours
      difficulty: 'hard',
      priority: 'Must-do',
      completionTracking: true
    })

    // Add performance analysis
    resources.push({
      type: 'Notes',
      resourceId: `analysis-${Date.now()}`,
      title: 'Mock Test Performance Analysis',
      source: 'Analytics Engine',
      estimatedTime: 30,
      difficulty: 'medium',
      priority: 'Must-do',
      completionTracking: true
    })

    return resources
  }

  private async getCurrentAffairsResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []
    const currentDate = new Date().toISOString().split('T')[0]

    // Add daily current affairs
    resources.push({
      type: 'Article',
      resourceId: `current-affairs-${currentDate}`,
      title: 'Daily Current Affairs',
      source: 'Current Affairs System',
      estimatedTime: Math.floor(session.duration * 0.6),
      difficulty: 'medium',
      priority: 'Must-do',
      completionTracking: true
    })

    // Add current affairs questions
    resources.push({
      type: 'Questions',
      resourceId: `ca-questions-${currentDate}`,
      title: 'Current Affairs Practice Questions',
      source: 'Current Affairs Generator',
      estimatedTime: 20,
      difficulty: 'medium',
      priority: 'Recommended',
      completionTracking: true
    })

    // Add static-current linkage
    resources.push({
      type: 'Notes',
      resourceId: `static-current-${currentDate}`,
      title: 'Static Topics Connection',
      source: 'Content Mapper',
      estimatedTime: 15,
      difficulty: 'medium',
      priority: 'Optional',
      completionTracking: false
    })

    return resources
  }

  private async getPYQResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add PYQ question set
    resources.push({
      type: 'Questions',
      resourceId: `pyq-set-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.subject} - Previous Year Questions`,
      source: 'PYQ Database',
      estimatedTime: Math.floor(session.duration * 0.8),
      difficulty: session.difficulty,
      priority: 'Must-do',
      completionTracking: true
    })

    // Add trend analysis
    resources.push({
      type: 'Notes',
      resourceId: `pyq-trends-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.subject} - Question Trends Analysis`,
      source: 'Analytics Engine',
      estimatedTime: 15,
      difficulty: 'medium',
      priority: 'Recommended',
      completionTracking: false
    })

    return resources
  }

  private async getWeakAreaResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add targeted concept building
    resources.push({
      type: 'Lesson',
      resourceId: `weak-area-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Concept Building`,
      source: 'Remedial Content',
      estimatedTime: Math.floor(session.duration * 0.5),
      difficulty: 'easy',
      priority: 'Must-do',
      completionTracking: true
    })

    // Add step-by-step practice
    resources.push({
      type: 'Questions',
      resourceId: `weak-practice-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Step-by-step Practice`,
      source: 'Adaptive Questions',
      estimatedTime: Math.floor(session.duration * 0.4),
      difficulty: 'easy',
      priority: 'Must-do',
      completionTracking: true
    })

    return resources
  }

  private async getStrengthResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add advanced level content
    resources.push({
      type: 'Lesson',
      resourceId: `advanced-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Advanced Concepts`,
      source: 'Advanced Content',
      estimatedTime: Math.floor(session.duration * 0.4),
      difficulty: 'hard',
      priority: 'Recommended',
      completionTracking: true
    })

    // Add challenging questions
    resources.push({
      type: 'Questions',
      resourceId: `challenge-${this.generateResourceKey(session.subject, session.topic)}`,
      title: `${session.topic} - Challenge Questions`,
      source: 'Advanced Questions',
      estimatedTime: Math.floor(session.duration * 0.5),
      difficulty: 'hard',
      priority: 'Recommended',
      completionTracking: true
    })

    return resources
  }

  private async getSupplementaryResources(session: StudySession): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add reference books
    const bookResource = await this.findBookResource(session.subject, session.topic)
    if (bookResource) {
      resources.push(bookResource)
    }

    // Add related articles
    const articleResources = await this.findRelatedArticles(session.subject, session.topic)
    resources.push(...articleResources)

    return resources
  }

  private async findBookResource(subject: SubjectArea, topic: string): Promise<ResourceMapping | null> {
    const bookDatabase = this.getBookRecommendations(subject)
    const relevantBook = bookDatabase.find(book => 
      book.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    )

    if (!relevantBook) return null

    return {
      type: 'Book',
      resourceId: `book-${relevantBook.id}`,
      title: relevantBook.title,
      source: 'Reference Library',
      estimatedTime: 45,
      difficulty: 'medium',
      priority: 'Optional',
      completionTracking: false
    }
  }

  private async findRelatedArticles(subject: SubjectArea, topic: string): Promise<ResourceMapping[]> {
    // Mock related articles
    return [{
      type: 'Article',
      resourceId: `article-${this.generateResourceKey(subject, topic)}`,
      title: `${topic} - In-depth Analysis`,
      source: 'Article Database',
      estimatedTime: 20,
      difficulty: 'medium',
      priority: 'Optional',
      completionTracking: false
    }]
  }

  private prioritizeAndValidateResources(resources: ResourceMapping[], session: StudySession): ResourceMapping[] {
    // Remove duplicates
    const uniqueResources = resources.filter((resource, index, self) => 
      index === self.findIndex(r => r.resourceId === resource.resourceId)
    )

    // Sort by priority
    const priorityOrder = { 'Must-do': 0, 'Recommended': 1, 'Optional': 2 }
    uniqueResources.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    // Validate total time doesn't exceed session duration
    let totalTime = 0
    const validatedResources = []

    for (const resource of uniqueResources) {
      if (totalTime + resource.estimatedTime <= session.duration + 15) { // 15 min buffer
        validatedResources.push(resource)
        totalTime += resource.estimatedTime
      } else if (resource.priority === 'Must-do') {
        // Force include must-do resources, adjust time
        resource.estimatedTime = Math.min(resource.estimatedTime, session.duration - totalTime)
        validatedResources.push(resource)
        totalTime += resource.estimatedTime
      }
    }

    return validatedResources
  }

  private parseResourceId(resourceId: string): { type: string; subject: string; topic: string } | null {
    const parts = resourceId.split('-')
    if (parts.length < 3) return null

    return {
      type: parts[0],
      subject: parts[1],
      topic: parts.slice(2).join('-')
    }
  }

  private async findAlternativeLessons(subject: SubjectArea, topic: string): Promise<ResourceMapping[]> {
    return [{
      type: 'Lesson',
      resourceId: `alt-lesson-${this.generateResourceKey(subject, topic)}-2`,
      title: `${topic} - Alternative Explanation`,
      source: 'Alternative Content',
      estimatedTime: 40,
      difficulty: 'medium',
      priority: 'Recommended',
      completionTracking: true
    }]
  }

  private async findAlternativeQuestions(subject: SubjectArea, topic: string): Promise<ResourceMapping[]> {
    return [{
      type: 'Questions',
      resourceId: `alt-questions-${this.generateResourceKey(subject, topic)}-2`,
      title: `${topic} - Alternative Question Set`,
      source: 'Alternative Questions',
      estimatedTime: 30,
      difficulty: 'medium',
      priority: 'Recommended',
      completionTracking: true
    }]
  }

  private async findAlternativeVideos(subject: SubjectArea, topic: string): Promise<ResourceMapping[]> {
    return [{
      type: 'Video',
      resourceId: `alt-video-${this.generateResourceKey(subject, topic)}-2`,
      title: `${topic} - Alternative Video Tutorial`,
      source: 'Video Platform',
      estimatedTime: 25,
      difficulty: 'medium',
      priority: 'Optional',
      completionTracking: false
    }]
  }

  private async findAlternativeBooks(subject: SubjectArea, topic: string): Promise<ResourceMapping[]> {
    return [{
      type: 'Book',
      resourceId: `alt-book-${this.generateResourceKey(subject, topic)}-2`,
      title: `${topic} - Alternative Reference`,
      source: 'Extended Library',
      estimatedTime: 50,
      difficulty: 'medium',
      priority: 'Optional',
      completionTracking: false
    }]
  }

  private rankAlternatives(alternatives: ResourceMapping[], originalResource: any): ResourceMapping[] {
    // Rank based on similarity to original and quality scores
    return alternatives.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, originalResource)
      const bScore = this.calculateRelevanceScore(b, originalResource)
      return bScore - aScore
    })
  }

  private calculateRelevanceScore(resource: ResourceMapping, original: any): number {
    let score = 0
    
    // Same type gets higher score
    if (resource.type === original.type) score += 3
    
    // Similar difficulty gets higher score
    if (resource.difficulty === original.difficulty) score += 2
    
    // Shorter time difference gets higher score
    const timeDiff = Math.abs(resource.estimatedTime - 30) // Assuming 30 min baseline
    score += Math.max(0, 2 - timeDiff / 15)
    
    return score
  }

  private async checkResourceAvailability(resource: ResourceMapping): Promise<boolean> {
    // Mock availability check - in production, would check actual resource existence
    const unavailableIds = ['broken-resource-1', 'maintenance-resource-2']
    return !unavailableIds.includes(resource.resourceId)
  }

  private generateResourceKey(subject: SubjectArea, topic: string): string {
    return `${subject.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/\s+/g, '-')}`
  }

  private getBookRecommendations(subject: SubjectArea): any[] {
    const books = {
      'Polity': [
        { id: 'laxmikanth', title: 'Indian Polity by M. Laxmikanth', topics: ['Constitution', 'Parliament', 'Executive', 'Judiciary'] },
        { id: 'dd-basu', title: 'Introduction to Constitution of India by DD Basu', topics: ['Constitutional Law', 'Fundamental Rights'] }
      ],
      'History': [
        { id: 'ncert-history', title: 'NCERT History Books', topics: ['Ancient India', 'Medieval India', 'Modern India'] },
        { id: 'bipan-chandra', title: 'India\'s Struggle for Independence by Bipan Chandra', topics: ['Freedom Struggle', 'National Movement'] }
      ],
      'Geography': [
        { id: 'ncert-geography', title: 'NCERT Geography Books', topics: ['Physical Geography', 'Human Geography', 'Indian Geography'] },
        { id: 'gc-leong', title: 'Physical Geography by GC Leong', topics: ['Climatology', 'Geomorphology'] }
      ],
      'Economy': [
        { id: 'ramesh-singh', title: 'Indian Economy by Ramesh Singh', topics: ['Economic Development', 'Planning', 'Banking'] },
        { id: 'ncert-economics', title: 'NCERT Economics Books', topics: ['Microeconomics', 'Macroeconomics'] }
      ],
      'Environment': [
        { id: 'shankar-ias', title: 'Environment by Shankar IAS Academy', topics: ['Ecology', 'Climate Change', 'Biodiversity'] }
      ],
      'Science & Technology': [
        { id: 'ncert-science', title: 'NCERT Science Books', topics: ['Physics', 'Chemistry', 'Biology', 'Technology'] }
      ],
      'Current Affairs': [
        { id: 'yojana', title: 'Yojana Magazine', topics: ['Government Schemes', 'Economic Developments'] },
        { id: 'kurukshetra', title: 'Kurukshetra Magazine', topics: ['Rural Development', 'Agriculture'] }
      ]
    }

    return books[subject] || []
  }

  private initializeResourceDatabase(): void {
    // Initialize with mock data - in production, would load from actual databases
    console.log('Resource database initialized')
  }
}