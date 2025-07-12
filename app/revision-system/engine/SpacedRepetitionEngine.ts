import {
  SpacedRepetitionEngine,
  RevisionItem,
  UserResponse,
  SpacedRepetitionConfig,
  DifficultyLevel
} from '../types'
import { SubjectArea } from '../../question-generator/types'

export class UPSCSpacedRepetitionEngine implements SpacedRepetitionEngine {
  
  private config: SpacedRepetitionConfig = {
    easyIntervals: [1, 3, 7, 14, 30, 90],
    mediumIntervals: [1, 2, 5, 10, 21, 60],
    hardIntervals: [1, 1, 3, 7, 14, 30],
    initialEaseFactor: 2.5,
    minEaseFactor: 1.3,
    maxEaseFactor: 2.5,
    easeIncrement: 0.1,
    easeDecrement: 0.2,
    examDateWeight: 0.3
  }

  constructor(customConfig?: Partial<SpacedRepetitionConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig }
    }
  }

  async calculateNextInterval(item: RevisionItem, performance: UserResponse): Promise<number> {
    console.log(`🧠 Calculating next interval for item: ${item.topic}`)
    
    // Get base interval based on difficulty and performance
    let baseInterval = this.getBaseInterval(item, performance)
    
    // Apply SM-2 algorithm modifications
    baseInterval = this.applySM2Algorithm(item, performance, baseInterval)
    
    // Apply UPSC-specific optimizations
    baseInterval = this.applyUPSCOptimizations(item, baseInterval)
    
    // Apply exam date optimization
    const examOptimizedInterval = await this.optimizeForExamDate(item, new Date('2025-06-05'))
    
    // Combine intervals with weights
    const finalInterval = Math.round(
      baseInterval * 0.6 + examOptimizedInterval * 0.4
    )
    
    console.log(`📊 Interval calculation: base=${baseInterval}, exam-optimized=${examOptimizedInterval}, final=${finalInterval}`)
    
    return Math.max(1, Math.min(finalInterval, 90)) // Cap between 1-90 days
  }

  async updateEaseFactor(item: RevisionItem, performance: UserResponse): Promise<number> {
    const currentEase = item.easeFactor
    let newEase = currentEase
    
    // Update ease factor based on self-rating (SM-2 algorithm)
    switch (performance.selfRating) {
      case 'Easy':
        newEase += this.config.easeIncrement * 1.5
        break
      case 'Good':
        newEase += this.config.easeIncrement * 0.5
        break
      case 'Hard':
        newEase -= this.config.easeDecrement
        break
      case 'Again':
        newEase -= this.config.easeDecrement * 1.5
        break
    }
    
    // Apply confidence and accuracy modifiers
    const confidenceModifier = (performance.confidence - 3) * 0.05
    const accuracyModifier = (performance.timeSpent > 30 ? -0.1 : 0.1)
    
    newEase += confidenceModifier + accuracyModifier
    
    // Ensure ease factor stays within bounds
    return Math.max(this.config.minEaseFactor, 
           Math.min(this.config.maxEaseFactor, newEase))
  }

  async optimizeForExamDate(item: RevisionItem, examDate: Date): Promise<number> {
    const now = new Date()
    const daysUntilExam = Math.floor((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExam <= 0) {
      return 1 // Exam is today or past, revise immediately
    }
    
    // Calculate optimal revision frequency based on exam proximity
    const revisionFrequency = this.calculateOptimalFrequency(item, daysUntilExam)
    
    // Apply Ebbinghaus forgetting curve
    const forgettingCurveInterval = this.applyForgettingCurve(item, daysUntilExam)
    
    // Apply importance weight for UPSC-critical topics
    const importanceWeight = this.getImportanceWeight(item)
    
    return Math.round(
      (revisionFrequency * 0.4 + forgettingCurveInterval * 0.4 + importanceWeight * 0.2)
    )
  }

  async getBatchForRevision(userId: string, date: Date): Promise<RevisionItem[]> {
    console.log(`📚 Getting revision batch for user ${userId} on ${date.toDateString()}`)
    
    // Get all items due for revision
    const dueItems = await this.getDueItems(userId, date)
    
    // Apply intelligent batching
    const batchedItems = this.intelligentBatching(dueItems, date)
    
    // Sort by priority and importance
    const sortedItems = this.sortByPriority(batchedItems)
    
    console.log(`📋 Found ${sortedItems.length} items for revision`)
    return sortedItems
  }

  async processRevisionResult(item: RevisionItem, performance: UserResponse): Promise<RevisionItem> {
    console.log(`⚡ Processing revision result for: ${item.topic}`)
    
    // Update ease factor
    const newEaseFactor = await this.updateEaseFactor(item, performance)
    
    // Calculate next interval
    const nextInterval = await this.calculateNextInterval(item, performance)
    
    // Update retention metrics
    const newRetentionScore = this.calculateRetentionScore(item, performance)
    
    // Update mastery level
    const newMasteryLevel = this.updateMasteryLevel(item, performance)
    
    // Create updated revision item
    const updatedItem: RevisionItem = {
      ...item,
      easeFactor: newEaseFactor,
      interval: nextInterval,
      repetition: item.repetition + 1,
      nextRevisionDate: new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000),
      lastRevisionDate: new Date(),
      retentionScore: newRetentionScore,
      recallAccuracy: this.updateRecallAccuracy(item.recallAccuracy, performance),
      timeToRecall: performance.timeSpent,
      strugglingCount: performance.selfRating === 'Again' || performance.selfRating === 'Hard' 
        ? item.strugglingCount + 1 : item.strugglingCount,
      masteryLevel: newMasteryLevel,
      updatedAt: new Date()
    }
    
    console.log(`📈 Updated item: next revision in ${nextInterval} days, mastery: ${newMasteryLevel}`)
    
    return updatedItem
  }

  // Private helper methods
  private getBaseInterval(item: RevisionItem, performance: UserResponse): number {
    let intervals: number[]
    
    // Select interval array based on difficulty
    switch (item.difficulty) {
      case 'easy':
        intervals = this.config.easyIntervals
        break
      case 'medium':
        intervals = this.config.mediumIntervals
        break
      case 'hard':
        intervals = this.config.hardIntervals
        break
      default:
        intervals = this.config.mediumIntervals
    }
    
    // Get interval based on repetition count
    const repetitionIndex = Math.min(item.repetition, intervals.length - 1)
    let baseInterval = intervals[repetitionIndex]
    
    // Adjust based on performance
    switch (performance.selfRating) {
      case 'Easy':
        baseInterval *= 1.4
        break
      case 'Good':
        baseInterval *= 1.0
        break
      case 'Hard':
        baseInterval *= 0.6
        break
      case 'Again':
        baseInterval = 1 // Reset to first interval
        break
    }
    
    return Math.round(baseInterval)
  }

  private applySM2Algorithm(item: RevisionItem, performance: UserResponse, baseInterval: number): number {
    // Standard SM-2 algorithm with UPSC modifications
    
    if (performance.selfRating === 'Again') {
      return 1 // Reset interval for failed recall
    }
    
    // Apply ease factor
    let adjustedInterval = baseInterval * item.easeFactor
    
    // Apply performance modifiers
    const confidenceModifier = 1 + (performance.confidence - 3) * 0.1
    const speedModifier = performance.timeSpent < 15 ? 1.2 : 
                         performance.timeSpent > 45 ? 0.8 : 1.0
    
    adjustedInterval *= confidenceModifier * speedModifier
    
    return Math.round(adjustedInterval)
  }

  private applyUPSCOptimizations(item: RevisionItem, interval: number): number {
    // UPSC-specific optimizations
    
    // Prioritize high-importance topics
    const importanceMultiplier = item.importance === 'Critical' ? 0.7 :
                                item.importance === 'High' ? 0.8 :
                                item.importance === 'Medium' ? 1.0 : 1.2
    
    // Subject-specific adjustments
    const subjectMultiplier = this.getSubjectMultiplier(item.subject)
    
    // Current affairs need more frequent revision
    const contentMultiplier = item.contentType === 'CurrentAffairs' ? 0.5 : 1.0
    
    return Math.round(interval * importanceMultiplier * subjectMultiplier * contentMultiplier)
  }

  private calculateOptimalFrequency(item: RevisionItem, daysUntilExam: number): number {
    // Calculate how many times we should revise before exam
    const targetRevisions = item.importance === 'Critical' ? 6 :
                           item.importance === 'High' ? 4 :
                           item.importance === 'Medium' ? 3 : 2
    
    const currentRevisions = item.repetition
    const remainingRevisions = Math.max(0, targetRevisions - currentRevisions)
    
    if (remainingRevisions === 0) {
      return Math.max(7, daysUntilExam / 2) // Maintenance mode
    }
    
    return Math.max(1, Math.floor(daysUntilExam / remainingRevisions))
  }

  private applyForgettingCurve(item: RevisionItem, daysUntilExam: number): number {
    // Ebbinghaus forgetting curve: R = e^(-t/S)
    // Where R = retention, t = time, S = strength of memory
    
    const memoryStrength = this.calculateMemoryStrength(item)
    const targetRetention = 0.85 // 85% retention at exam time
    
    // Calculate time when retention drops below target
    const criticalTime = -memoryStrength * Math.log(targetRetention)
    
    // Convert to days and adjust for exam proximity
    const optimalInterval = Math.min(criticalTime, daysUntilExam / 3)
    
    return Math.max(1, Math.round(optimalInterval))
  }

  private calculateMemoryStrength(item: RevisionItem): number {
    // Memory strength based on multiple factors
    const baseStrength = 5 // Days
    
    const repetitionBonus = item.repetition * 1.5
    const masteryBonus = item.masteryLevel === 'Mastered' ? 5 :
                        item.masteryLevel === 'Reviewing' ? 2 : 0
    const accuracyBonus = (item.recallAccuracy / 100) * 3
    const easeBonus = (item.easeFactor - 1.3) * 2
    
    return baseStrength + repetitionBonus + masteryBonus + accuracyBonus + easeBonus
  }

  private getImportanceWeight(item: RevisionItem): number {
    const baseWeight = item.importance === 'Critical' ? 3 :
                      item.importance === 'High' ? 5 :
                      item.importance === 'Medium' ? 7 : 10
    
    // Adjust for subject importance in UPSC
    const subjectWeight = this.getSubjectWeight(item.subject)
    
    return baseWeight * subjectWeight
  }

  private getSubjectMultiplier(subject: SubjectArea): number {
    // Subject-specific interval multipliers for UPSC
    const multipliers: Record<SubjectArea, number> = {
      'Polity': 0.9, // Frequent revision needed
      'Current Affairs': 0.5, // Very frequent
      'History': 1.1, // Once learned, retains well
      'Geography': 1.0, // Standard
      'Economy': 0.8, // Concepts need reinforcement
      'Environment': 1.0, // Standard
      'Science & Technology': 0.9, // Updates frequently
      'Social Issues': 1.0, // Standard
      'Art & Culture': 1.2, // Good retention once learned
      'Ethics': 0.9 // Examples need frequent revision
    }
    
    return multipliers[subject] || 1.0
  }

  private getSubjectWeight(subject: SubjectArea): number {
    // Weight based on UPSC exam importance
    const weights: Record<SubjectArea, number> = {
      'Polity': 0.8, // High importance
      'Current Affairs': 0.7, // Very high importance
      'History': 0.9, // Moderate importance
      'Geography': 0.9, // Moderate importance
      'Economy': 0.8, // High importance
      'Environment': 1.0, // Standard importance
      'Science & Technology': 1.1, // Lower importance
      'Social Issues': 1.0, // Standard importance
      'Art & Culture': 1.2, // Lower importance
      'Ethics': 0.9 // Moderate importance
    }
    
    return weights[subject] || 1.0
  }

  private async getDueItems(userId: string, date: Date): Promise<RevisionItem[]> {
    // Mock implementation - in production, fetch from database
    const mockItems: RevisionItem[] = [
      {
        id: '1',
        userId,
        contentId: 'const-basics-1',
        contentType: 'Concept',
        subject: 'Polity',
        topic: 'Constitutional Basics',
        content: {
          title: 'Fundamental Rights',
          keyPoints: ['Right to Equality', 'Right to Freedom', 'Right against Exploitation'],
          factoids: ['Article 14-18 deal with Right to Equality'],
          dates: ['1950 - Constitution came into effect']
        },
        difficulty: 'medium',
        importance: 'Critical',
        interval: 3,
        repetition: 2,
        easeFactor: 2.5,
        nextRevisionDate: date,
        lastRevisionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        retentionScore: 85,
        recallAccuracy: 80,
        timeToRecall: 25,
        strugglingCount: 0,
        masteryLevel: 'Reviewing',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['constitution', 'rights'],
        source: 'lesson'
      }
    ]
    
    return mockItems.filter(item => item.nextRevisionDate <= date)
  }

  private intelligentBatching(items: RevisionItem[], date: Date): RevisionItem[] {
    // Group items by subject and difficulty for optimal learning
    const batch = [...items]
    
    // Apply interleaving: mix subjects and difficulties
    batch.sort((a, b) => {
      // Primary sort: priority (importance)
      const priorityDiff = this.getPriorityValue(a.importance) - this.getPriorityValue(b.importance)
      if (priorityDiff !== 0) return priorityDiff
      
      // Secondary sort: subject rotation
      if (a.subject !== b.subject) return a.subject.localeCompare(b.subject)
      
      // Tertiary sort: difficulty mixing
      return this.getDifficultyValue(a.difficulty) - this.getDifficultyValue(b.difficulty)
    })
    
    return batch
  }

  private sortByPriority(items: RevisionItem[]): RevisionItem[] {
    return items.sort((a, b) => {
      // Sort by urgency (overdue items first)
      const now = new Date()
      const aOverdue = Math.max(0, Math.floor((now.getTime() - a.nextRevisionDate.getTime()) / (1000 * 60 * 60 * 24)))
      const bOverdue = Math.max(0, Math.floor((now.getTime() - b.nextRevisionDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      if (aOverdue !== bOverdue) return bOverdue - aOverdue
      
      // Then by importance
      const priorityDiff = this.getPriorityValue(a.importance) - this.getPriorityValue(b.importance)
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by struggling items
      if (a.strugglingCount !== b.strugglingCount) return b.strugglingCount - a.strugglingCount
      
      // Finally by last revision date (oldest first)
      return a.lastRevisionDate.getTime() - b.lastRevisionDate.getTime()
    })
  }

  private getPriorityValue(importance: string): number {
    const values = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 }
    return values[importance as keyof typeof values] || 3
  }

  private getDifficultyValue(difficulty: DifficultyLevel): number {
    const values = { 'easy': 1, 'medium': 2, 'hard': 3 }
    return values[difficulty] || 2
  }

  private calculateRetentionScore(item: RevisionItem, performance: UserResponse): number {
    const currentScore = item.retentionScore
    
    // Calculate new retention based on performance
    let performanceScore = 0
    switch (performance.selfRating) {
      case 'Easy': performanceScore = 95; break
      case 'Good': performanceScore = 80; break
      case 'Hard': performanceScore = 60; break
      case 'Again': performanceScore = 30; break
    }
    
    // Apply confidence and speed modifiers
    const confidenceModifier = (performance.confidence / 5) * 20
    const speedModifier = performance.timeSpent < 20 ? 10 : 
                         performance.timeSpent > 60 ? -10 : 0
    
    const adjustedScore = performanceScore + confidenceModifier + speedModifier
    
    // Weighted average with previous score
    return Math.round((currentScore * 0.3 + adjustedScore * 0.7))
  }

  private updateRecallAccuracy(currentAccuracy: number, performance: UserResponse): number {
    let newAccuracy = performance.selfRating === 'Easy' || performance.selfRating === 'Good' ? 100 :
                     performance.selfRating === 'Hard' ? 70 : 40
    
    // Apply confidence modifier
    newAccuracy += (performance.confidence - 3) * 10
    
    // Weighted average with current accuracy
    return Math.round((currentAccuracy * 0.7 + newAccuracy * 0.3))
  }

  private updateMasteryLevel(item: RevisionItem, performance: UserResponse): 'Learning' | 'Reviewing' | 'Mastered' | 'Overlearned' {
    const { masteryLevel, repetition, retentionScore, strugglingCount } = item
    
    // Criteria for mastery progression
    if (performance.selfRating === 'Again' || performance.selfRating === 'Hard') {
      return masteryLevel === 'Mastered' ? 'Reviewing' : 'Learning'
    }
    
    if (repetition >= 5 && retentionScore >= 90 && strugglingCount === 0) {
      return 'Overlearned'
    }
    
    if (repetition >= 3 && retentionScore >= 80 && strugglingCount <= 1) {
      return 'Mastered'
    }
    
    if (repetition >= 2 && retentionScore >= 70) {
      return 'Reviewing'
    }
    
    return 'Learning'
  }
}