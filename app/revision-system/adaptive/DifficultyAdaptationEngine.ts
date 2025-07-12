import {
  AdaptiveDifficulty,
  PerformanceSnapshot,
  AdaptationTrigger,
  RevisionItem,
  UserResponse,
  DifficultyLevel
} from '../types'
import { SubjectArea } from '../../question-generator/types'

interface DifficultyProfile {
  userId: string
  subjectProficiency: Record<SubjectArea, DifficultyLevel>
  learningVelocity: number // How quickly user adapts to new difficulty
  comfortZone: DifficultyLevel // User's preferred difficulty level
  challengeThreshold: number // Performance threshold for increasing difficulty
  supportThreshold: number // Performance threshold for decreasing difficulty
  adaptationSensitivity: number // How quickly system responds to changes
  masteryConfidence: Record<string, number> // Confidence in topic mastery
}

interface AdaptationRule {
  id: string
  name: string
  condition: (performance: PerformanceSnapshot[], currentDifficulty: DifficultyLevel) => boolean
  newDifficulty: DifficultyLevel
  reason: string
  priority: number
  cooldownPeriod: number // Hours before rule can trigger again
}

interface DifficultyTransition {
  fromDifficulty: DifficultyLevel
  toDifficulty: DifficultyLevel
  timestamp: Date
  reason: string
  performanceContext: PerformanceSnapshot
  confidence: number
  expectedOutcome: string
}

interface FlowState {
  userId: string
  itemId: string
  currentFlow: number // -100 to +100, where positive indicates optimal challenge
  flowHistory: FlowMeasurement[]
  optimalDifficulty: DifficultyLevel
  flowFactors: FlowFactor[]
}

interface FlowMeasurement {
  timestamp: Date
  difficulty: DifficultyLevel
  flowScore: number
  engagement: number
  frustration: number
  boredom: number
  confidence: number
}

interface FlowFactor {
  factor: 'Skill' | 'Challenge' | 'Feedback' | 'Focus' | 'Motivation'
  impact: number
  trend: 'Improving' | 'Stable' | 'Declining'
}

export class UPSCDifficultyAdaptationEngine {
  
  private difficultyProfiles: Map<string, DifficultyProfile> = new Map()
  private performanceHistory: Map<string, PerformanceSnapshot[]> = new Map()
  private adaptationHistory: Map<string, AdaptiveDifficulty[]> = new Map()
  private transitionHistory: Map<string, DifficultyTransition[]> = new Map()
  private flowStates: Map<string, FlowState> = new Map()
  private adaptationRules: AdaptationRule[] = []

  constructor() {
    console.log('🎯 UPSC Difficulty Adaptation Engine initialized')
    this.initializeAdaptationRules()
  }

  async analyzePerformanceAndAdapt(userId: string, item: RevisionItem, response: UserResponse): Promise<AdaptiveDifficulty> {
    console.log(`⚡ Analyzing performance for adaptation: ${item.topic} (${item.difficulty})`)
    
    // Record performance snapshot
    const snapshot = this.createPerformanceSnapshot(item, response)
    await this.recordPerformance(userId, item.id, snapshot)
    
    // Get user's difficulty profile
    const profile = await this.getDifficultyProfile(userId)
    
    // Analyze current performance context
    const performanceContext = await this.getPerformanceContext(userId, item.id)
    
    // Determine if adaptation is needed
    const adaptationTriggers = this.evaluateAdaptationTriggers(performanceContext, item.difficulty)
    
    // Calculate optimal difficulty
    const optimalDifficulty = this.calculateOptimalDifficulty(performanceContext, profile, item)
    
    // Create adaptation record
    const adaptation: AdaptiveDifficulty = {
      userId,
      itemId: item.id,
      currentDifficulty: item.difficulty,
      performanceHistory: performanceContext,
      adaptationTriggers,
      nextDifficulty: optimalDifficulty,
      adjustmentReason: this.generateAdjustmentReason(adaptationTriggers, item.difficulty, optimalDifficulty),
      effectiveDate: new Date()
    }
    
    // Record adaptation
    await this.recordAdaptation(userId, adaptation)
    
    // Update difficulty profile
    await this.updateDifficultyProfile(userId, item, response, adaptation)
    
    console.log(`📊 Adaptation complete: ${item.difficulty} → ${optimalDifficulty} (${adaptation.adjustmentReason})`)
    
    return adaptation
  }

  async calculateFlowState(userId: string, item: RevisionItem, response: UserResponse): Promise<FlowState> {
    console.log(`🌊 Calculating flow state for: ${item.topic}`)
    
    const flowKey = `${userId}-${item.id}`
    let flowState = this.flowStates.get(flowKey)
    
    if (!flowState) {
      flowState = this.initializeFlowState(userId, item.id)
      this.flowStates.set(flowKey, flowState)
    }
    
    // Calculate current flow score
    const flowMeasurement = this.measureCurrentFlow(item, response)
    flowState.flowHistory.push(flowMeasurement)
    
    // Update overall flow state
    flowState.currentFlow = this.calculateOverallFlow(flowState.flowHistory)
    flowState.optimalDifficulty = this.determineOptimalDifficultyFromFlow(flowState)
    flowState.flowFactors = this.analyzeFlowFactors(flowState.flowHistory)
    
    console.log(`🎯 Flow state: ${flowState.currentFlow}/100, optimal difficulty: ${flowState.optimalDifficulty}`)
    
    return flowState
  }

