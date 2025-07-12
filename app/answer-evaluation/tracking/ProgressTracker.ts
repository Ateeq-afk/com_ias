import { 
  ProgressTracking, 
  AnswerAttempt, 
  PersonalizedPlan, 
  PlanMilestone,
  EvaluationScore,
  Question,
  Resource
} from '../types'

export class ProgressTracker {
  private readonly MINIMUM_ATTEMPTS = 3
  private readonly IMPROVEMENT_THRESHOLD = 5 // points
  private readonly WEAKNESS_THRESHOLD = 60 // percentage

  async trackProgress(userId: string): Promise<ProgressTracking> {
    const attempts = await this.getUserAttempts(userId)
    const overallTrend = this.calculateTrend(attempts)
    const strengthAreas = this.identifyStrengths(attempts)
    const weaknessAreas = this.identifyWeaknesses(attempts)
    const personalizedPlan = this.generatePersonalizedPlan(userId, attempts, weaknessAreas)

    return {
      userId,
      attempts,
      overallTrend,
      strengthAreas,
      weaknessAreas,
      personalizedPlan
    }
  }

  async updateProgress(userId: string, newAttempt: AnswerAttempt): Promise<ProgressTracking> {
    // Store the new attempt
    await this.storeAttempt(userId, newAttempt)
    
    // Recalculate progress
    return this.trackProgress(userId)
  }

  private calculateTrend(attempts: AnswerAttempt[]): 'improving' | 'stable' | 'declining' {
    if (attempts.length < this.MINIMUM_ATTEMPTS) {
      return 'stable' // Not enough data
    }

    const recentAttempts = attempts.slice(-5) // Last 5 attempts
    const scores = recentAttempts.map(attempt => attempt.score)
    
    // Calculate trend using linear regression slope
    const trend = this.calculateLinearTrend(scores)
    
    if (trend > this.IMPROVEMENT_THRESHOLD) return 'improving'
    if (trend < -this.IMPROVEMENT_THRESHOLD) return 'declining'
    return 'stable'
  }

  private calculateLinearTrend(scores: number[]): number {
    const n = scores.length
    const x = Array.from({length: n}, (_, i) => i + 1)
    const y = scores

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    // Calculate slope (trend)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    return slope
  }

  private identifyStrengths(attempts: AnswerAttempt[]): string[] {
    const categoryScores = this.aggregateCategoryScores(attempts)
    const strengths: string[] = []

    Object.entries(categoryScores).forEach(([category, avgScore]) => {
      if (avgScore >= 80) { // Strong performance threshold
        strengths.push(this.getCategoryDisplayName(category))
      }
    })

    return strengths
  }

  private identifyWeaknesses(attempts: AnswerAttempt[]): string[] {
    const categoryScores = this.aggregateCategoryScores(attempts)
    const weaknesses: string[] = []

    Object.entries(categoryScores).forEach(([category, avgScore]) => {
      if (avgScore < this.WEAKNESS_THRESHOLD) {
        weaknesses.push(this.getCategoryDisplayName(category))
      }
    })

    return weaknesses
  }

  private aggregateCategoryScores(attempts: AnswerAttempt[]): Record<string, number> {
    const categories = {
      'contentRelevance': [] as number[],
      'structurePresentation': [] as number[],
      'analyticalDepth': [] as number[],
      'innovation': [] as number[],
      'language': [] as number[],
      'wordLimit': [] as number[]
    }

    attempts.forEach(attempt => {
      if (attempt.feedback.overall) {
        // Extract scores from feedback structure
        categories.contentRelevance.push(attempt.score * 0.25) // Approximate breakdown
        categories.structurePresentation.push(attempt.score * 0.20)
        categories.analyticalDepth.push(attempt.score * 0.20)
        categories.innovation.push(attempt.score * 0.15)
        categories.language.push(attempt.score * 0.10)
        categories.wordLimit.push(attempt.score * 0.10)
      }
    })

    const averages: Record<string, number> = {}
    Object.entries(categories).forEach(([category, scores]) => {
      averages[category] = scores.length > 0 ? 
        scores.reduce((a, b) => a + b, 0) / scores.length : 0
    })

    return averages
  }

  private getCategoryDisplayName(category: string): string {
    const displayNames = {
      'contentRelevance': 'Content Knowledge',
      'structurePresentation': 'Answer Structure',
      'analyticalDepth': 'Analytical Thinking',
      'innovation': 'Innovation & Examples',
      'language': 'Language & Expression',
      'wordLimit': 'Word Limit Management'
    }
    return displayNames[category] || category
  }

  private generatePersonalizedPlan(userId: string, attempts: AnswerAttempt[], weaknesses: string[]): PersonalizedPlan {
    const focusAreas = this.determineFocusAreas(weaknesses, attempts)
    const practiceQuestions = this.recommendPracticeQuestions(weaknesses, attempts)
    const studyResources = this.recommendStudyResources(weaknesses)
    const targetScores = this.setTargetScores(attempts, weaknesses)
    const timeline = this.createTimeline(weaknesses, attempts)

    return {
      focusAreas,
      practiceQuestions,
      studyResources,
      targetScores,
      timeline
    }
  }

