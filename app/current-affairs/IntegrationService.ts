import { NewsAnalysis, IntegrationService } from './types'

export class CurrentAffairsIntegrationService implements IntegrationService {
  
  async linkToStaticContent(newsAnalysis: NewsAnalysis): Promise<Array<{
    lessonId: string
    lessonTitle: string
    relevance: string
  }>> {
    const linkedLessons: Array<{
      lessonId: string
      lessonTitle: string
      relevance: string
    }> = []
    
    // Link based on primary subject
    const subjectLessons = this.getSubjectLessons(newsAnalysis.newsItem.primarySubject)
    
    // Link based on syllabus topics
    newsAnalysis.newsItem.syllabusTopic.forEach(topic => {
      const topicLessons = this.getTopicLessons(topic)
      
      topicLessons.forEach(lesson => {
        const relevance = this.calculateRelevance(newsAnalysis, lesson)
        linkedLessons.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          relevance
        })
      })
    })
    
    // Link based on static connections identified
    newsAnalysis.staticConnections.forEach(connection => {
      const connectionLessons = this.getConnectionLessons(connection)
      linkedLessons.push(...connectionLessons)
    })
    
    // Sort by relevance and return top 10
    return linkedLessons
      .sort((a, b) => this.getRelevanceScore(b.relevance) - this.getRelevanceScore(a.relevance))
      .slice(0, 10)
  }
  
  async updateLessonsWithExamples(lessonId: string, examples: string[]): Promise<void> {
    // In a real implementation, this would update the lesson database
    console.log(`Updating lesson ${lessonId} with ${examples.length} new examples`)
    
    // Simulate lesson update
    const lesson = this.getLesson(lessonId)
    if (lesson) {
      lesson.currentAffairsExamples = [
        ...(lesson.currentAffairsExamples || []),
        ...examples.map(example => ({
          example,
          dateAdded: new Date(),
          source: 'Current Affairs System'
        }))
      ]
    }
  }
  
  async tagQuestionsWithCurrentAffairs(questionId: string, newsReferences: string[]): Promise<void> {
    // In a real implementation, this would update the question database
    console.log(`Tagging question ${questionId} with ${newsReferences.length} news references`)
    
    // Simulate question tagging
    const question = this.getQuestion(questionId)
    if (question) {
      question.currentAffairsTags = [
        ...(question.currentAffairsTags || []),
        ...newsReferences.map(ref => ({
          reference: ref,
          dateTagged: new Date()
        }))
      ]
    }
  }
  
  // Helper methods
  
  private getSubjectLessons(subject: string): Array<{ id: string; title: string }> {
    // Mock data - in real implementation, this would query the lesson database
    const lessonDatabase: Record<string, Array<{ id: string; title: string }>> = {
      'Polity': [
        { id: 'polity-001', title: 'Constitutional Framework' },
        { id: 'polity-002', title: 'Fundamental Rights' },
        { id: 'polity-003', title: 'Parliamentary System' },
        { id: 'polity-004', title: 'Judicial System' },
        { id: 'polity-005', title: 'Federal Structure' }
      ],
      'Economy': [
        { id: 'eco-001', title: 'Economic Development' },
        { id: 'eco-002', title: 'Money and Banking' },
        { id: 'eco-003', title: 'Public Finance' },
        { id: 'eco-004', title: 'International Trade' },
        { id: 'eco-005', title: 'Agriculture and Industry' }
      ],
      'Environment': [
        { id: 'env-001', title: 'Climate Change' },
        { id: 'env-002', title: 'Biodiversity Conservation' },
        { id: 'env-003', title: 'Environmental Pollution' },
        { id: 'env-004', title: 'Sustainable Development' },
        { id: 'env-005', title: 'Renewable Energy' }
      ],
      'International Relations': [
        { id: 'ir-001', title: 'India\'s Foreign Policy' },
        { id: 'ir-002', title: 'International Organizations' },
        { id: 'ir-003', title: 'Bilateral Relations' },
        { id: 'ir-004', title: 'Regional Groupings' },
        { id: 'ir-005', title: 'Global Issues' }
      ]
    }
    
    return lessonDatabase[subject] || []
  }
  
  private getTopicLessons(topic: string): Array<{ id: string; title: string }> {
    // Mock topic-to-lesson mapping
    const topicLessonMap: Record<string, Array<{ id: string; title: string }>> = {
      'Constitutional Framework': [
        { id: 'polity-001', title: 'Constitutional Framework' },
        { id: 'polity-006', title: 'Constitutional Amendments' }
      ],
      'Fundamental Rights': [
        { id: 'polity-002', title: 'Fundamental Rights' },
        { id: 'polity-007', title: 'Rights and Duties' }
      ],
      'Economic Development': [
        { id: 'eco-001', title: 'Economic Development' },
        { id: 'eco-006', title: 'Planning and Development' }
      ],
      'Climate Change': [
        { id: 'env-001', title: 'Climate Change' },
        { id: 'env-006', title: 'Global Environmental Issues' }
      ]
    }
    
    return topicLessonMap[topic] || []
  }
  
  private getConnectionLessons(connection: {
    topic: string
    subject: any
    connection: string
  }): Array<{
    lessonId: string
    lessonTitle: string
    relevance: string
  }> {
    // Generate lessons based on connection type
    const lessons: Array<{
      lessonId: string
      lessonTitle: string
      relevance: string
    }> = []
    
    if (connection.topic.includes('Constitution')) {
      lessons.push({
        lessonId: 'polity-001',
        lessonTitle: 'Constitutional Framework',
        relevance: `Direct connection: ${connection.connection}`
      })
    }
    
    if (connection.topic.includes('Economic')) {
      lessons.push({
        lessonId: 'eco-001',
        lessonTitle: 'Economic Development',
        relevance: `Related concept: ${connection.connection}`
      })
    }
    
    return lessons
  }
  
  private calculateRelevance(
    newsAnalysis: NewsAnalysis, 
    lesson: { id: string; title: string }
  ): string {
    // Calculate relevance based on multiple factors
    let relevanceScore = 0
    let relevanceReason = ''
    
    // Check title match
    const titleWords = lesson.title.toLowerCase().split(' ')
    const newsWords = newsAnalysis.newsItem.title.toLowerCase().split(' ')
    const commonWords = titleWords.filter(word => newsWords.includes(word))
    
    if (commonWords.length > 0) {
      relevanceScore += commonWords.length * 20
      relevanceReason = `Title match: ${commonWords.join(', ')}`
    }
    
    // Check topic match
    if (newsAnalysis.newsItem.syllabusTopic.some(topic => 
      lesson.title.toLowerCase().includes(topic.toLowerCase())
    )) {
      relevanceScore += 30
      relevanceReason += relevanceReason ? '; Topic alignment' : 'Topic alignment'
    }
    
    // Check concept overlap
    const conceptOverlap = newsAnalysis.newsItem.conceptsTested?.filter(concept =>
      lesson.title.toLowerCase().includes(concept.toLowerCase())
    ).length || 0
    
    if (conceptOverlap > 0) {
      relevanceScore += conceptOverlap * 15
      relevanceReason += relevanceReason ? '; Concept overlap' : 'Concept overlap'
    }
    
    // Determine relevance level
    if (relevanceScore >= 70) {
      return `High relevance: ${relevanceReason}`
    } else if (relevanceScore >= 40) {
      return `Medium relevance: ${relevanceReason}`
    } else {
      return `Low relevance: General ${newsAnalysis.newsItem.primarySubject} connection`
    }
  }
  
  private getRelevanceScore(relevance: string): number {
    if (relevance.startsWith('High')) return 3
    if (relevance.startsWith('Medium')) return 2
    return 1
  }
  
  private getLesson(lessonId: string): any {
    // Mock lesson retrieval
    return {
      id: lessonId,
      title: 'Sample Lesson',
      currentAffairsExamples: []
    }
  }
  
  private getQuestion(questionId: string): any {
    // Mock question retrieval
    return {
      id: questionId,
      questionText: 'Sample Question',
      currentAffairsTags: []
    }
  }
  
  // Additional integration methods
  
  async generateCurrentAffairsEnhancedLesson(
    lessonId: string, 
    relatedNews: NewsAnalysis[]
  ): Promise<{
    lessonId: string
    enhancedSections: Array<{
      sectionTitle: string
      content: string
    }>
  }> {
    const lesson = this.getLesson(lessonId)
    const enhancedSections: Array<{ sectionTitle: string; content: string }> = []
    
    // Add current affairs section
    enhancedSections.push({
      sectionTitle: 'Recent Developments',
      content: this.generateRecentDevelopmentsSection(relatedNews)
    })
    
    // Add contemporary examples
    enhancedSections.push({
      sectionTitle: 'Contemporary Examples',
      content: this.generateContemporaryExamplesSection(relatedNews)
    })
    
    // Add exam perspective
    enhancedSections.push({
      sectionTitle: 'Current Affairs in Exams',
      content: this.generateExamPerspectiveSection(relatedNews)
    })
    
    return {
      lessonId,
      enhancedSections
    }
  }
  
  private generateRecentDevelopmentsSection(newsAnalyses: NewsAnalysis[]): string {
    let content = 'Recent developments related to this topic:\n\n'
    
    newsAnalyses.slice(0, 5).forEach((analysis, index) => {
      content += `${index + 1}. ${analysis.newsItem.title}\n`
      content += `   Date: ${analysis.newsItem.publishedDate.toLocaleDateString()}\n`
      content += `   Key Point: ${analysis.keyPoints[0]}\n`
      content += `   UPSC Relevance: ${analysis.upscAngle.substring(0, 100)}...\n\n`
    })
    
    return content
  }
  
  private generateContemporaryExamplesSection(newsAnalyses: NewsAnalysis[]): string {
    let content = 'Use these contemporary examples in your answers:\n\n'
    
    newsAnalyses.forEach(analysis => {
      if (analysis.factsAndFigures.length > 0) {
        content += `• ${analysis.newsItem.title}:\n`
        analysis.factsAndFigures.slice(0, 3).forEach(fact => {
          content += `  - ${fact.fact} (${fact.importance})\n`
        })
        content += '\n'
      }
    })
    
    return content
  }
  
  private generateExamPerspectiveSection(newsAnalyses: NewsAnalysis[]): string {
    let content = 'How this topic might appear in exams:\n\n'
    
    content += 'Prelims Focus:\n'
    const prelimsQuestions = newsAnalyses.flatMap(a => a.probableQuestions.prelims).slice(0, 3)
    prelimsQuestions.forEach((q, i) => {
      content += `${i + 1}. ${q.question.substring(0, 100)}...\n`
    })
    
    content += '\nMains Focus:\n'
    const mainsQuestions = newsAnalyses.flatMap(a => a.probableQuestions.mains).slice(0, 2)
    mainsQuestions.forEach((q, i) => {
      content += `${i + 1}. ${q.question}\n`
    })
    
    return content
  }
  
  async createCurrentAffairsQuestionBank(
    newsAnalyses: NewsAnalysis[]
  ): Promise<{
    totalQuestions: number
    bySubject: Record<string, number>
    byDifficulty: Record<string, number>
    questions: Array<{
      id: string
      question: string
      type: 'Prelims' | 'Mains'
      subject: string
      newsSource: string
    }>
  }> {
    const allQuestions: Array<{
      id: string
      question: string
      type: 'Prelims' | 'Mains'
      subject: string
      newsSource: string
    }> = []
    
    // Extract all questions
    newsAnalyses.forEach(analysis => {
      // Add prelims questions
      analysis.probableQuestions.prelims.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          type: 'Prelims',
          subject: analysis.newsItem.primarySubject,
          newsSource: analysis.newsItem.title
        })
      })
      
      // Add mains questions
      analysis.probableQuestions.mains.forEach(q => {
        allQuestions.push({
          id: q.id,
          question: q.question,
          type: 'Mains',
          subject: analysis.newsItem.primarySubject,
          newsSource: analysis.newsItem.title
        })
      })
    })
    
    // Calculate statistics
    const bySubject: Record<string, number> = {}
    const byDifficulty: Record<string, number> = { Prelims: 0, Mains: 0 }
    
    allQuestions.forEach(q => {
      bySubject[q.subject] = (bySubject[q.subject] || 0) + 1
      byDifficulty[q.type]++
    })
    
    return {
      totalQuestions: allQuestions.length,
      bySubject,
      byDifficulty,
      questions: allQuestions
    }
  }
}