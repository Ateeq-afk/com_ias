import {
  RetentionAnalyzer,
  RetentionAnalytics,
  ForgettingPoint,
  RetentionPrediction,
  RetentionReport,
  RevisionItem,
  ForgettingFactor,
  RetentionPoint
} from '../types'
import { SubjectArea } from '../../question-generator/types'

interface MemoryModel {
  baseRetention: number // Initial retention percentage
  decayRate: number // How fast memory decays
  strengthFactor: number // Memory strength multiplier
  interferenceLevel: number // Interference from other memories
  consolidationScore: number // How well consolidated the memory is
}

interface ForgetfulnessProfile {
  userId: string
  personalDecayRate: number
  subjectAffinities: Record<SubjectArea, number>
  timeOfDayEffects: Record<string, number>
  stressImpact: number
  sleepQualityImpact: number
  interestLevels: Record<string, number>
}

interface RetentionExperiment {
  itemId: string
  testDates: Date[]
  retentionScores: number[]
  predictedScores: number[]
  accuracy: number
  learningRate: number
}

export class UPSCRetentionAnalyzer implements RetentionAnalyzer {
  
  private retentionData: Map<string, RetentionExperiment[]> = new Map()
  private userProfiles: Map<string, ForgetfulnessProfile> = new Map()
  private memoryModels: Map<string, MemoryModel> = new Map()

  constructor() {
    console.log('📊 UPSC Retention Analyzer initialized')
    this.initializeDefaultProfiles()
  }

  async analyzeRetentionPattern(userId: string, subject?: SubjectArea): Promise<RetentionAnalytics> {
    console.log(`🔍 Analyzing retention patterns for user ${userId}${subject ? ` in ${subject}` : ''}`)
    
    const experiments = this.getRetentionExperiments(userId, subject)
    const profile = await this.getUserProfile(userId)
    
    const retentionCurve = this.calculateRetentionCurve(experiments)
    const forgettingCurve = this.calculateForgettingCurve(experiments, profile)
    const optimalTimes = this.calculateOptimalRevisionTimes(experiments, profile)
    const memoryStrength = this.calculateMemoryStrength(experiments)
    const longTermRetention = this.calculateLongTermRetention(experiments)
    const examReadiness = this.calculateExamReadiness(experiments, new Date('2025-06-05'))
    const predictions = await this.generateRetentionPredictions(experiments, profile)
    
    const analytics: RetentionAnalytics = {
      userId,
      subject: subject || 'All',
      topic: subject ? `${subject} Topics` : 'All Topics',
      retentionCurve,
      forgettingCurve,
      optimalRevisionTimes,
      memoryStrength,
      longTermRetention,
      examReadiness,
      predictions
    }
    
    console.log(`✅ Retention analysis complete: ${memoryStrength}% memory strength, ${examReadiness}% exam readiness`)
    return analytics
  }

  async predictForgettingCurve(item: RevisionItem): Promise<ForgettingPoint[]> {
    console.log(`📉 Predicting forgetting curve for: ${item.topic}`)
    
    const profile = await this.getUserProfile(item.userId)
    const memoryModel = this.getMemoryModel(item)
    
    const forgettingPoints: ForgettingPoint[] = []
    const timePoints = [1, 6, 24, 72, 168, 336, 720] // Hours: 1h, 6h, 1d, 3d, 1w, 2w, 1m
    
    for (const hours of timePoints) {
      const estimatedRetention = this.calculateRetentionAtTime(memoryModel, hours, profile)
      const factors = this.identifyForgettingFactors(item, hours, profile)
      
      forgettingPoints.push({
        hoursAfterLearning: hours,
        estimatedRetention: Math.round(estimatedRetention),
        factors
      })
    }
    
    console.log(`📈 Generated forgetting curve with ${forgettingPoints.length} prediction points`)
    return forgettingPoints
  }