  async getDifficultyRecommendations(userId: string, items: RevisionItem[]): Promise<Map<string, DifficultyLevel>> {
    console.log(`💡 Generating difficulty recommendations for ${items.length} items`)
    
    const recommendations = new Map<string, DifficultyLevel>()
    const profile = await this.getDifficultyProfile(userId)
    
    for (const item of items) {
      const performanceContext = await this.getPerformanceContext(userId, item.id)
      const flowState = await this.calculateFlowState(userId, item, {
        answer: '', confidence: 3, timeSpent: 0, hintsUsed: 0, selfRating: 'Good'
      })
      
      const recommendedDifficulty = this.synthesizeOptimalDifficulty(
        item.difficulty,
        performanceContext,
        flowState,
        profile
      )
      
      recommendations.set(item.id, recommendedDifficulty)
    }
    
    console.log(`✅ Generated ${recommendations.size} difficulty recommendations`)
    return recommendations
  }

  async analyzeAdaptationEffectiveness(userId: string): Promise<any> {
    console.log(`📈 Analyzing adaptation effectiveness for user ${userId}`)
    
    const adaptations = this.adaptationHistory.get(userId) || []
    const transitions = this.transitionHistory.get(userId) || []
    
    return {
      totalAdaptations: adaptations.length,
      successfulAdaptations: this.countSuccessfulAdaptations(adaptations, transitions),
      adaptationAccuracy: this.calculateAdaptationAccuracy(adaptations, transitions),
      averageTimeToOptimal: this.calculateAverageTimeToOptimal(transitions),
      difficultyStability: this.calculateDifficultyStability(transitions),
      learningAcceleration: this.calculateLearningAcceleration(adaptations),
      recommendations: this.generateEffectivenessRecommendations(adaptations, transitions)
    }
  }

  async getPersonalizedDifficultyInsights(userId: string): Promise<any> {
    const profile = await this.getDifficultyProfile(userId)
    const adaptations = this.adaptationHistory.get(userId) || []
    const performance = this.performanceHistory.get(userId) || []
    
    return {
      profile: {
        learningStyle: this.determineLearningStyle(profile),
        preferredPace: this.determinePreferredPace(performance),
        challengeComfortZone: profile.comfortZone,
        adaptationRate: profile.learningVelocity
      },
      patterns: {
        difficultyPreferences: this.analyzeDifficultyPreferences(adaptations),
        performancePatterns: this.analyzePerformancePatterns(performance),
        optimalConditions: this.identifyOptimalConditions(performance)
      },
      recommendations: {
        difficultyStrategy: this.recommendDifficultyStrategy(profile, adaptations),
        personalizationTips: this.generatePersonalizationTips(profile, performance),
        nextSteps: this.suggestNextSteps(profile, adaptations)
      }
    }
  }

  // Private helper methods
  private initializeAdaptationRules(): void {
    this.adaptationRules = [
      {
        id: 'high_accuracy_streak',
        name: 'High Accuracy Streak',
        condition: (performance, currentDifficulty) => {
          const recent = performance.slice(-5)
          return recent.length >= 3 && recent.every(p => p.accuracy >= 85) && currentDifficulty !== 'hard'
        },
        newDifficulty: 'hard',
        reason: 'Consistently high accuracy indicates readiness for increased challenge',
        priority: 8,
        cooldownPeriod: 24
      },
      {
        id: 'low_accuracy_struggle',
        name: 'Low Accuracy Struggle',
        condition: (performance, currentDifficulty) => {
          const recent = performance.slice(-5)
          return recent.length >= 3 && recent.every(p => p.accuracy <= 50) && currentDifficulty !== 'easy'
        },
        newDifficulty: 'easy',
        reason: 'Persistent low accuracy requires foundational reinforcement',
        priority: 9,
        cooldownPeriod: 12
      },
      {
        id: 'fast_confident_responses',
        name: 'Fast Confident Responses',
        condition: (performance, currentDifficulty) => {
          const recent = performance.slice(-3)
          return recent.length >= 3 && recent.every(p => p.speed > 1.5 && p.confidence >= 4) && currentDifficulty === 'easy'
        },
        newDifficulty: 'medium',
        reason: 'Fast, confident responses indicate mastery at current level',
        priority: 7,
        cooldownPeriod: 12
      },
      {
        id: 'slow_uncertain_responses',
        name: 'Slow Uncertain Responses',
        condition: (performance, currentDifficulty) => {
          const recent = performance.slice(-4)
          return recent.length >= 3 && recent.every(p => p.speed < 0.7 && p.confidence <= 2) && currentDifficulty === 'hard'
        },
        newDifficulty: 'medium',
        reason: 'Slow, uncertain responses suggest cognitive overload',
        priority: 8,
        cooldownPeriod: 6
      },
      {
        id: 'plateauing_performance',
        name: 'Plateauing Performance',
        condition: (performance, currentDifficulty) => {
          if (performance.length < 8) return false
          const recent = performance.slice(-8)
          const variance = this.calculatePerformanceVariance(recent)
          return variance < 5 && currentDifficulty !== 'hard' // Low variance indicates plateau
        },
        newDifficulty: 'hard',
        reason: 'Performance plateau indicates need for increased challenge',
        priority: 6,
        cooldownPeriod: 48
      },
      {
        id: 'improving_trend',
        name: 'Improving Trend',
        condition: (performance, currentDifficulty) => {
          if (performance.length < 6) return false
          const trend = this.calculatePerformanceTrend(performance.slice(-6))
          return trend > 0.1 && currentDifficulty === 'easy' // Positive trend
        },
        newDifficulty: 'medium',
        reason: 'Consistent improvement warrants difficulty progression',
        priority: 5,
        cooldownPeriod: 24
      }
    ]
    
    console.log(`🔧 Initialized ${this.adaptationRules.length} adaptation rules`)
  }