  private determineFocusAreas(weaknesses: string[], attempts: AnswerAttempt[]): string[] {
    const focusAreas: string[] = []

    // Primary focus on biggest weaknesses
    if (weaknesses.includes('Content Knowledge')) {
      focusAreas.push('Strengthen subject-matter expertise')
    }
    if (weaknesses.includes('Answer Structure')) {
      focusAreas.push('Master introduction-body-conclusion format')
    }
    if (weaknesses.includes('Analytical Thinking')) {
      focusAreas.push('Develop multi-dimensional analysis skills')
    }
    if (weaknesses.includes('Language & Expression')) {
      focusAreas.push('Improve clarity and conciseness')
    }

    // Secondary focus areas based on performance patterns
    const recentScores = attempts.slice(-5).map(a => a.score)
    const avgRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length

    if (avgRecentScore < 50) {
      focusAreas.push('Build foundational knowledge')
    } else if (avgRecentScore < 70) {
      focusAreas.push('Enhance answer quality and depth')
    } else {
      focusAreas.push('Perfect advanced techniques and examples')
    }

    return focusAreas.slice(0, 4) // Limit to top 4 focus areas
  }

  private recommendPracticeQuestions(weaknesses: string[], attempts: AnswerAttempt[]): string[] {
    const questions: string[] = []

    // Subject-based recommendations
    const subjectPerformance = this.analyzeSubjectPerformance(attempts)
    const weakSubjects = Object.entries(subjectPerformance)
      .filter(([_, score]) => score < 65)
      .map(([subject, _]) => subject)

    weakSubjects.forEach(subject => {
      questions.push(`Practice 10 ${subject} questions focusing on ${weaknesses[0] || 'structure'}`)
    })

    // Question type recommendations
    if (weaknesses.includes('Analytical Thinking')) {
      questions.push('Practice case study questions requiring multi-perspective analysis')
      questions.push('Solve compare-and-contrast type questions')
    }

    if (weaknesses.includes('Content Knowledge')) {
      questions.push('Focus on factual recall questions with current affairs integration')
      questions.push('Practice questions requiring specific examples and data')
    }

    return questions.slice(0, 5)
  }

  private recommendStudyResources(weaknesses: string[]): Resource[] {
    const resources: Resource[] = []

    weaknesses.forEach(weakness => {
      switch (weakness) {
        case 'Content Knowledge':
          resources.push({
            type: 'lesson',
            title: 'Subject-wise Comprehensive Notes',
            url: '/lessons/comprehensive-notes',
            estimatedTime: 120
          })
          resources.push({
            type: 'reading',
            title: 'Current Affairs Monthly Compilation',
            url: '/resources/current-affairs',
            estimatedTime: 90
          })
          break

        case 'Answer Structure':
          resources.push({
            type: 'video',
            title: 'UPSC Answer Writing Masterclass',
            url: '/videos/answer-writing',
            estimatedTime: 45
          })
          resources.push({
            type: 'practice',
            title: 'Structure Practice Templates',
            url: '/practice/structure-templates',
            estimatedTime: 30
          })
          break

        case 'Analytical Thinking':
          resources.push({
            type: 'lesson',
            title: 'Critical Thinking and Analysis',
            url: '/lessons/critical-thinking',
            estimatedTime: 60
          })
          resources.push({
            type: 'practice',
            title: 'Case Study Analysis Practice',
            url: '/practice/case-studies',
            estimatedTime: 90
          })
          break

        case 'Language & Expression':
          resources.push({
            type: 'lesson',
            title: 'English Language Enhancement',
            url: '/lessons/language-skills',
            estimatedTime: 45
          })
          resources.push({
            type: 'practice',
            title: 'Grammar and Style Exercises',
            url: '/practice/language',
            estimatedTime: 30
          })
          break
      }
    })

    return resources.slice(0, 6) // Limit to 6 resources
  }

  private setTargetScores(attempts: AnswerAttempt[], weaknesses: string[]): Record<string, number> {
    const currentAvg = attempts.length > 0 ? 
      attempts.slice(-5).reduce((sum, attempt) => sum + attempt.score, 0) / Math.min(5, attempts.length) : 50

    const targetScores: Record<string, number> = {
      'overall': Math.min(currentAvg + 15, 85), // Realistic improvement target
      'contentRelevance': weaknesses.includes('Content Knowledge') ? 75 : Math.min(currentAvg + 10, 90),
      'structurePresentation': weaknesses.includes('Answer Structure') ? 70 : Math.min(currentAvg + 8, 85),
      'analyticalDepth': weaknesses.includes('Analytical Thinking') ? 70 : Math.min(currentAvg + 12, 90),
      'language': weaknesses.includes('Language & Expression') ? 75 : Math.min(currentAvg + 5, 90)
    }

    return targetScores
  }

