import {
  ContentTracker,
  TrackingData,
  LessonTracking,
  QuestionTracking,
  CurrentAffairsTracking,
  ConceptTracking,
  RevisionItem,
  RevisionContent
} from '../types'
import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class UPSCContentTracker implements ContentTracker {
  
  private trackingDatabase: Map<string, TrackingData> = new Map()
  private revisionItems: Map<string, RevisionItem[]> = new Map()

  async trackLessonCompletion(userId: string, lessonId: string): Promise<void> {
    console.log(`📖 Tracking lesson completion: ${lessonId} for user ${userId}`)
    
    const trackingData = await this.getTrackingData(userId)
    const lessonData = await this.getLessonData(lessonId)
    
    // Create lesson tracking record
    const lessonTracking: LessonTracking = {
      lessonId,
      subject: lessonData.subject,
      topic: lessonData.topic,
      completedAt: new Date(),
      timeSpent: lessonData.estimatedTime,
      comprehensionScore: 85, // Mock score, would come from lesson quiz
      keyPointsExtracted: this.extractKeyPoints(lessonData.content)
    }
    
    trackingData.lessonsCompleted.push(lessonTracking)
    
    // Create revision items from lesson
    const revisionItems = await this.createRevisionItemsFromLesson(userId, lessonData)
    await this.addRevisionItems(userId, revisionItems)
    
    // Update total time spent
    trackingData.totalTimeSpent += lessonData.estimatedTime
    
    await this.saveTrackingData(userId, trackingData)
    
    console.log(`✅ Lesson tracked. Created ${revisionItems.length} revision items`)
  }

  async trackQuestionAttempt(userId: string, questionId: string, accuracy: number): Promise<void> {
    console.log(`❓ Tracking question attempt: ${questionId} (${accuracy}% accuracy)`)
    
    const trackingData = await this.getTrackingData(userId)
    const questionData = await this.getQuestionData(questionId)
    
    // Create question tracking record
    const questionTracking: QuestionTracking = {
      questionId,
      subject: questionData.subject,
      topic: questionData.topic,
      attemptedAt: new Date(),
      accuracy,
      timeSpent: questionData.estimatedTime,
      difficulty: questionData.difficulty,
      conceptsUsed: this.extractConceptsFromQuestion(questionData)
    }
    
    trackingData.questionsAttempted.push(questionTracking)
    
    // Update related revision items based on performance
    await this.updateRevisionItemsFromQuestion(userId, questionData, accuracy)
    
    // Update concept mastery
    await this.updateConceptMastery(userId, questionData.concepts, accuracy)
    
    await this.saveTrackingData(userId, trackingData)
    
    console.log(`✅ Question attempt tracked and revision items updated`)
  }

  async trackCurrentAffairsRead(userId: string, articleId: string, importance: string): Promise<void> {
    console.log(`📰 Tracking current affairs: ${articleId} (importance: ${importance})`)
    
    const trackingData = await this.getTrackingData(userId)
    const articleData = await this.getCurrentAffairsData(articleId)
    
    // Create current affairs tracking record
    const caTracking: CurrentAffairsTracking = {
      articleId,
      readAt: new Date(),
      importance,
      timeSpent: articleData.estimatedTime,
      staticConnections: this.findStaticConnections(articleData.content),
      retentionScore: 75 // Initial score
    }
    
    trackingData.currentAffairsRead.push(caTracking)
    
    // Create revision items for important current affairs
    if (importance === 'Critical' || importance === 'High') {
      const revisionItems = await this.createRevisionItemsFromCurrentAffairs(userId, articleData)
      await this.addRevisionItems(userId, revisionItems)
    }
    
    trackingData.totalTimeSpent += articleData.estimatedTime
    
    await this.saveTrackingData(userId, trackingData)
    
    console.log(`✅ Current affairs tracked. Created revision items for important content`)
  }

  async getTrackingData(userId: string): Promise<TrackingData> {
    if (!this.trackingDatabase.has(userId)) {
      // Initialize empty tracking data
      const emptyData: TrackingData = {
        lessonsCompleted: [],
        questionsAttempted: [],
        currentAffairsRead: [],
        conceptsMastered: [],
        totalTimeSpent: 0,
        retentionScores: {}
      }
      this.trackingDatabase.set(userId, emptyData)
    }
    
    return this.trackingDatabase.get(userId)!
  }

  async updateRetentionScore(userId: string, itemId: string, score: number): Promise<void> {
    const trackingData = await this.getTrackingData(userId)
    trackingData.retentionScores[itemId] = score
    await this.saveTrackingData(userId, trackingData)
  }

  // Advanced tracking methods
  async getComprehensiveTrackingReport(userId: string): Promise<any> {
    const trackingData = await this.getTrackingData(userId)
    const revisionItems = this.revisionItems.get(userId) || []
    
    return {
      overview: this.generateOverviewStats(trackingData),
      subjectAnalysis: this.analyzeSubjectProgress(trackingData),
      retentionAnalysis: this.analyzeRetentionPatterns(trackingData, revisionItems),
      learningVelocity: this.calculateLearningVelocity(trackingData),
      weaknessAnalysis: this.identifyWeaknesses(trackingData),
      recommendations: this.generateRecommendations(trackingData, revisionItems)
    }
  }

  async getRevisionReadyItems(userId: string): Promise<RevisionItem[]> {
    const items = this.revisionItems.get(userId) || []
    const now = new Date()
    
    return items.filter(item => item.nextRevisionDate <= now)
  }

  async updateItemDifficulty(userId: string, itemId: string, newDifficulty: DifficultyLevel): Promise<void> {
    const items = this.revisionItems.get(userId) || []
    const item = items.find(i => i.id === itemId)
    
    if (item) {
      item.difficulty = newDifficulty
      item.updatedAt = new Date()
      
      // Recalculate intervals based on new difficulty
      this.recalculateIntervalsForDifficulty(item)
    }
  }

  // Private helper methods
  private async createRevisionItemsFromLesson(userId: string, lessonData: any): Promise<RevisionItem[]> {
    const revisionItems: RevisionItem[] = []
    
    // Create items for key concepts
    lessonData.keyConcepts?.forEach((concept: string, index: number) => {
      revisionItems.push({
        id: `lesson-${lessonData.id}-concept-${index}`,
        userId,
        contentId: lessonData.id,
        contentType: 'Concept',
        subject: lessonData.subject,
        topic: lessonData.topic,
        subtopic: concept,
        content: {
          title: concept,
          keyPoints: lessonData.keyPoints?.filter((point: string) => 
            point.toLowerCase().includes(concept.toLowerCase())) || [],
          factoids: lessonData.factoids || [],
          dates: lessonData.importantDates || [],
          examples: lessonData.examples || []
        },
        difficulty: lessonData.difficulty || 'medium',
        importance: this.determineImportance(concept, lessonData.subject),
        interval: 1,
        repetition: 0,
        easeFactor: 2.5,
        nextRevisionDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        lastRevisionDate: new Date(),
        retentionScore: 70,
        recallAccuracy: 0,
        timeToRecall: 0,
        strugglingCount: 0,
        masteryLevel: 'Learning',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: lessonData.tags || [],
        source: 'lesson'
      })
    })
    
    // Create items for important dates
    lessonData.importantDates?.forEach((dateInfo: any, index: number) => {
      revisionItems.push({
        id: `lesson-${lessonData.id}-date-${index}`,
        userId,
        contentId: lessonData.id,
        contentType: 'Date',
        subject: lessonData.subject,
        topic: lessonData.topic,
        content: {
          title: `${dateInfo.event} - ${dateInfo.date}`,
          keyPoints: [dateInfo.significance],
          factoids: [dateInfo.context],
          dates: [dateInfo.date]
        },
        difficulty: 'hard', // Dates are typically hard to remember
        importance: 'High',
        interval: 1,
        repetition: 0,
        easeFactor: 2.5,
        nextRevisionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastRevisionDate: new Date(),
        retentionScore: 60, // Dates have lower initial retention
        recallAccuracy: 0,
        timeToRecall: 0,
        strugglingCount: 0,
        masteryLevel: 'Learning',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['date', 'chronology'],
        source: 'lesson'
      })
    })
    
    // Create items for formulas (if applicable)
    lessonData.formulas?.forEach((formula: string, index: number) => {
      revisionItems.push({
        id: `lesson-${lessonData.id}-formula-${index}`,
        userId,
        contentId: lessonData.id,
        contentType: 'Formula',
        subject: lessonData.subject,
        topic: lessonData.topic,
        content: {
          title: formula,
          keyPoints: lessonData.formulaExplanations?.[index] ? [lessonData.formulaExplanations[index]] : [],
          formulas: [formula]
        },
        difficulty: 'medium',
        importance: 'High',
        interval: 1,
        repetition: 0,
        easeFactor: 2.5,
        nextRevisionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastRevisionDate: new Date(),
        retentionScore: 75,
        recallAccuracy: 0,
        timeToRecall: 0,
        strugglingCount: 0,
        masteryLevel: 'Learning',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['formula', 'calculation'],
        source: 'lesson'
      })
    })
    
    return revisionItems
  }

  private async createRevisionItemsFromCurrentAffairs(userId: string, articleData: any): Promise<RevisionItem[]> {
    const revisionItems: RevisionItem[] = []
    
    // Create main current affairs item
    revisionItems.push({
      id: `ca-${articleData.id}`,
      userId,
      contentId: articleData.id,
      contentType: 'CurrentAffairs',
      subject: this.mapCurrentAffairsToSubject(articleData.category),
      topic: articleData.title,
      content: {
        title: articleData.title,
        keyPoints: articleData.keyPoints || [],
        factoids: articleData.factoids || [],
        dates: articleData.dates || [],
        connections: this.findStaticConnections(articleData.content)
      },
      difficulty: 'medium',
      importance: articleData.importance || 'Medium',
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      nextRevisionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastRevisionDate: new Date(),
      retentionScore: 70,
      recallAccuracy: 0,
      timeToRecall: 0,
      strugglingCount: 0,
      masteryLevel: 'Learning',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['current-affairs', articleData.category],
      source: 'current-affairs'
    })
    
    return revisionItems
  }

  private async updateRevisionItemsFromQuestion(userId: string, questionData: any, accuracy: number): Promise<void> {
    const items = this.revisionItems.get(userId) || []
    
    // Find related revision items
    const relatedItems = items.filter(item => 
      item.subject === questionData.subject && 
      item.topic === questionData.topic
    )
    
    // Update retention scores based on question performance
    relatedItems.forEach(item => {
      const performanceImpact = accuracy >= 80 ? 10 : accuracy >= 60 ? 0 : -10
      item.retentionScore = Math.max(0, Math.min(100, item.retentionScore + performanceImpact))
      item.updatedAt = new Date()
      
      // If performance is poor, reduce intervals
      if (accuracy < 60) {
        item.interval = Math.max(1, Math.floor(item.interval * 0.5))
        item.nextRevisionDate = new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000)
        item.strugglingCount += 1
      }
    })
  }

  private async updateConceptMastery(userId: string, concepts: string[], accuracy: number): Promise<void> {
    const trackingData = await this.getTrackingData(userId)
    
    concepts?.forEach(concept => {
      let conceptTracker = trackingData.conceptsMastered.find(c => c.conceptId === concept)
      
      if (!conceptTracker) {
        conceptTracker = {
          conceptId: concept,
          subject: 'Polity', // Would be determined from context
          topic: 'General',
          masteryLevel: 50,
          firstLearned: new Date(),
          lastRevised: new Date(),
          revisionCount: 0,
          retentionTrend: 'Stable'
        }
        trackingData.conceptsMastered.push(conceptTracker)
      }
      
      // Update mastery based on accuracy
      const masteryChange = accuracy >= 80 ? 5 : accuracy >= 60 ? 2 : -3
      conceptTracker.masteryLevel = Math.max(0, Math.min(100, conceptTracker.masteryLevel + masteryChange))
      conceptTracker.lastRevised = new Date()
      conceptTracker.revisionCount += 1
      
      // Update trend
      conceptTracker.retentionTrend = masteryChange > 0 ? 'Improving' : 
                                     masteryChange < 0 ? 'Declining' : 'Stable'
    })
  }

  private async addRevisionItems(userId: string, items: RevisionItem[]): Promise<void> {
    const existingItems = this.revisionItems.get(userId) || []
    existingItems.push(...items)
    this.revisionItems.set(userId, existingItems)
  }

  private async saveTrackingData(userId: string, data: TrackingData): Promise<void> {
    this.trackingDatabase.set(userId, data)
    // In production, save to database
  }

  private extractKeyPoints(content: string): string[] {
    // Simple extraction - in production, would use NLP
    const sentences = content.split('.')
    return sentences
      .filter(s => s.length > 20)
      .slice(0, 5)
      .map(s => s.trim())
  }

  private extractConceptsFromQuestion(questionData: any): string[] {
    return questionData.concepts || questionData.tags || []
  }

  private findStaticConnections(content: string): string[] {
    // Mock implementation - would use NLP to find connections
    const connections = []
    
    if (content.includes('constitution')) connections.push('Constitutional Law')
    if (content.includes('parliament')) connections.push('Parliamentary System')
    if (content.includes('supreme court')) connections.push('Judicial System')
    if (content.includes('economic')) connections.push('Economic Policy')
    
    return connections
  }

  private determineImportance(concept: string, subject: SubjectArea): 'Critical' | 'High' | 'Medium' | 'Low' {
    // Subject-specific importance mapping
    const criticalKeywords = ['fundamental', 'constitutional', 'article', 'amendment', 'right']
    const highKeywords = ['policy', 'scheme', 'act', 'committee', 'commission']
    
    const lowerConcept = concept.toLowerCase()
    
    if (criticalKeywords.some(keyword => lowerConcept.includes(keyword))) {
      return 'Critical'
    }
    
    if (highKeywords.some(keyword => lowerConcept.includes(keyword))) {
      return 'High'
    }
    
    return 'Medium'
  }

  private mapCurrentAffairsToSubject(category: string): SubjectArea {
    const mapping: Record<string, SubjectArea> = {
      'politics': 'Polity',
      'economy': 'Economy',
      'environment': 'Environment',
      'science': 'Science & Technology',
      'international': 'Current Affairs',
      'social': 'Social Issues'
    }
    
    return mapping[category.toLowerCase()] || 'Current Affairs'
  }

  private recalculateIntervalsForDifficulty(item: RevisionItem): void {
    // Adjust intervals based on new difficulty
    const difficultyMultipliers = { easy: 1.3, medium: 1.0, hard: 0.7 }
    const multiplier = difficultyMultipliers[item.difficulty]
    
    item.interval = Math.max(1, Math.round(item.interval * multiplier))
    item.nextRevisionDate = new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000)
  }

  // Analytics helper methods
  private generateOverviewStats(data: TrackingData): any {
    return {
      totalLessons: data.lessonsCompleted.length,
      totalQuestions: data.questionsAttempted.length,
      totalCurrentAffairs: data.currentAffairsRead.length,
      totalTimeSpent: data.totalTimeSpent,
      averageAccuracy: this.calculateAverageAccuracy(data),
      conceptsMastered: data.conceptsMastered.filter(c => c.masteryLevel >= 80).length
    }
  }

  private analyzeSubjectProgress(data: TrackingData): any {
    const subjects: Record<string, any> = {}
    
    // Analyze lesson completion by subject
    data.lessonsCompleted.forEach(lesson => {
      if (!subjects[lesson.subject]) {
        subjects[lesson.subject] = { lessons: 0, questions: 0, avgAccuracy: 0, timeSpent: 0 }
      }
      subjects[lesson.subject].lessons++
      subjects[lesson.subject].timeSpent += lesson.timeSpent
    })
    
    // Analyze question attempts by subject
    data.questionsAttempted.forEach(question => {
      if (subjects[question.subject]) {
        subjects[question.subject].questions++
        subjects[question.subject].avgAccuracy = 
          (subjects[question.subject].avgAccuracy + question.accuracy) / 2
      }
    })
    
    return subjects
  }

  private analyzeRetentionPatterns(data: TrackingData, items: RevisionItem[]): any {
    const patterns = {
      overallRetention: this.calculateOverallRetention(items),
      retentionBySubject: this.calculateRetentionBySubject(items),
      forgettingCurve: this.estimateForgettingCurve(items),
      strongTopics: this.identifyStrongTopics(items),
      weakTopics: this.identifyWeakTopics(items)
    }
    
    return patterns
  }

  private calculateLearningVelocity(data: TrackingData): any {
    const now = new Date()
    const recentData = data.lessonsCompleted.filter(lesson => 
      (now.getTime() - lesson.completedAt.getTime()) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
    )
    
    return {
      lessonsPerWeek: recentData.length,
      conceptsPerWeek: recentData.reduce((sum, lesson) => sum + lesson.keyPointsExtracted.length, 0),
      timePerLesson: recentData.length > 0 ? 
        recentData.reduce((sum, lesson) => sum + lesson.timeSpent, 0) / recentData.length : 0,
      trend: this.calculateVelocityTrend(data)
    }
  }

  private identifyWeaknesses(data: TrackingData): any {
    const weakSubjects = this.findWeakSubjects(data)
    const difficultConcepts = this.findDifficultConcepts(data)
    const lowRetentionTopics = this.findLowRetentionTopics(data)
    
    return {
      weakSubjects,
      difficultConcepts,
      lowRetentionTopics,
      recommendations: this.generateWeaknessRecommendations(weakSubjects, difficultConcepts)
    }
  }

  private generateRecommendations(data: TrackingData, items: RevisionItem[]): string[] {
    const recommendations = []
    
    if (this.calculateAverageAccuracy(data) < 70) {
      recommendations.push('Focus on strengthening fundamental concepts before advanced topics')
    }
    
    const overdueItems = items.filter(item => item.nextRevisionDate < new Date()).length
    if (overdueItems > 10) {
      recommendations.push('Prioritize catching up on overdue revisions')
    }
    
    const strugglingItems = items.filter(item => item.strugglingCount > 2).length
    if (strugglingItems > 0) {
      recommendations.push(`Review ${strugglingItems} concepts that need special attention`)
    }
    
    return recommendations
  }

  // Mock data generation methods
  private async getLessonData(lessonId: string): Promise<any> {
    return {
      id: lessonId,
      subject: 'Polity',
      topic: 'Constitutional Basics',
      estimatedTime: 45,
      difficulty: 'medium',
      content: 'Constitutional basics including fundamental rights and duties...',
      keyConcepts: ['Fundamental Rights', 'Directive Principles', 'Fundamental Duties'],
      keyPoints: ['Right to Equality', 'Right to Freedom', 'Educational Rights'],
      factoids: ['Article 14-18 deal with equality', 'Article 19-22 cover freedoms'],
      importantDates: [
        { date: '1950', event: 'Constitution enforcement', significance: 'Republic Day' }
      ],
      tags: ['constitution', 'rights', 'polity']
    }
  }

  private async getQuestionData(questionId: string): Promise<any> {
    return {
      id: questionId,
      subject: 'Polity',
      topic: 'Fundamental Rights',
      difficulty: 'medium',
      estimatedTime: 2,
      concepts: ['Right to Equality', 'Article 14'],
      tags: ['constitution', 'rights']
    }
  }

  private async getCurrentAffairsData(articleId: string): Promise<any> {
    return {
      id: articleId,
      title: 'New Education Policy Implementation',
      category: 'Education',
      importance: 'High',
      estimatedTime: 15,
      content: 'The new education policy focuses on holistic development...',
      keyPoints: ['Holistic development', 'Multiple entry/exit', 'Local languages'],
      factoids: ['Target: 6% GDP on education', '10+2 structure replaced'],
      dates: ['2020 - Policy announced', '2021 - Implementation began']
    }
  }

  // Additional helper methods for analytics
  private calculateAverageAccuracy(data: TrackingData): number {
    if (data.questionsAttempted.length === 0) return 0
    return data.questionsAttempted.reduce((sum, q) => sum + q.accuracy, 0) / data.questionsAttempted.length
  }

  private calculateOverallRetention(items: RevisionItem[]): number {
    if (items.length === 0) return 0
    return items.reduce((sum, item) => sum + item.retentionScore, 0) / items.length
  }

  private calculateRetentionBySubject(items: RevisionItem[]): Record<string, number> {
    const subjectRetention: Record<string, number[]> = {}
    
    items.forEach(item => {
      if (!subjectRetention[item.subject]) {
        subjectRetention[item.subject] = []
      }
      subjectRetention[item.subject].push(item.retentionScore)
    })
    
    const avgRetention: Record<string, number> = {}
    Object.entries(subjectRetention).forEach(([subject, scores]) => {
      avgRetention[subject] = scores.reduce((sum, score) => sum + score, 0) / scores.length
    })
    
    return avgRetention
  }

  private estimateForgettingCurve(items: RevisionItem[]): any {
    // Simplified forgetting curve estimation
    return {
      initialRetention: 100,
      after24Hours: 85,
      after3Days: 70,
      after7Days: 60,
      after30Days: 40
    }
  }

  private identifyStrongTopics(items: RevisionItem[]): string[] {
    return items
      .filter(item => item.retentionScore >= 85 && item.masteryLevel === 'Mastered')
      .map(item => item.topic)
      .slice(0, 5)
  }

  private identifyWeakTopics(items: RevisionItem[]): string[] {
    return items
      .filter(item => item.retentionScore < 60 || item.strugglingCount > 2)
      .map(item => item.topic)
      .slice(0, 5)
  }

  private findWeakSubjects(data: TrackingData): string[] {
    const subjectAccuracy: Record<string, number[]> = {}
    
    data.questionsAttempted.forEach(question => {
      if (!subjectAccuracy[question.subject]) {
        subjectAccuracy[question.subject] = []
      }
      subjectAccuracy[question.subject].push(question.accuracy)
    })
    
    return Object.entries(subjectAccuracy)
      .filter(([_, accuracies]) => {
        const avg = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
        return avg < 70
      })
      .map(([subject, _]) => subject)
  }

  private findDifficultConcepts(data: TrackingData): string[] {
    return data.conceptsMastered
      .filter(concept => concept.masteryLevel < 60 || concept.retentionTrend === 'Declining')
      .map(concept => concept.conceptId)
      .slice(0, 5)
  }

  private findLowRetentionTopics(data: TrackingData): string[] {
    const topicRetention: Record<string, number[]> = {}
    
    Object.entries(data.retentionScores).forEach(([itemId, score]) => {
      // Extract topic from itemId (simplified)
      const topic = itemId.split('-')[2] || 'Unknown'
      if (!topicRetention[topic]) {
        topicRetention[topic] = []
      }
      topicRetention[topic].push(score)
    })
    
    return Object.entries(topicRetention)
      .filter(([_, scores]) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
        return avg < 65
      })
      .map(([topic, _]) => topic)
      .slice(0, 5)
  }

  private calculateVelocityTrend(data: TrackingData): 'Improving' | 'Stable' | 'Declining' {
    // Compare recent performance with past performance
    const now = new Date()
    const recentLessons = data.lessonsCompleted.filter(lesson => 
      (now.getTime() - lesson.completedAt.getTime()) < (7 * 24 * 60 * 60 * 1000)
    )
    const pastLessons = data.lessonsCompleted.filter(lesson => {
      const daysDiff = (now.getTime() - lesson.completedAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff >= 7 && daysDiff < 14
    })
    
    if (recentLessons.length > pastLessons.length) return 'Improving'
    if (recentLessons.length < pastLessons.length) return 'Declining'
    return 'Stable'
  }

  private generateWeaknessRecommendations(weakSubjects: string[], difficultConcepts: string[]): string[] {
    const recommendations = []
    
    if (weakSubjects.length > 0) {
      recommendations.push(`Focus additional study time on: ${weakSubjects.join(', ')}`)
    }
    
    if (difficultConcepts.length > 0) {
      recommendations.push(`Review and practice these concepts: ${difficultConcepts.join(', ')}`)
    }
    
    return recommendations
  }
}