  private createPerformanceSnapshot(item: RevisionItem, response: UserResponse): PerformanceSnapshot {
    // Calculate speed (responses per minute)
    const speed = response.timeSpent > 0 ? 60 / response.timeSpent : 1
    
    // Calculate accuracy based on self-rating and confidence
    const accuracy = this.calculateAccuracyFromResponse(response)
    
    // Calculate current streak
    const streak = this.calculateCurrentStreak(item.userId, item.id)
    
    return {
      date: new Date(),
      accuracy,
      speed,
      confidence: response.confidence,
      streak,
      context: `${item.difficulty}-${item.contentType}-${item.subject}`
    }
  }

  private calculateAccuracyFromResponse(response: UserResponse): number {
    // Convert self-rating to accuracy percentage
    const ratingMap = {
      'Easy': 95,
      'Good': 85,
      'Hard': 65,
      'Again': 35
    }
    
    const baseAccuracy = ratingMap[response.selfRating]
    
    // Adjust based on confidence
    const confidenceAdjustment = (response.confidence - 3) * 5
    
    return Math.max(0, Math.min(100, baseAccuracy + confidenceAdjustment))
  }

  private calculateCurrentStreak(userId: string, itemId: string): number {
    const performance = this.performanceHistory.get(userId) || []
    const itemPerformance = performance.filter(p => p.context.includes(itemId))
    
    if (itemPerformance.length === 0) return 0
    
    let streak = 0
    for (let i = itemPerformance.length - 1; i >= 0; i--) {
      if (itemPerformance[i].accuracy >= 70) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  private async recordPerformance(userId: string, itemId: string, snapshot: PerformanceSnapshot): Promise<void> {
    const userPerformance = this.performanceHistory.get(userId) || []
    userPerformance.push(snapshot)
    
    // Keep only last 100 performance records per user
    if (userPerformance.length > 100) {
      userPerformance.splice(0, userPerformance.length - 100)
    }
    
    this.performanceHistory.set(userId, userPerformance)
  }

  private async getDifficultyProfile(userId: string): Promise<DifficultyProfile> {
    if (!this.difficultyProfiles.has(userId)) {
      const profile = await this.createDifficultyProfile(userId)
      this.difficultyProfiles.set(userId, profile)
    }
    
    return this.difficultyProfiles.get(userId)!
  }

  private async createDifficultyProfile(userId: string): Promise<DifficultyProfile> {
    const performance = this.performanceHistory.get(userId) || []
    
    return {
      userId,
      subjectProficiency: this.calculateSubjectProficiency(performance),
      learningVelocity: this.calculateLearningVelocity(performance),
      comfortZone: this.determineComfortZone(performance),
      challengeThreshold: 85, // Increase difficulty when accuracy > 85%
      supportThreshold: 60, // Decrease difficulty when accuracy < 60%
      adaptationSensitivity: 0.7, // Moderate sensitivity
      masteryConfidence: this.calculateMasteryConfidence(performance)
    }
  }

  private async getPerformanceContext(userId: string, itemId: string): Promise<PerformanceSnapshot[]> {
    const allPerformance = this.performanceHistory.get(userId) || []
    
    // Get performance for this specific item or similar items
    const itemPerformance = allPerformance.filter(p => 
      p.context.includes(itemId) || 
      p.context.split('-').some(part => itemId.includes(part))
    )
    
    // If no specific performance, use general recent performance
    if (itemPerformance.length === 0) {
      return allPerformance.slice(-10) // Last 10 performances
    }
    
    return itemPerformance.slice(-15) // Last 15 performances for this item/topic
  }

  private evaluateAdaptationTriggers(performance: PerformanceSnapshot[], currentDifficulty: DifficultyLevel): AdaptationTrigger[] {
    const triggers: AdaptationTrigger[] = []
    
    for (const rule of this.adaptationRules) {
      if (rule.condition(performance, currentDifficulty)) {
        const direction = this.getDifficultyDirection(currentDifficulty, rule.newDifficulty)
        
        triggers.push({
          type: this.mapRuleToTriggerType(rule.id),
          threshold: this.calculateRuleThreshold(rule, performance),
          consecutiveCount: this.calculateConsecutiveCount(rule, performance),
          adjustmentDirection: direction
        })
      }
    }
    
    return triggers.sort((a, b) => this.getTriggerPriority(a.type) - this.getTriggerPriority(b.type))
  }

  private calculateOptimalDifficulty(
    performance: PerformanceSnapshot[], 
    profile: DifficultyProfile, 
    item: RevisionItem
  ): DifficultyLevel {
    if (performance.length === 0) {
      return profile.comfortZone
    }
    
    // Calculate recent performance metrics
    const recentPerformance = performance.slice(-5)
    const avgAccuracy = recentPerformance.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformance.length
    const avgConfidence = recentPerformance.reduce((sum, p) => sum + p.confidence, 0) / recentPerformance.length
    const avgSpeed = recentPerformance.reduce((sum, p) => sum + p.speed, 0) / recentPerformance.length
    
    // Apply subject proficiency
    const subjectProficiency = profile.subjectProficiency[item.subject] || 'medium'
    
    // Decision logic
    if (avgAccuracy >= profile.challengeThreshold && avgConfidence >= 4 && avgSpeed >= 1.2) {
      return this.increaseDifficulty(item.difficulty, subjectProficiency)
    }
    
    if (avgAccuracy <= profile.supportThreshold || (avgConfidence <= 2 && avgSpeed <= 0.8)) {
      return this.decreaseDifficulty(item.difficulty, subjectProficiency)
    }
    
    // Check for optimal challenge zone (flow state)
    const flowScore = this.calculateSimpleFlowScore(avgAccuracy, avgConfidence, avgSpeed)
    if (flowScore >= 0.7) {
      return item.difficulty // Stay at current level
    }
    
    // Default to slight increase if performance is stable
    if (this.isPerformanceStable(recentPerformance)) {
      return this.increaseDifficulty(item.difficulty, subjectProficiency)
    }
    
    return item.difficulty
  }

  private increaseDifficulty(current: DifficultyLevel, subjectProficiency: DifficultyLevel): DifficultyLevel {
    if (current === 'easy' && subjectProficiency !== 'easy') return 'medium'
    if (current === 'medium' && subjectProficiency === 'hard') return 'hard'
    return current
  }

  private decreaseDifficulty(current: DifficultyLevel, subjectProficiency: DifficultyLevel): DifficultyLevel {
    if (current === 'hard') return 'medium'
    if (current === 'medium' && subjectProficiency === 'easy') return 'easy'
    return current
  }

  private generateAdjustmentReason(
    triggers: AdaptationTrigger[], 
    current: DifficultyLevel, 
    next: DifficultyLevel
  ): string {
    if (current === next) {
      return 'Performance indicates optimal difficulty level maintained'
    }
    
    if (triggers.length === 0) {
      return 'Adaptive adjustment based on performance patterns'
    }
    
    const primaryTrigger = triggers[0]
    const direction = next > current ? 'increased' : 'decreased'
    
    const reasonMap = {
      'HighAccuracy': `Difficulty ${direction} due to consistently high accuracy`,
      'LowAccuracy': `Difficulty ${direction} to provide better support`,
      'FastResponse': `Difficulty ${direction} due to rapid, confident responses`,
      'SlowResponse': `Difficulty ${direction} to reduce cognitive load`,
      'HighConfidence': `Difficulty ${direction} based on high confidence levels`,
      'LowConfidence': `Difficulty ${direction} to build confidence`
    }
    
    return reasonMap[primaryTrigger.type] || `Difficulty ${direction} based on performance analysis`
  }

  private async recordAdaptation(userId: string, adaptation: AdaptiveDifficulty): Promise<void> {
    const userAdaptations = this.adaptationHistory.get(userId) || []
    userAdaptations.push(adaptation)
    
    // Keep only last 50 adaptations per user
    if (userAdaptations.length > 50) {
      userAdaptations.splice(0, userAdaptations.length - 50)
    }
    
    this.adaptationHistory.set(userId, userAdaptations)
    
    // Record transition if difficulty changed
    if (adaptation.currentDifficulty !== adaptation.nextDifficulty) {
      await this.recordDifficultyTransition(userId, adaptation)
    }
  }

  private async recordDifficultyTransition(userId: string, adaptation: AdaptiveDifficulty): Promise<void> {
    const transitions = this.transitionHistory.get(userId) || []
    
    const transition: DifficultyTransition = {
      fromDifficulty: adaptation.currentDifficulty,
      toDifficulty: adaptation.nextDifficulty,
      timestamp: new Date(),
      reason: adaptation.adjustmentReason,
      performanceContext: adaptation.performanceHistory[adaptation.performanceHistory.length - 1],
      confidence: this.calculateTransitionConfidence(adaptation),
      expectedOutcome: this.predictTransitionOutcome(adaptation)
    }
    
    transitions.push(transition)
    this.transitionHistory.set(userId, transitions)
  }

  private async updateDifficultyProfile(
    userId: string, 
    item: RevisionItem, 
    response: UserResponse, 
    adaptation: AdaptiveDifficulty
  ): Promise<void> {
    const profile = await this.getDifficultyProfile(userId)
    
    // Update subject proficiency based on performance
    const currentProficiency = profile.subjectProficiency[item.subject] || 'medium'
    if (response.selfRating === 'Easy' && response.confidence >= 4) {
      profile.subjectProficiency[item.subject] = this.increaseDifficulty(currentProficiency, 'hard')
    } else if (response.selfRating === 'Again' || response.confidence <= 2) {
      profile.subjectProficiency[item.subject] = this.decreaseDifficulty(currentProficiency, 'easy')
    }
    
    // Update learning velocity based on adaptation success
    const adaptationSuccess = this.evaluateAdaptationSuccess(adaptation, response)
    if (adaptationSuccess) {
      profile.learningVelocity = Math.min(2.0, profile.learningVelocity + 0.1)
    } else {
      profile.learningVelocity = Math.max(0.5, profile.learningVelocity - 0.05)
    }
    
    // Update mastery confidence
    const itemKey = `${item.subject}-${item.topic}`
    const currentConfidence = profile.masteryConfidence[itemKey] || 50
    const performanceScore = this.calculateAccuracyFromResponse(response)
    profile.masteryConfidence[itemKey] = (currentConfidence * 0.7 + performanceScore * 0.3)
    
    this.difficultyProfiles.set(userId, profile)
  }

  private initializeFlowState(userId: string, itemId: string): FlowState {
    return {
      userId,
      itemId,
      currentFlow: 0,
      flowHistory: [],
      optimalDifficulty: 'medium',
      flowFactors: [
        { factor: 'Skill', impact: 0, trend: 'Stable' },
        { factor: 'Challenge', impact: 0, trend: 'Stable' },
        { factor: 'Feedback', impact: 0, trend: 'Stable' },
        { factor: 'Focus', impact: 0, trend: 'Stable' },
        { factor: 'Motivation', impact: 0, trend: 'Stable' }
      ]
    }
  }

  private measureCurrentFlow(item: RevisionItem, response: UserResponse): FlowMeasurement {
    // Calculate flow components
    const engagement = this.calculateEngagement(response)
    const frustration = this.calculateFrustration(response)
    const boredom = this.calculateBoredom(response)
    
    // Flow score is high when engagement is high and frustration/boredom are low
    const flowScore = engagement - (frustration + boredom) / 2
    
    return {
      timestamp: new Date(),
      difficulty: item.difficulty,
      flowScore: Math.max(-100, Math.min(100, flowScore)),
      engagement,
      frustration,
      boredom,
      confidence: response.confidence * 20 // Convert 1-5 scale to 0-100
    }
  }

  private calculateEngagement(response: UserResponse): number {
    // High engagement indicated by appropriate time spent and reasonable confidence
    const timeEngagement = response.timeSpent > 10 && response.timeSpent < 180 ? 80 : 40
    const confidenceEngagement = response.confidence >= 3 ? response.confidence * 15 : 20
    const effortEngagement = response.hintsUsed <= 2 ? 70 : 40
    
    return Math.round((timeEngagement + confidenceEngagement + effortEngagement) / 3)
  }

  private calculateFrustration(response: UserResponse): number {
    // High frustration indicated by excessive time, low confidence, many hints
    let frustration = 0
    
    if (response.timeSpent > 300) frustration += 30 // Too much time
    if (response.confidence <= 2) frustration += 40 // Low confidence
    if (response.hintsUsed > 3) frustration += 30 // Too many hints
    if (response.selfRating === 'Again') frustration += 50 // Failed attempt
    
    return Math.min(100, frustration)
  }

  private calculateBoredom(response: UserResponse): number {
    // High boredom indicated by very fast completion with high confidence
    let boredom = 0
    
    if (response.timeSpent < 10 && response.confidence >= 4) boredom += 60 // Too easy
    if (response.selfRating === 'Easy' && response.hintsUsed === 0) boredom += 40 // No challenge
    
    return Math.min(100, boredom)
  }

  private calculateOverallFlow(flowHistory: FlowMeasurement[]): number {
    if (flowHistory.length === 0) return 0
    
    // Weight recent measurements more heavily
    const weights = flowHistory.map((_, index) => Math.pow(1.1, index))
    const weightedSum = flowHistory.reduce((sum, measurement, index) => 
      sum + measurement.flowScore * weights[index], 0)
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    
    return Math.round(weightedSum / totalWeight)
  }

  private determineOptimalDifficultyFromFlow(flowState: FlowState): DifficultyLevel {
    const currentFlow = flowState.currentFlow
    
    if (currentFlow >= 60) {
      return 'hard' // High flow, can handle more challenge
    } else if (currentFlow >= 20) {
      return 'medium' // Moderate flow, optimal challenge
    } else if (currentFlow >= -20) {
      return 'medium' // Slightly low flow, maintain current
    } else {
      return 'easy' // Low flow, reduce challenge
    }
  }

  private analyzeFlowFactors(flowHistory: FlowMeasurement[]): FlowFactor[] {
    if (flowHistory.length < 3) {
      return [
        { factor: 'Skill', impact: 0, trend: 'Stable' },
        { factor: 'Challenge', impact: 0, trend: 'Stable' },
        { factor: 'Feedback', impact: 0, trend: 'Stable' },
        { factor: 'Focus', impact: 0, trend: 'Stable' },
        { factor: 'Motivation', impact: 0, trend: 'Stable' }
      ]
    }
    
    const recent = flowHistory.slice(-5)
    const earlier = flowHistory.slice(-10, -5)
    
    return [
      {
        factor: 'Skill',
        impact: this.calculateAverageConfidence(recent) - 50,
        trend: this.comparePeriods(recent, earlier, 'confidence')
      },
      {
        factor: 'Challenge',
        impact: this.calculateOptimalChallenge(recent),
        trend: this.comparePeriods(recent, earlier, 'flowScore')
      },
      {
        factor: 'Focus',
        impact: this.calculateFocusScore(recent),
        trend: this.comparePeriods(recent, earlier, 'engagement')
      },
      {
        factor: 'Motivation',
        impact: this.calculateMotivationScore(recent),
        trend: this.comparePeriods(recent, earlier, 'flowScore')
      },
      {
        factor: 'Feedback',
        impact: 20, // Assume positive feedback impact
        trend: 'Stable'
      }
    ]
  }

  private synthesizeOptimalDifficulty(
    current: DifficultyLevel,
    performance: PerformanceSnapshot[],
    flowState: FlowState,
    profile: DifficultyProfile
  ): DifficultyLevel {
    // Weight different factors
    const performanceBased = this.calculateOptimalDifficulty(performance, profile, { difficulty: current } as RevisionItem)
    const flowBased = flowState.optimalDifficulty
    const profileBased = profile.comfortZone
    
    // Combine recommendations with weights
    const recommendations = [
      { difficulty: performanceBased, weight: 0.5 },
      { difficulty: flowBased, weight: 0.3 },
      { difficulty: profileBased, weight: 0.2 }
    ]
    
    return this.weightedDifficultyDecision(recommendations)
  }

  // Helper methods for complex calculations
  private calculateSubjectProficiency(performance: PerformanceSnapshot[]): Record<SubjectArea, DifficultyLevel> {
    const proficiency: Record<SubjectArea, DifficultyLevel> = {} as any
    
    // Group performance by subject (extracted from context)
    const subjectPerformance: Record<string, PerformanceSnapshot[]> = {}
    
    performance.forEach(p => {
      const subject = this.extractSubjectFromContext(p.context)
      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = []
      }
      subjectPerformance[subject].push(p)
    })
    
    // Calculate proficiency for each subject
    Object.entries(subjectPerformance).forEach(([subject, performances]) => {
      const avgAccuracy = performances.reduce((sum, p) => sum + p.accuracy, 0) / performances.length
      const avgConfidence = performances.reduce((sum, p) => sum + p.confidence, 0) / performances.length
      
      if (avgAccuracy >= 85 && avgConfidence >= 4) {
        proficiency[subject as SubjectArea] = 'hard'
      } else if (avgAccuracy >= 70 && avgConfidence >= 3) {
        proficiency[subject as SubjectArea] = 'medium'
      } else {
        proficiency[subject as SubjectArea] = 'easy'
      }
    })
    
    return proficiency
  }

  private calculateLearningVelocity(performance: PerformanceSnapshot[]): number {
    if (performance.length < 5) return 1.0 // Default velocity
    
    const recent = performance.slice(-10)
    const earlier = performance.slice(-20, -10)
    
    if (earlier.length === 0) return 1.0
    
    const recentAvg = recent.reduce((sum, p) => sum + p.accuracy, 0) / recent.length
    const earlierAvg = earlier.reduce((sum, p) => sum + p.accuracy, 0) / earlier.length
    
    const improvement = recentAvg - earlierAvg
    
    // Convert improvement to velocity (0.5 to 2.0 range)
    return Math.max(0.5, Math.min(2.0, 1.0 + improvement / 50))
  }

  private determineComfortZone(performance: PerformanceSnapshot[]): DifficultyLevel {
    if (performance.length === 0) return 'medium'
    
    const avgAccuracy = performance.reduce((sum, p) => sum + p.accuracy, 0) / performance.length
    const avgConfidence = performance.reduce((sum, p) => sum + p.confidence, 0) / performance.length
    
    if (avgAccuracy >= 80 && avgConfidence >= 4) return 'hard'
    if (avgAccuracy >= 65 && avgConfidence >= 3) return 'medium'
    return 'easy'
  }

  private calculateMasteryConfidence(performance: PerformanceSnapshot[]): Record<string, number> {
    const confidence: Record<string, number> = {}
    
    // Group by context and calculate confidence
    const contextGroups: Record<string, PerformanceSnapshot[]> = {}
    
    performance.forEach(p => {
      if (!contextGroups[p.context]) {
        contextGroups[p.context] = []
      }
      contextGroups[p.context].push(p)
    })
    
    Object.entries(contextGroups).forEach(([context, performances]) => {
      const avgPerformance = performances.reduce((sum, p) => sum + p.accuracy, 0) / performances.length
      const consistency = 100 - this.calculatePerformanceVariance(performances)
      confidence[context] = Math.round((avgPerformance + consistency) / 2)
    })
    
    return confidence
  }

  private calculatePerformanceVariance(performance: PerformanceSnapshot[]): number {
    if (performance.length <= 1) return 0
    
    const mean = performance.reduce((sum, p) => sum + p.accuracy, 0) / performance.length
    const squaredDiffs = performance.map(p => Math.pow(p.accuracy - mean, 2))
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / performance.length
  }

  private calculatePerformanceTrend(performance: PerformanceSnapshot[]): number {
    if (performance.length < 2) return 0
    
    // Simple linear regression to calculate trend
    const n = performance.length
    const sumX = (n * (n - 1)) / 2 // Sum of indices
    const sumY = performance.reduce((sum, p) => sum + p.accuracy, 0)
    const sumXY = performance.reduce((sum, p, index) => sum + index * p.accuracy, 0)
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6 // Sum of squared indices
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  }

  private getDifficultyDirection(from: DifficultyLevel, to: DifficultyLevel): 'Increase' | 'Decrease' | 'Maintain' {
    const levels = { easy: 1, medium: 2, hard: 3 }
    const fromLevel = levels[from]
    const toLevel = levels[to]
    
    if (toLevel > fromLevel) return 'Increase'
    if (toLevel < fromLevel) return 'Decrease'
    return 'Maintain'
  }

  private mapRuleToTriggerType(ruleId: string): AdaptationTrigger['type'] {
    const mapping = {
      'high_accuracy_streak': 'HighAccuracy',
      'low_accuracy_struggle': 'LowAccuracy',
      'fast_confident_responses': 'FastResponse',
      'slow_uncertain_responses': 'SlowResponse',
      'plateauing_performance': 'HighAccuracy',
      'improving_trend': 'HighAccuracy'
    }
    
    return mapping[ruleId as keyof typeof mapping] || 'HighAccuracy'
  }

  private calculateRuleThreshold(rule: AdaptationRule, performance: PerformanceSnapshot[]): number {
    // Return appropriate threshold based on rule type
    switch (rule.id) {
      case 'high_accuracy_streak': return 85
      case 'low_accuracy_struggle': return 50
      case 'fast_confident_responses': return 1.5
      case 'slow_uncertain_responses': return 0.7
      default: return 75
    }
  }

  private calculateConsecutiveCount(rule: AdaptationRule, performance: PerformanceSnapshot[]): number {
    // Count consecutive occurrences of the condition
    const recentPerformance = performance.slice(-10)
    let count = 0
    
    for (let i = recentPerformance.length - 1; i >= 0; i--) {
      if (this.performanceMeetsRuleCondition(recentPerformance[i], rule)) {
        count++
      } else {
        break
      }
    }
    
    return count
  }

  private getTriggerPriority(type: AdaptationTrigger['type']): number {
    const priorities = {
      'LowAccuracy': 1,
      'SlowResponse': 2,
      'LowConfidence': 3,
      'HighAccuracy': 4,
      'FastResponse': 5,
      'HighConfidence': 6
    }
    
    return priorities[type] || 5
  }

  private calculateSimpleFlowScore(accuracy: number, confidence: number, speed: number): number {
    // Simple flow calculation: balanced accuracy, confidence, and appropriate speed
    const accuracyScore = Math.min(accuracy / 85, 1) // Optimal around 85%
    const confidenceScore = Math.min(confidence / 4, 1) // Optimal around 4/5
    const speedScore = speed > 0.8 && speed < 2.0 ? 1 : 0.5 // Optimal speed range
    
    return (accuracyScore + confidenceScore + speedScore) / 3
  }

  private isPerformanceStable(performance: PerformanceSnapshot[]): boolean {
    if (performance.length < 3) return false
    
    const variance = this.calculatePerformanceVariance(performance)
    return variance < 10 // Low variance indicates stability
  }

  private calculateTransitionConfidence(adaptation: AdaptiveDifficulty): number {
    const triggerCount = adaptation.adaptationTriggers.length
    const performanceCount = adaptation.performanceHistory.length
    
    // Higher confidence with more triggers and more performance data
    return Math.min(95, 50 + triggerCount * 10 + Math.min(performanceCount, 10) * 3)
  }

  private predictTransitionOutcome(adaptation: AdaptiveDifficulty): string {
    const direction = this.getDifficultyDirection(adaptation.currentDifficulty, adaptation.nextDifficulty)
    
    if (direction === 'Increase') {
      return 'Expected: Initial performance drop followed by skill improvement'
    } else if (direction === 'Decrease') {
      return 'Expected: Immediate performance improvement and confidence boost'
    } else {
      return 'Expected: Continued stable performance at current level'
    }
  }

  private evaluateAdaptationSuccess(adaptation: AdaptiveDifficulty, response: UserResponse): boolean {
    // Success is measured by whether the adaptation led to appropriate challenge level
    const accuracy = this.calculateAccuracyFromResponse(response)
    
    if (adaptation.nextDifficulty === 'hard') {
      return accuracy >= 60 && response.confidence >= 3 // Challenging but manageable
    } else if (adaptation.nextDifficulty === 'easy') {
      return accuracy >= 80 && response.confidence >= 4 // Confidence building
    } else {
      return accuracy >= 70 && response.confidence >= 3 // Balanced challenge
    }
  }

  // Additional helper methods for analysis
  private extractSubjectFromContext(context: string): string {
    const parts = context.split('-')
    return parts.length > 2 ? parts[2] : 'General'
  }

  private performanceMeetsRuleCondition(performance: PerformanceSnapshot, rule: AdaptationRule): boolean {
    // Simplified check - in practice would be more sophisticated
    switch (rule.id) {
      case 'high_accuracy_streak':
        return performance.accuracy >= 85
      case 'low_accuracy_struggle':
        return performance.accuracy <= 50
      case 'fast_confident_responses':
        return performance.speed > 1.5 && performance.confidence >= 4
      case 'slow_uncertain_responses':
        return performance.speed < 0.7 && performance.confidence <= 2
      default:
        return false
    }
  }

  private calculateAverageConfidence(measurements: FlowMeasurement[]): number {
    if (measurements.length === 0) return 50
    return measurements.reduce((sum, m) => sum + m.confidence, 0) / measurements.length
  }

  private calculateOptimalChallenge(measurements: FlowMeasurement[]): number {
    // Positive when challenge level is appropriate
    const avgFlow = measurements.reduce((sum, m) => sum + m.flowScore, 0) / measurements.length
    return avgFlow > 0 ? 20 : -20
  }

  private calculateFocusScore(measurements: FlowMeasurement[]): number {
    const avgEngagement = measurements.reduce((sum, m) => sum + m.engagement, 0) / measurements.length
    return avgEngagement - 50 // Positive when above average engagement
  }

  private calculateMotivationScore(measurements: FlowMeasurement[]): number {
    const avgFlow = measurements.reduce((sum, m) => sum + m.flowScore, 0) / measurements.length
    return avgFlow > 20 ? 30 : avgFlow < -20 ? -30 : 0
  }

  private comparePeriods(recent: FlowMeasurement[], earlier: FlowMeasurement[], metric: keyof FlowMeasurement): 'Improving' | 'Stable' | 'Declining' {
    if (earlier.length === 0) return 'Stable'
    
    const recentAvg = recent.reduce((sum, m) => sum + (m[metric] as number), 0) / recent.length
    const earlierAvg = earlier.reduce((sum, m) => sum + (m[metric] as number), 0) / earlier.length
    
    const diff = recentAvg - earlierAvg
    
    if (diff > 5) return 'Improving'
    if (diff < -5) return 'Declining'
    return 'Stable'
  }

  private weightedDifficultyDecision(recommendations: { difficulty: DifficultyLevel, weight: number }[]): DifficultyLevel {
    const scores = { easy: 0, medium: 0, hard: 0 }
    
    recommendations.forEach(rec => {
      scores[rec.difficulty] += rec.weight
    })
    
    // Return difficulty with highest weighted score
    return Object.entries(scores).reduce((max, [difficulty, score]) => 
      score > max.score ? { difficulty: difficulty as DifficultyLevel, score } : max,
      { difficulty: 'medium' as DifficultyLevel, score: 0 }
    ).difficulty
  }

  // Mock methods for comprehensive analysis
  private countSuccessfulAdaptations(adaptations: AdaptiveDifficulty[], transitions: DifficultyTransition[]): number {
    return Math.round(adaptations.length * 0.75) // Assume 75% success rate
  }

  private calculateAdaptationAccuracy(adaptations: AdaptiveDifficulty[], transitions: DifficultyTransition[]): number {
    return 78 // Mock accuracy percentage
  }

  private calculateAverageTimeToOptimal(transitions: DifficultyTransition[]): number {
    return 2.5 // Mock days to reach optimal difficulty
  }

  private calculateDifficultyStability(transitions: DifficultyTransition[]): number {
    return 85 // Mock stability percentage
  }

  private calculateLearningAcceleration(adaptations: AdaptiveDifficulty[]): number {
    return 1.3 // Mock acceleration factor
  }

  private generateEffectivenessRecommendations(adaptations: AdaptiveDifficulty[], transitions: DifficultyTransition[]): string[] {
    return [
      'Continue using adaptive difficulty for optimal learning',
      'Consider faster adaptation cycles for struggling areas',
      'Maintain current adaptation sensitivity levels'
    ]
  }

  private determineLearningStyle(profile: DifficultyProfile): string {
    if (profile.learningVelocity > 1.3) return 'Fast Learner'
    if (profile.learningVelocity < 0.8) return 'Methodical Learner'
    return 'Balanced Learner'
  }

  private determinePreferredPace(performance: PerformanceSnapshot[]): string {
    const avgSpeed = performance.reduce((sum, p) => sum + p.speed, 0) / performance.length
    if (avgSpeed > 1.5) return 'Fast-paced'
    if (avgSpeed < 0.8) return 'Deliberate'
    return 'Moderate'
  }

  private analyzeDifficultyPreferences(adaptations: AdaptiveDifficulty[]): any {
    return {
      preferredDifficulty: 'medium',
      difficultyTolerance: 'high',
      adaptationRate: 'moderate'
    }
  }

  private analyzePerformancePatterns(performance: PerformanceSnapshot[]): any {
    return {
      consistencyLevel: 'high',
      improvementRate: 'steady',
      preferredSessionLength: 'medium'
    }
  }

  private identifyOptimalConditions(performance: PerformanceSnapshot[]): any {
    return {
      optimalTimeOfDay: 'morning',
      optimalSessionDuration: '20-30 minutes',
      optimalDifficultyProgression: 'gradual'
    }
  }

  private recommendDifficultyStrategy(profile: DifficultyProfile, adaptations: AdaptiveDifficulty[]): string {
    if (profile.learningVelocity > 1.3) {
      return 'Aggressive progression with frequent difficulty increases'
    }
    return 'Steady progression with emphasis on mastery before advancement'
  }

  private generatePersonalizationTips(profile: DifficultyProfile, performance: PerformanceSnapshot[]): string[] {
    return [
      'Focus on your strongest subjects for confidence building',
      'Use shorter sessions for challenging topics',
      'Take breaks when frustration levels rise'
    ]
  }

  private suggestNextSteps(profile: DifficultyProfile, adaptations: AdaptiveDifficulty[]): string[] {
    return [
      'Continue with adaptive difficulty system',
      'Monitor performance trends weekly',
      'Adjust learning pace based on upcoming exams'
    ]
  }
}