  private createTimeline(weaknesses: string[], attempts: AnswerAttempt[]): PlanMilestone[] {
    const milestones: PlanMilestone[] = []
    const today = new Date()

    // Week 1-2: Foundation
    milestones.push({
      title: 'Foundation Building',
      description: 'Complete diagnostic assessment and begin structured practice',
      targetDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      completed: false,
      metrics: {
        'dailyPractice': 2,
        'conceptualClarity': 70,
        'structureImprovement': 15
      }
    })

    // Week 3-4: Skill Development
    milestones.push({
      title: 'Skill Enhancement',
      description: 'Focus on identified weak areas with targeted practice',
      targetDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000),
      completed: false,
      metrics: {
        'weaknessReduction': 20,
        'consistentScoring': 75,
        'analyticalDepth': 70
      }
    })

    // Week 5-6: Integration
    milestones.push({
      title: 'Integration & Refinement',
      description: 'Integrate all components and work on advanced techniques',
      targetDate: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000),
      completed: false,
      metrics: {
        'overallScore': 80,
        'consistency': 85,
        'timeManagement': 90
      }
    })

    return milestones
  }

  private analyzeSubjectPerformance(attempts: AnswerAttempt[]): Record<string, number> {
    // Group attempts by subject and calculate average scores
    const subjectScores: Record<string, number[]> = {}
    
    attempts.forEach(attempt => {
      // Extract subject from questionId or use a mapping
      const subject = this.extractSubjectFromAttempt(attempt)
      if (!subjectScores[subject]) {
        subjectScores[subject] = []
      }
      subjectScores[subject].push(attempt.score)
    })

    const subjectAverages: Record<string, number> = {}
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      subjectAverages[subject] = scores.reduce((a, b) => a + b, 0) / scores.length
    })

    return subjectAverages
  }

  private extractSubjectFromAttempt(attempt: AnswerAttempt): string {
    // This would extract subject from questionId in a real implementation
    // For now, return a default or parse from questionId
    if (attempt.questionId.includes('gs1')) return 'GS1'
    if (attempt.questionId.includes('gs2')) return 'GS2'
    if (attempt.questionId.includes('gs3')) return 'GS3'
    if (attempt.questionId.includes('gs4')) return 'GS4'
    return 'General'
  }

  // Database interaction methods (mocked)
  private async getUserAttempts(userId: string): Promise<AnswerAttempt[]> {
    // This would fetch from database in real implementation
    // For now, return mock data
    return [
      {
        attemptId: '1',
        questionId: 'gs2-polity-1',
        score: 65,
        submittedAt: new Date('2024-01-01'),
        timeSpent: 1800,
        wordCount: 240,
        feedback: {
          overall: {
            strengths: ['Good structure'],
            weaknesses: ['Lacks examples'],
            grade: 'B',
            percentile: 65,
            predictedExamScore: 130
          },
          specific: [],
          suggestions: [],
          modelComparison: {
            modelAnswer: '',
            similarities: [],
            differences: [],
            scoreDifference: 15,
            improvementAreas: []
          }
        }
      }
    ]
  }

  private async storeAttempt(userId: string, attempt: AnswerAttempt): Promise<void> {
    // This would store in database in real implementation
    console.log(`Storing attempt for user ${userId}:`, attempt.attemptId)
  }

  // Public methods for getting specific insights
  getPerformanceTrends(attempts: AnswerAttempt[], days: number = 30): {
    scoresTrend: number[],
    timeTrend: number[],
    consistencyTrend: number[]
  } {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    
    const recentAttempts = attempts.filter(attempt => attempt.submittedAt >= cutoff)
    
    return {
      scoresTrend: recentAttempts.map(a => a.score),
      timeTrend: recentAttempts.map(a => a.timeSpent),
      consistencyTrend: this.calculateConsistencyTrend(recentAttempts)
    }
  }

  private calculateConsistencyTrend(attempts: AnswerAttempt[]): number[] {
    const windowSize = 3
    const consistency: number[] = []
    
    for (let i = windowSize - 1; i < attempts.length; i++) {
      const window = attempts.slice(i - windowSize + 1, i + 1)
      const scores = window.map(a => a.score)
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length
      const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length
      const consistencyScore = Math.max(0, 100 - Math.sqrt(variance))
      consistency.push(consistencyScore)
    }
    
    return consistency
  }

  getPredictedExamScore(attempts: AnswerAttempt[]): {
    predictedScore: number,
    confidence: number,
    breakdown: Record<string, number>
  } {
    if (attempts.length < 5) {
      return {
        predictedScore: 100,
        confidence: 30,
        breakdown: { insufficient_data: 100 }
      }
    }

    const recentScores = attempts.slice(-10).map(a => a.score)
    const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    const variance = recentScores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / recentScores.length
    
    // Predict exam score (scale up from 100 to 200)
    const predictedScore = Math.round(avgScore * 2)
    
    // Confidence based on consistency
    const confidence = Math.min(90, Math.max(50, 100 - Math.sqrt(variance)))
    
    const breakdown = {
      gs1: Math.round(predictedScore * 0.25),
      gs2: Math.round(predictedScore * 0.25),
      gs3: Math.round(predictedScore * 0.25),
      gs4: Math.round(predictedScore * 0.25)
    }

    return { predictedScore, confidence, breakdown }
  }
}