  async recommendRevisionTiming(userId: string, itemIds: string[]): Promise<Date[]> {
    console.log(`⏰ Recommending revision timing for ${itemIds.length} items`)
    
    const profile = await this.getUserProfile(userId)
    const recommendations: Date[] = []
    
    for (const itemId of itemIds) {
      const experiments = this.getItemExperiments(userId, itemId)
      const optimalHours = this.calculateOptimalRevisionHours(experiments, profile)
      
      const recommendedDate = new Date()
      recommendedDate.setHours(recommendedDate.getHours() + optimalHours)
      recommendations.push(recommendedDate)
    }
    
    console.log(`📅 Generated ${recommendations.length} revision timing recommendations`)
    return recommendations
  }

  async calculateMemoryStrength(userId: string, topic: string): Promise<number> {
    console.log(`💪 Calculating memory strength for: ${topic}`)
    
    const experiments = this.getTopicExperiments(userId, topic)
    const profile = await this.getUserProfile(userId)
    
    if (experiments.length === 0) {
      return 50 // Default moderate strength
    }
    
    // Calculate based on recent retention performance
    const recentRetention = experiments
      .slice(-5) // Last 5 experiments
      .reduce((sum, exp) => sum + exp.retentionScores[exp.retentionScores.length - 1], 0) / Math.min(5, experiments.length)
    
    // Adjust for personal factors
    const subjectAffinity = profile.subjectAffinities['Polity'] || 1.0 // Default subject
    const personalFactor = (2.0 - profile.personalDecayRate) * 50 // Convert decay rate to strength
    
    const memoryStrength = Math.round(
      (recentRetention * 0.6 + personalFactor * 0.3 + subjectAffinity * 50 * 0.1)
    )
    
    console.log(`🧠 Memory strength calculated: ${memoryStrength}%`)
    return Math.max(0, Math.min(100, memoryStrength))
  }

  async generateRetentionReport(userId: string): Promise<RetentionReport> {
    console.log(`📋 Generating comprehensive retention report for user ${userId}`)
    
    const allExperiments = this.retentionData.get(userId) || []
    const profile = await this.getUserProfile(userId)
    
    const overallRetention = this.calculateOverallRetention(allExperiments)
    const subjectRetention = this.calculateSubjectRetention(allExperiments)
    const strengths = this.identifyStrengths(allExperiments, profile)
    const weaknesses = this.identifyWeaknesses(allExperiments, profile)
    const recommendations = this.generateRecommendations(allExperiments, profile)
    const examReadiness = this.calculateExamReadiness(allExperiments, new Date('2025-06-05'))
    const priorityRevisions = this.identifyPriorityRevisions(allExperiments)
    
    const report: RetentionReport = {
      userId,
      generatedAt: new Date(),
      overallRetention,
      subjectRetention,
      strengths,
      weaknesses,
      recommendations,
      examReadiness,
      priorityRevisions
    }
    
    console.log(`✅ Retention report generated: ${overallRetention}% overall retention`)
    return report
  }

  // Advanced analytics methods
  async analyzeSpacingEffect(userId: string): Promise<any> {
    console.log(`📊 Analyzing spacing effect for user ${userId}`)
    
    const experiments = this.retentionData.get(userId) || []
    const spacingAnalysis = {
      optimalSpacing: this.calculateOptimalSpacing(experiments),
      spacingEfficiency: this.calculateSpacingEfficiency(experiments),
      massedVsSpaced: this.compareMassedVsSpaced(experiments),
      recommendations: this.generateSpacingRecommendations(experiments)
    }
    
    return spacingAnalysis
  }

  async analyzeInterferencePatterns(userId: string): Promise<any> {
    console.log(`🔀 Analyzing interference patterns for user ${userId}`)
    
    const experiments = this.retentionData.get(userId) || []
    const profile = await this.getUserProfile(userId)
    
    return {
      proactiveInterference: this.calculateProactiveInterference(experiments),
      retroactiveInterference: this.calculateRetroactiveInterference(experiments),
      similarityInterference: this.calculateSimilarityInterference(experiments),
      mitigationStrategies: this.generateInterferenceMitigation(experiments, profile)
    }
  }

  async predictExamPerformance(userId: string, examDate: Date): Promise<any> {
    console.log(`🎯 Predicting exam performance for ${examDate.toDateString()}`)
    
    const experiments = this.retentionData.get(userId) || []
    const profile = await this.getUserProfile(userId)
    
    const daysUntilExam = Math.floor((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    return {
      predictedScore: this.calculatePredictedExamScore(experiments, daysUntilExam),
      confidenceInterval: this.calculateConfidenceInterval(experiments),
      keyRisks: this.identifyExamRisks(experiments, daysUntilExam),
      improvementPotential: this.calculateImprovementPotential(experiments, profile),
      recommendedActions: this.generateExamPreparationPlan(experiments, daysUntilExam)
    }
  }

  // Private helper methods
  private initializeDefaultProfiles(): void {
    // Initialize with some default user profiles for testing
    const defaultProfile: ForgetfulnessProfile = {
      userId: 'default',
      personalDecayRate: 1.2,
      subjectAffinities: {
        'Polity': 1.1,
        'History': 0.9,
        'Geography': 1.0,
        'Economy': 0.8,
        'Environment': 1.0,
        'Science & Technology': 0.9,
        'Current Affairs': 0.7,
        'Social Issues': 1.0,
        'Art & Culture': 1.1,
        'Ethics': 1.0
      },
      timeOfDayEffects: {
        'morning': 1.2,
        'afternoon': 0.9,
        'evening': 1.1,
        'night': 0.7
      },
      stressImpact: 0.8,
      sleepQualityImpact: 1.3,
      interestLevels: {
        'high': 1.4,
        'medium': 1.0,
        'low': 0.6
      }
    }
    
    this.userProfiles.set('default', defaultProfile)
  }

  private getRetentionExperiments(userId: string, subject?: SubjectArea): RetentionExperiment[] {
    const allExperiments = this.retentionData.get(userId) || []
    
    if (!subject) {
      return allExperiments
    }
    
    // Filter by subject (simplified - in practice would use proper item metadata)
    return allExperiments.filter(exp => exp.itemId.includes(subject.toLowerCase()))
  }

  private async getUserProfile(userId: string): Promise<ForgetfulnessProfile> {
    if (!this.userProfiles.has(userId)) {
      // Create profile based on user's learning history
      const profile = await this.createUserProfile(userId)
      this.userProfiles.set(userId, profile)
    }
    
    return this.userProfiles.get(userId)!
  }

  private async createUserProfile(userId: string): Promise<ForgetfulnessProfile> {
    // Analyze user's past performance to create personalized profile
    const experiments = this.retentionData.get(userId) || []
    
    const personalDecayRate = this.calculatePersonalDecayRate(experiments)
    const subjectAffinities = this.calculateSubjectAffinities(experiments)
    
    return {
      userId,
      personalDecayRate,
      subjectAffinities,
      timeOfDayEffects: {
        'morning': 1.2,
        'afternoon': 0.9,
        'evening': 1.1,
        'night': 0.7
      },
      stressImpact: 0.8,
      sleepQualityImpact: 1.3,
      interestLevels: {
        'high': 1.4,
        'medium': 1.0,
        'low': 0.6
      }
    }
  }

  private getMemoryModel(item: RevisionItem): MemoryModel {
    const modelKey = `${item.subject}-${item.difficulty}`
    
    if (!this.memoryModels.has(modelKey)) {
      this.memoryModels.set(modelKey, this.createMemoryModel(item))
    }
    
    return this.memoryModels.get(modelKey)!
  }

  private createMemoryModel(item: RevisionItem): MemoryModel {
    // Create memory model based on item characteristics
    const baseRetention = item.difficulty === 'easy' ? 95 : 
                         item.difficulty === 'medium' ? 85 : 75
    
    const decayRate = item.difficulty === 'easy' ? 0.3 : 
                     item.difficulty === 'medium' ? 0.5 : 0.7
    
    const strengthFactor = item.repetition * 0.2 + item.easeFactor
    const interferenceLevel = item.contentType === 'CurrentAffairs' ? 0.8 : 0.5
    const consolidationScore = Math.min(100, item.retentionScore + item.repetition * 10)
    
    return {
      baseRetention,
      decayRate,
      strengthFactor,
      interferenceLevel,
      consolidationScore
    }
  }

  private calculateRetentionCurve(experiments: RetentionExperiment[]): RetentionPoint[] {
    const retentionPoints: RetentionPoint[] = []
    
    // Create retention curve from historical data
    const timePoints = [1, 7, 14, 30, 60, 90] // Days
    
    timePoints.forEach(days => {
      const relevantExperiments = experiments.filter(exp => 
        exp.testDates.some(date => {
          const daysDiff = Math.abs((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
          return Math.abs(daysDiff - days) < 2 // Within 2 days
        })
      )
      
      if (relevantExperiments.length > 0) {
        const avgRetention = relevantExperiments.reduce((sum, exp) => 
          sum + exp.retentionScores[exp.retentionScores.length - 1], 0
        ) / relevantExperiments.length
        
        retentionPoints.push({
          date: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
          retentionPercentage: Math.round(avgRetention),
          confidenceLevel: Math.max(50, 100 - Math.sqrt(relevantExperiments.length) * 10),
          testType: 'Historical'
        })
      }
    })
    
    return retentionPoints
  }

  private calculateForgettingCurve(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): ForgettingPoint[] {
    const forgettingPoints: ForgettingPoint[] = []
    const timePoints = [1, 6, 24, 72, 168, 336, 720] // Hours
    
    timePoints.forEach(hours => {
      const estimatedRetention = this.calculateAverageRetentionAtTime(experiments, hours, profile)
      const factors = this.calculateAverageForgettingFactors(experiments, hours, profile)
      
      forgettingPoints.push({
        hoursAfterLearning: hours,
        estimatedRetention: Math.round(estimatedRetention),
        factors
      })
    })
    
    return forgettingPoints
  }

  private calculateRetentionAtTime(model: MemoryModel, hours: number, profile: ForgetfulnessProfile): number {
    // Ebbinghaus forgetting curve with personal modifications
    const t = hours / 24 // Convert to days
    const S = model.strengthFactor * profile.personalDecayRate
    
    // R(t) = e^(-t/S) * adjustments
    let retention = Math.exp(-t / S) * model.baseRetention
    
    // Apply interference
    retention *= (1 - model.interferenceLevel * 0.1)
    
    // Apply consolidation bonus
    retention += (model.consolidationScore / 100) * 10
    
    return Math.max(0, Math.min(100, retention))
  }

  private identifyForgettingFactors(item: RevisionItem, hours: number, profile: ForgetfulnessProfile): ForgettingFactor[] {
    const factors: ForgettingFactor[] = []
    
    // Difficulty impact
    if (item.difficulty === 'hard') {
      factors.push({
        factor: 'Difficulty',
        impact: -15
      })
    }
    
    // Time impact (forgetting curve)
    const timeImpact = -Math.log(hours / 24 + 1) * 20
    factors.push({
      factor: 'Time',
      impact: Math.round(timeImpact)
    })
    
    // Interference from similar content
    if (item.contentType === 'CurrentAffairs') {
      factors.push({
        factor: 'Interference',
        impact: -10
      })
    }
    
    // Interest level impact
    const interestImpact = (profile.interestLevels['medium'] - 1) * 20
    factors.push({
      factor: 'Interest',
      impact: Math.round(interestImpact)
    })
    
    return factors
  }

  private calculateOptimalRevisionTimes(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): Date[] {
    const optimalTimes: Date[] = []
    
    // Calculate when retention drops to 80% for optimal revision
    const targetRetention = 80
    const now = new Date()
    
    // Use spacing intervals based on analysis
    const intervals = [1, 3, 7, 14, 30] // Days
    
    intervals.forEach(days => {
      const revisionDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      optimalTimes.push(revisionDate)
    })
    
    return optimalTimes
  }

  private calculateMemoryStrength(experiments: RetentionExperiment[]): number {
    if (experiments.length === 0) return 50
    
    const recentExperiments = experiments.slice(-10) // Last 10 experiments
    const avgAccuracy = recentExperiments.reduce((sum, exp) => sum + exp.accuracy, 0) / recentExperiments.length
    const avgRetention = recentExperiments.reduce((sum, exp) => 
      sum + exp.retentionScores[exp.retentionScores.length - 1], 0) / recentExperiments.length
    
    return Math.round((avgAccuracy + avgRetention) / 2)
  }

  private calculateLongTermRetention(experiments: RetentionExperiment[]): number {
    const longTermExperiments = experiments.filter(exp => {
      const daysSinceStart = (Date.now() - exp.testDates[0].getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceStart > 30 // More than 30 days old
    })
    
    if (longTermExperiments.length === 0) return 60 // Default
    
    const avgLongTermRetention = longTermExperiments.reduce((sum, exp) => 
      sum + exp.retentionScores[exp.retentionScores.length - 1], 0) / longTermExperiments.length
    
    return Math.round(avgLongTermRetention)
  }

  private calculateExamReadiness(experiments: RetentionExperiment[], examDate: Date): number {
    const daysUntilExam = (examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    
    if (daysUntilExam <= 0) return 0
    
    // Calculate based on current retention and time available
    const currentRetention = this.calculateMemoryStrength(experiments)
    const timePreparationFactor = Math.min(1, daysUntilExam / 90) // 90 days for full preparation
    
    return Math.round(currentRetention * (0.7 + timePreparationFactor * 0.3))
  }

  private async generateRetentionPredictions(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): Promise<RetentionPrediction[]> {
    const predictions: RetentionPrediction[] = []
    const futureDates = [7, 14, 30, 60] // Days into future
    
    futureDates.forEach(days => {
      const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      const predictedRetention = this.predictRetentionAtDate(experiments, date, profile)
      const confidence = this.calculatePredictionConfidence(experiments, days)
      
      predictions.push({
        date,
        predictedRetention: Math.round(predictedRetention),
        confidence: Math.round(confidence),
        recommendedAction: this.getRecommendedAction(predictedRetention),
        reasoning: this.generatePredictionReasoning(predictedRetention, days)
      })
    })
    
    return predictions
  }

  private predictRetentionAtDate(experiments: RetentionExperiment[], date: Date, profile: ForgetfulnessProfile): number {
    const daysFromNow = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    
    // Use average decay rate from experiments
    const avgDecayRate = this.calculateAverageDecayRate(experiments)
    const currentRetention = this.calculateMemoryStrength(experiments)
    
    // Apply forgetting curve
    const predictedRetention = currentRetention * Math.exp(-daysFromNow / (30 / avgDecayRate))
    
    return Math.max(20, predictedRetention) // Minimum 20% retention
  }

  private calculatePredictionConfidence(experiments: RetentionExperiment[], days: number): number {
    const relevantExperiments = experiments.filter(exp => exp.testDates.length >= 2)
    
    if (relevantExperiments.length === 0) return 40 // Low confidence
    
    // Confidence based on data quality and recency
    const dataQuality = Math.min(100, relevantExperiments.length * 10)
    const timeDecay = Math.exp(-days / 60) * 40 + 60 // Confidence decays over time
    
    return Math.round((dataQuality + timeDecay) / 2)
  }

  private getRecommendedAction(predictedRetention: number): 'Revise' | 'Test' | 'Review' | 'Skip' {
    if (predictedRetention < 60) return 'Revise'
    if (predictedRetention < 80) return 'Review'
    if (predictedRetention < 95) return 'Test'
    return 'Skip'
  }

  private generatePredictionReasoning(predictedRetention: number, days: number): string {
    if (predictedRetention < 60) {
      return `Significant retention loss expected after ${days} days due to natural forgetting curve`
    }
    
    if (predictedRetention < 80) {
      return `Moderate retention loss expected, light review recommended`
    }
    
    return `Good retention expected based on current memory strength and spacing`
  }

  // Additional helper methods for comprehensive analysis
  private calculateOverallRetention(experiments: RetentionExperiment[]): number {
    if (experiments.length === 0) return 50
    
    const avgRetention = experiments.reduce((sum, exp) => 
      sum + exp.retentionScores[exp.retentionScores.length - 1], 0) / experiments.length
    
    return Math.round(avgRetention)
  }

  private calculateSubjectRetention(experiments: RetentionExperiment[]): Record<SubjectArea, number> {
    const subjectGroups: Record<string, number[]> = {}
    
    experiments.forEach(exp => {
      const subject = this.extractSubjectFromItemId(exp.itemId)
      if (!subjectGroups[subject]) {
        subjectGroups[subject] = []
      }
      subjectGroups[subject].push(exp.retentionScores[exp.retentionScores.length - 1])
    })
    
    const subjectRetention: Record<SubjectArea, number> = {} as any
    
    Object.entries(subjectGroups).forEach(([subject, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      subjectRetention[subject as SubjectArea] = Math.round(avgScore)
    })
    
    return subjectRetention
  }

  private identifyStrengths(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): string[] {
    const strengths = []
    
    const avgRetention = this.calculateOverallRetention(experiments)
    if (avgRetention > 80) {
      strengths.push('Excellent overall retention performance')
    }
    
    const consistentPerformers = experiments.filter(exp => 
      exp.retentionScores.every(score => score > 75)
    )
    if (consistentPerformers.length > experiments.length * 0.7) {
      strengths.push('Consistent retention across topics')
    }
    
    // Check for strong subjects
    Object.entries(profile.subjectAffinities).forEach(([subject, affinity]) => {
      if (affinity > 1.1) {
        strengths.push(`Strong affinity for ${subject}`)
      }
    })
    
    return strengths
  }

  private identifyWeaknesses(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): string[] {
    const weaknesses = []
    
    const poorPerformers = experiments.filter(exp => 
      exp.retentionScores[exp.retentionScores.length - 1] < 60
    )
    if (poorPerformers.length > experiments.length * 0.3) {
      weaknesses.push('Significant retention challenges in multiple topics')
    }
    
    if (profile.personalDecayRate > 1.5) {
      weaknesses.push('Faster than average memory decay rate')
    }
    
    // Check for weak subjects
    Object.entries(profile.subjectAffinities).forEach(([subject, affinity]) => {
      if (affinity < 0.8) {
        weaknesses.push(`Retention challenges in ${subject}`)
      }
    })
    
    return weaknesses
  }

  private generateRecommendations(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): string[] {
    const recommendations = []
    
    const avgRetention = this.calculateOverallRetention(experiments)
    if (avgRetention < 70) {
      recommendations.push('Increase revision frequency and use active recall techniques')
    }
    
    if (profile.personalDecayRate > 1.3) {
      recommendations.push('Implement shorter spacing intervals due to faster forgetting rate')
    }
    
    const inconsistentItems = experiments.filter(exp => {
      const variance = this.calculateVariance(exp.retentionScores)
      return variance > 400 // High variance in retention
    })
    
    if (inconsistentItems.length > 0) {
      recommendations.push('Focus on consolidating unstable memories through varied practice')
    }
    
    recommendations.push('Optimize study timing based on your peak retention periods')
    recommendations.push('Use spaced repetition with personalized intervals')
    
    return recommendations
  }

  private identifyPriorityRevisions(experiments: RetentionExperiment[]): string[] {
    return experiments
      .filter(exp => exp.retentionScores[exp.retentionScores.length - 1] < 65)
      .sort((a, b) => {
        const aScore = a.retentionScores[a.retentionScores.length - 1]
        const bScore = b.retentionScores[b.retentionScores.length - 1]
        return aScore - bScore
      })
      .slice(0, 10)
      .map(exp => exp.itemId)
  }

  // Helper methods for calculations
  private calculatePersonalDecayRate(experiments: RetentionExperiment[]): number {
    if (experiments.length < 3) return 1.2 // Default
    
    const decayRates = experiments.map(exp => this.calculateExperimentDecayRate(exp))
    return decayRates.reduce((sum, rate) => sum + rate, 0) / decayRates.length
  }

  private calculateExperimentDecayRate(experiment: RetentionExperiment): number {
    if (experiment.retentionScores.length < 2) return 1.2
    
    const initialScore = experiment.retentionScores[0]
    const finalScore = experiment.retentionScores[experiment.retentionScores.length - 1]
    const timeSpan = (experiment.testDates[experiment.testDates.length - 1].getTime() - 
                     experiment.testDates[0].getTime()) / (1000 * 60 * 60 * 24)
    
    if (timeSpan <= 0) return 1.2
    
    // Calculate decay rate based on retention loss over time
    const retentionLoss = initialScore - finalScore
    const decayRate = Math.max(0.5, Math.min(2.0, 1 + (retentionLoss / timeSpan) * 0.1))
    
    return decayRate
  }

  private calculateSubjectAffinities(experiments: RetentionExperiment[]): Record<SubjectArea, number> {
    const subjectPerformance: Record<string, number[]> = {}
    
    experiments.forEach(exp => {
      const subject = this.extractSubjectFromItemId(exp.itemId)
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = []
      }
      subjectPerformance[subject].push(exp.retentionScores[exp.retentionScores.length - 1])
    })
    
    const affinities: Record<SubjectArea, number> = {} as any
    const overallAvg = this.calculateOverallRetention(experiments)
    
    Object.entries(subjectPerformance).forEach(([subject, scores]) => {
      const subjectAvg = scores.reduce((sum, score) => sum + score, 0) / scores.length
      affinities[subject as SubjectArea] = subjectAvg / overallAvg
    })
    
    return affinities
  }

  private extractSubjectFromItemId(itemId: string): string {
    // Simplified extraction - in practice would use proper metadata
    if (itemId.includes('polity')) return 'Polity'
    if (itemId.includes('history')) return 'History'
    if (itemId.includes('geography')) return 'Geography'
    if (itemId.includes('economy')) return 'Economy'
    return 'General'
  }

  private calculateAverageRetentionAtTime(experiments: RetentionExperiment[], hours: number, profile: ForgetfulnessProfile): number {
    if (experiments.length === 0) return 75 // Default
    
    // Simplified calculation based on experiments
    const baseRetention = this.calculateOverallRetention(experiments)
    const timeDecay = Math.exp(-(hours / 24) / (30 / profile.personalDecayRate))
    
    return baseRetention * timeDecay
  }

  private calculateAverageForgettingFactors(experiments: RetentionExperiment[], hours: number, profile: ForgetfulnessProfile): ForgettingFactor[] {
    // Return average forgetting factors based on user profile
    return [
      { factor: 'Time', impact: Math.round(-Math.log(hours / 24 + 1) * 15) },
      { factor: 'Difficulty', impact: -10 },
      { factor: 'Interference', impact: -8 },
      { factor: 'Interest', impact: 5 },
      { factor: 'Sleep', impact: Math.round((profile.sleepQualityImpact - 1) * 20) }
    ]
  }

  private getItemExperiments(userId: string, itemId: string): RetentionExperiment[] {
    const allExperiments = this.retentionData.get(userId) || []
    return allExperiments.filter(exp => exp.itemId === itemId)
  }

  private getTopicExperiments(userId: string, topic: string): RetentionExperiment[] {
    const allExperiments = this.retentionData.get(userId) || []
    return allExperiments.filter(exp => exp.itemId.toLowerCase().includes(topic.toLowerCase()))
  }

  private calculateOptimalRevisionHours(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): number {
    if (experiments.length === 0) return 24 // Default 1 day
    
    // Calculate when retention typically drops to 80%
    const avgDecayRate = this.calculateAverageDecayRate(experiments)
    const optimalHours = 30 / avgDecayRate * 24 // Convert to hours
    
    return Math.max(6, Math.min(168, optimalHours)) // Between 6 hours and 1 week
  }

  private calculateAverageDecayRate(experiments: RetentionExperiment[]): number {
    if (experiments.length === 0) return 1.2
    
    const decayRates = experiments.map(exp => this.calculateExperimentDecayRate(exp))
    return decayRates.reduce((sum, rate) => sum + rate, 0) / decayRates.length
  }

  private calculateVariance(scores: number[]): number {
    if (scores.length === 0) return 0
    
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2))
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length
  }

  // Mock methods for advanced analytics (simplified implementations)
  private calculateOptimalSpacing(experiments: RetentionExperiment[]): number[] {
    // Return optimal spacing intervals in days
    return [1, 3, 7, 14, 30]
  }

  private calculateSpacingEfficiency(experiments: RetentionExperiment[]): number {
    return 85 // Mock efficiency percentage
  }

  private compareMassedVsSpaced(experiments: RetentionExperiment[]): any {
    return {
      massedRetention: 60,
      spacedRetention: 85,
      improvementFactor: 1.42
    }
  }

  private generateSpacingRecommendations(experiments: RetentionExperiment[]): string[] {
    return [
      'Use expanding intervals: 1, 3, 7, 14, 30 days',
      'Avoid massed practice for long-term retention',
      'Adjust intervals based on difficulty and performance'
    ]
  }

  private calculateProactiveInterference(experiments: RetentionExperiment[]): number {
    return 15 // Mock interference percentage
  }

  private calculateRetroactiveInterference(experiments: RetentionExperiment[]): number {
    return 10 // Mock interference percentage
  }

  private calculateSimilarityInterference(experiments: RetentionExperiment[]): number {
    return 20 // Mock interference percentage
  }

  private generateInterferenceMitigation(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): string[] {
    return [
      'Interleave different topics during study sessions',
      'Use distinctive cues for similar concepts',
      'Practice discrimination between confusing items'
    ]
  }

  private calculatePredictedExamScore(experiments: RetentionExperiment[], daysUntilExam: number): number {
    const currentRetention = this.calculateOverallRetention(experiments)
    const timePreparationFactor = Math.min(1, daysUntilExam / 90)
    
    return Math.round(currentRetention * (0.8 + timePreparationFactor * 0.2))
  }

  private calculateConfidenceInterval(experiments: RetentionExperiment[]): [number, number] {
    const predicted = this.calculateOverallRetention(experiments)
    const margin = Math.max(5, 20 - experiments.length)
    
    return [predicted - margin, predicted + margin]
  }

  private identifyExamRisks(experiments: RetentionExperiment[], daysUntilExam: number): string[] {
    const risks = []
    
    if (daysUntilExam < 30) {
      risks.push('Limited time for comprehensive revision')
    }
    
    const lowRetentionItems = experiments.filter(exp => 
      exp.retentionScores[exp.retentionScores.length - 1] < 60
    )
    
    if (lowRetentionItems.length > 0) {
      risks.push(`${lowRetentionItems.length} topics need urgent attention`)
    }
    
    return risks
  }

  private calculateImprovementPotential(experiments: RetentionExperiment[], profile: ForgetfulnessProfile): number {
    const currentLevel = this.calculateOverallRetention(experiments)
    const theoreticalMax = 95
    const personalFactor = 2.0 - profile.personalDecayRate
    
    return Math.round((theoreticalMax - currentLevel) * personalFactor * 0.7)
  }

  private generateExamPreparationPlan(experiments: RetentionExperiment[], daysUntilExam: number): string[] {
    const plan = []
    
    if (daysUntilExam > 60) {
      plan.push('Focus on building strong foundation with spaced repetition')
    } else if (daysUntilExam > 30) {
      plan.push('Intensify revision frequency and add active recall sessions')
    } else {
      plan.push('Focus on weak areas and rapid consolidation techniques')
    }
    
    plan.push('Prioritize high-importance and struggling topics')
    plan.push('Use multiple revision formats for better encoding')
    
    return plan
  }
}