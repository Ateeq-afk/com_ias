import {
  PlanStrategy,
  UserProfile,
  StudyPlan,
  PlanGeneratorConfig,
  StudyPhase,
  DailySchedule,
  StudySession,
  WeeklyTarget,
  MonthlyMilestone
} from '../types'
import { SubjectArea } from '../../question-generator/types'

export class PlanStrategyManager {
  
  private strategies: Map<PlanStrategy, StrategyImplementation> = new Map()
  
  constructor() {
    this.initializeStrategies()
  }

  getStrategyForUser(userProfile: UserProfile): PlanStrategy {
    console.log('🎯 Selecting optimal strategy for user profile...')
    
    // Smart strategy selection algorithm
    const score = this.calculateStrategyScores(userProfile)
    const bestStrategy = Object.entries(score).reduce((best, [strategy, points]) => 
      points > best.points ? { strategy: strategy as PlanStrategy, points } : best,
      { strategy: 'Standard' as PlanStrategy, points: 0 }
    )
    
    console.log(`📋 Selected Strategy: ${bestStrategy.strategy} (Score: ${bestStrategy.points})`)
    return bestStrategy.strategy
  }

  async customizeStrategyForUser(
    strategy: PlanStrategy,
    userProfile: UserProfile,
    config: PlanGeneratorConfig
  ): Promise<StrategyImplementation> {
    const baseStrategy = this.strategies.get(strategy)!
    
    // Apply user-specific customizations
    const customizedStrategy = await this.applyUserCustomizations(baseStrategy, userProfile, config)
    
    return customizedStrategy
  }

  getStrategyDetails(strategy: PlanStrategy): StrategyDetails {
    const details: Record<PlanStrategy, StrategyDetails> = {
      FastTrack: {
        name: 'FastTrack',
        description: 'Intensive 8-10 month preparation for experienced candidates',
        duration: 300,
        dailyHours: 8,
        intensity: 'High',
        targetAudience: ['Repeaters', 'Advanced learners', 'Full-time aspirants'],
        phases: ['Foundation (30%)', 'Intermediate (25%)', 'Advanced (25%)', 'Revision (10%)', 'Mock Tests (10%)'],
        mockTestFrequency: 'Weekly',
        revisionCycles: 6,
        specialFeatures: ['Accelerated syllabus coverage', 'Intensive practice sessions', 'Frequent assessments']
      },
      Standard: {
        name: 'Standard',
        description: 'Comprehensive 12-14 month preparation for most candidates',
        duration: 420,
        dailyHours: 6,
        intensity: 'Moderate',
        targetAudience: ['Fresh graduates', 'Working professionals', 'Intermediate learners'],
        phases: ['Foundation (35%)', 'Intermediate (30%)', 'Advanced (20%)', 'Revision (10%)', 'Mock Tests (5%)'],
        mockTestFrequency: 'Bi-weekly',
        revisionCycles: 8,
        specialFeatures: ['Balanced approach', 'Gradual difficulty progression', 'Flexible scheduling']
      },
      Extended: {
        name: 'Extended',
        description: 'Relaxed 16-18 month preparation for working professionals',
        duration: 540,
        dailyHours: 4,
        intensity: 'Low',
        targetAudience: ['Working professionals', 'Part-time students', 'Beginners'],
        phases: ['Foundation (40%)', 'Intermediate (30%)', 'Advanced (20%)', 'Revision (8%)', 'Mock Tests (2%)'],
        mockTestFrequency: 'Monthly',
        revisionCycles: 10,
        specialFeatures: ['Flexible timing', 'Stress-free preparation', 'Work-life balance']
      },
      RevisionOnly: {
        name: 'RevisionOnly',
        description: 'Intensive 3-4 month revision for well-prepared candidates',
        duration: 120,
        dailyHours: 8,
        intensity: 'Very High',
        targetAudience: ['Advanced repeaters', 'Well-prepared candidates'],
        phases: ['Intensive Revision (70%)', 'Mock Tests (30%)'],
        mockTestFrequency: 'Twice weekly',
        revisionCycles: 4,
        specialFeatures: ['Pure revision focus', 'Maximum practice tests', 'Weakness targeting']
      },
      MainsFocused: {
        name: 'MainsFocused',
        description: 'Specialized 6 month Mains preparation after Prelims',
        duration: 180,
        dailyHours: 7,
        intensity: 'High',
        targetAudience: ['Prelims qualified candidates'],
        phases: ['Mains Foundation (40%)', 'Answer Writing (35%)', 'Mock Tests (25%)'],
        mockTestFrequency: 'Bi-weekly',
        revisionCycles: 3,
        specialFeatures: ['Answer writing focus', 'Essay practice', 'GS paper specialization']
      },
      SubjectWise: {
        name: 'SubjectWise',
        description: 'Subject-by-subject mastery approach over 15 months',
        duration: 450,
        dailyHours: 6,
        intensity: 'Moderate',
        targetAudience: ['Systematic learners', 'Subject weakness candidates'],
        phases: ['Subject Mastery Blocks (80%)', 'Integration (15%)', 'Mock Tests (5%)'],
        mockTestFrequency: 'Subject-specific',
        revisionCycles: 7,
        specialFeatures: ['Deep subject mastery', 'Sequential learning', 'Milestone-based progress']
      },
      Integrated: {
        name: 'Integrated',
        description: 'Holistic 14 month preparation with cross-subject integration',
        duration: 420,
        dailyHours: 7,
        intensity: 'Moderate-High',
        targetAudience: ['Analytical learners', 'Interconnected thinking preference'],
        phases: ['Foundation (30%)', 'Integration (40%)', 'Application (20%)', 'Mock Tests (10%)'],
        mockTestFrequency: 'Weekly',
        revisionCycles: 6,
        specialFeatures: ['Cross-subject connections', 'Thematic learning', 'Current affairs integration']
      }
    }
    
    return details[strategy]
  }

  private initializeStrategies(): void {
    // FastTrack Strategy
    this.strategies.set('FastTrack', {
      name: 'FastTrack',
      calculateTimeline: (userProfile) => ({
        totalDays: userProfile.background === 'Repeater' ? 240 : 300,
        phases: [
          { phase: 'Foundation', percentage: 30, intensity: 'High' },
          { phase: 'Intermediate', percentage: 25, intensity: 'High' },
          { phase: 'Advanced', percentage: 25, intensity: 'Very High' },
          { phase: 'Revision', percentage: 10, intensity: 'Very High' },
          { phase: 'Mock Test Phase', percentage: 10, intensity: 'Maximum' }
        ],
        dailyHours: 8
      }),
      generateDailySchedule: this.generateFastTrackSchedule.bind(this),
      getSubjectAllocation: this.getFastTrackSubjectAllocation.bind(this),
      getMockTestSchedule: this.getFastTrackMockTestSchedule.bind(this)
    })

    // Standard Strategy
    this.strategies.set('Standard', {
      name: 'Standard',
      calculateTimeline: (userProfile) => ({
        totalDays: userProfile.background === 'Working' ? 420 : 365,
        phases: [
          { phase: 'Foundation', percentage: 35, intensity: 'Moderate' },
          { phase: 'Intermediate', percentage: 30, intensity: 'Moderate' },
          { phase: 'Advanced', percentage: 20, intensity: 'High' },
          { phase: 'Revision', percentage: 10, intensity: 'High' },
          { phase: 'Mock Test Phase', percentage: 5, intensity: 'Very High' }
        ],
        dailyHours: userProfile.background === 'Working' ? 5 : 6
      }),
      generateDailySchedule: this.generateStandardSchedule.bind(this),
      getSubjectAllocation: this.getStandardSubjectAllocation.bind(this),
      getMockTestSchedule: this.getStandardMockTestSchedule.bind(this)
    })

    // Extended Strategy
    this.strategies.set('Extended', {
      name: 'Extended',
      calculateTimeline: (userProfile) => ({
        totalDays: 540,
        phases: [
          { phase: 'Foundation', percentage: 40, intensity: 'Low' },
          { phase: 'Intermediate', percentage: 30, intensity: 'Moderate' },
          { phase: 'Advanced', percentage: 20, intensity: 'Moderate' },
          { phase: 'Revision', percentage: 8, intensity: 'High' },
          { phase: 'Mock Test Phase', percentage: 2, intensity: 'High' }
        ],
        dailyHours: 4
      }),
      generateDailySchedule: this.generateExtendedSchedule.bind(this),
      getSubjectAllocation: this.getExtendedSubjectAllocation.bind(this),
      getMockTestSchedule: this.getExtendedMockTestSchedule.bind(this)
    })

    // RevisionOnly Strategy
    this.strategies.set('RevisionOnly', {
      name: 'RevisionOnly',
      calculateTimeline: (userProfile) => ({
        totalDays: 120,
        phases: [
          { phase: 'Revision', percentage: 70, intensity: 'Very High' },
          { phase: 'Mock Test Phase', percentage: 30, intensity: 'Maximum' }
        ],
        dailyHours: 8
      }),
      generateDailySchedule: this.generateRevisionOnlySchedule.bind(this),
      getSubjectAllocation: this.getRevisionOnlySubjectAllocation.bind(this),
      getMockTestSchedule: this.getRevisionOnlyMockTestSchedule.bind(this)
    })

    // MainsFocused Strategy
    this.strategies.set('MainsFocused', {
      name: 'MainsFocused',
      calculateTimeline: (userProfile) => ({
        totalDays: 180,
        phases: [
          { phase: 'Advanced', percentage: 40, intensity: 'High' },
          { phase: 'Revision', percentage: 35, intensity: 'Very High' },
          { phase: 'Mock Test Phase', percentage: 25, intensity: 'Maximum' }
        ],
        dailyHours: 7
      }),
      generateDailySchedule: this.generateMainsFocusedSchedule.bind(this),
      getSubjectAllocation: this.getMainsFocusedSubjectAllocation.bind(this),
      getMockTestSchedule: this.getMainsFocusedMockTestSchedule.bind(this)
    })

    // SubjectWise Strategy
    this.strategies.set('SubjectWise', {
      name: 'SubjectWise',
      calculateTimeline: (userProfile) => ({
        totalDays: 450,
        phases: [
          { phase: 'Foundation', percentage: 80, intensity: 'Moderate' },
          { phase: 'Intermediate', percentage: 15, intensity: 'High' },
          { phase: 'Mock Test Phase', percentage: 5, intensity: 'High' }
        ],
        dailyHours: 6
      }),
      generateDailySchedule: this.generateSubjectWiseSchedule.bind(this),
      getSubjectAllocation: this.getSubjectWiseSubjectAllocation.bind(this),
      getMockTestSchedule: this.getSubjectWiseMockTestSchedule.bind(this)
    })

    // Integrated Strategy
    this.strategies.set('Integrated', {
      name: 'Integrated',
      calculateTimeline: (userProfile) => ({
        totalDays: 420,
        phases: [
          { phase: 'Foundation', percentage: 30, intensity: 'Moderate' },
          { phase: 'Intermediate', percentage: 40, intensity: 'High' },
          { phase: 'Advanced', percentage: 20, intensity: 'High' },
          { phase: 'Mock Test Phase', percentage: 10, intensity: 'Very High' }
        ],
        dailyHours: 7
      }),
      generateDailySchedule: this.generateIntegratedSchedule.bind(this),
      getSubjectAllocation: this.getIntegratedSubjectAllocation.bind(this),
      getMockTestSchedule: this.getIntegratedMockTestSchedule.bind(this)
    })
  }

  private calculateStrategyScores(userProfile: UserProfile): Record<PlanStrategy, number> {
    const scores: Record<PlanStrategy, number> = {
      FastTrack: 0,
      Standard: 0,
      Extended: 0,
      RevisionOnly: 0,
      MainsFocused: 0,
      SubjectWise: 0,
      Integrated: 0
    }

    // Background scoring
    switch (userProfile.background) {
      case 'Repeater':
        scores.FastTrack += 25
        scores.RevisionOnly += 30
        scores.MainsFocused += 20
        break
      case 'Working':
        scores.Extended += 30
        scores.Standard += 20
        break
      case 'Fresher':
        scores.Standard += 25
        scores.Extended += 15
        scores.Integrated += 20
        break
      case 'Dropper':
        scores.Standard += 20
        scores.FastTrack += 15
        scores.SubjectWise += 25
        break
    }

    // Available hours scoring
    switch (userProfile.availableHours) {
      case '8+':
        scores.FastTrack += 20
        scores.RevisionOnly += 25
        scores.MainsFocused += 15
        break
      case '6-8':
        scores.Standard += 20
        scores.Integrated += 15
        scores.SubjectWise += 10
        break
      case '4-6':
        scores.Extended += 25
        scores.Standard += 10
        break
      case '2-4':
        scores.Extended += 30
        break
    }

    // Knowledge level scoring
    switch (userProfile.currentKnowledgeLevel) {
      case 'Advanced':
        scores.RevisionOnly += 25
        scores.FastTrack += 20
        scores.MainsFocused += 15
        break
      case 'Intermediate':
        scores.Standard += 20
        scores.Integrated += 15
        scores.FastTrack += 10
        break
      case 'Beginner':
        scores.Extended += 20
        scores.Standard += 15
        scores.SubjectWise += 25
        break
    }

    // Learning style scoring
    switch (userProfile.learningStyle) {
      case 'Practice-heavy':
        scores.FastTrack += 15
        scores.RevisionOnly += 20
        break
      case 'Visual':
        scores.Integrated += 15
        scores.Standard += 10
        break
      case 'Reading':
        scores.Extended += 10
        scores.SubjectWise += 15
        break
      case 'Mixed':
        scores.Standard += 10
        scores.Integrated += 15
        break
    }

    // Target exam year scoring
    const targetYear = parseInt(userProfile.targetExam)
    const currentYear = new Date().getFullYear()
    const yearsRemaining = targetYear - currentYear

    if (yearsRemaining <= 1) {
      scores.FastTrack += 15
      scores.RevisionOnly += 20
    } else if (yearsRemaining <= 2) {
      scores.Standard += 15
      scores.Integrated += 10
    } else {
      scores.Extended += 15
      scores.SubjectWise += 10
    }

    // Weakness count scoring
    if (userProfile.weaknesses.length > 4) {
      scores.SubjectWise += 20
      scores.Extended += 15
    } else if (userProfile.weaknesses.length < 2) {
      scores.FastTrack += 15
      scores.RevisionOnly += 10
    }

    return scores
  }

  private async applyUserCustomizations(
    baseStrategy: StrategyImplementation,
    userProfile: UserProfile,
    config: PlanGeneratorConfig
  ): Promise<StrategyImplementation> {
    const customized = { ...baseStrategy }

    // Apply priority subjects
    if (config.customizations?.prioritySubjects) {
      customized.getSubjectAllocation = (userProfile) => {
        const allocation = baseStrategy.getSubjectAllocation(userProfile)
        
        // Increase allocation for priority subjects
        config.customizations!.prioritySubjects!.forEach(subject => {
          if (allocation[subject]) {
            allocation[subject] *= 1.3 // 30% more time
          }
        })
        
        return this.normalizeAllocation(allocation)
      }
    }

    // Apply special goals
    if (config.customizations?.specialGoals) {
      // Modify timeline to accommodate special goals
      const originalTimeline = baseStrategy.calculateTimeline(userProfile)
      customized.calculateTimeline = (userProfile) => {
        const timeline = originalTimeline
        
        // Add buffer time for special goals
        timeline.totalDays += config.customizations!.specialGoals!.length * 7
        
        return timeline
      }
    }

    return customized
  }

  // Strategy-specific schedule generators
  private generateFastTrackSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 8,
      dailyGoals: [
        'Complete intensive study sessions',
        'Practice high-volume questions',
        'Maintain accelerated pace'
      ]
    }
  }

  private generateStandardSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: userProfile.background === 'Working' ? 5 : 6,
      dailyGoals: [
        'Complete planned syllabus portion',
        'Practice moderate question sets',
        'Maintain study consistency'
      ]
    }
  }

  private generateExtendedSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 4,
      dailyGoals: [
        'Complete relaxed study sessions',
        'Focus on understanding over speed',
        'Maintain work-life balance'
      ]
    }
  }

  private generateRevisionOnlySchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 8,
      dailyGoals: [
        'Intensive revision of all subjects',
        'Practice maximum mock tests',
        'Target weak areas aggressively'
      ]
    }
  }

  private generateMainsFocusedSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 7,
      dailyGoals: [
        'Focus on answer writing skills',
        'Practice essay and GS papers',
        'Develop Mains-specific strategy'
      ]
    }
  }

  private generateSubjectWiseSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 6,
      dailyGoals: [
        'Deep dive into single subject',
        'Master subject fundamentals',
        'Complete subject milestones'
      ]
    }
  }

  private generateIntegratedSchedule(userProfile: UserProfile, phase: StudyPhase, dayIndex: number): Partial<DailySchedule> {
    return {
      totalPlannedHours: 7,
      dailyGoals: [
        'Connect cross-subject themes',
        'Practice integrated questions',
        'Develop holistic understanding'
      ]
    }
  }

  // Subject allocation methods for each strategy
  private getFastTrackSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    return {
      'Polity': 20,
      'History': 15,
      'Geography': 15,
      'Economy': 20,
      'Environment': 10,
      'Science & Technology': 10,
      'Current Affairs': 10
    }
  }

  private getStandardSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    return {
      'Polity': 18,
      'History': 16,
      'Geography': 14,
      'Economy': 18,
      'Environment': 12,
      'Science & Technology': 10,
      'Current Affairs': 12
    }
  }

  private getExtendedSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    return {
      'Polity': 16,
      'History': 18,
      'Geography': 16,
      'Economy': 16,
      'Environment': 12,
      'Science & Technology': 10,
      'Current Affairs': 12
    }
  }

  private getRevisionOnlySubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    // Focus on weak areas
    const allocation: Record<SubjectArea, number> = {
      'Polity': 10,
      'History': 10,
      'Geography': 10,
      'Economy': 10,
      'Environment': 10,
      'Science & Technology': 10,
      'Current Affairs': 40 // Heavy current affairs focus
    }

    // Increase allocation for weak subjects
    userProfile.weaknesses.forEach(weakness => {
      allocation[weakness.subject] += 10
    })

    return this.normalizeAllocation(allocation)
  }

  private getMainsFocusedSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    return {
      'Polity': 25, // Heavy GS2 focus
      'History': 20, // GS1 focus
      'Geography': 15, // GS1 focus  
      'Economy': 20, // GS3 focus
      'Environment': 10, // GS3 focus
      'Science & Technology': 5, // Minimal for Mains
      'Current Affairs': 5 // Integrated approach
    }
  }

  private getSubjectWiseSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    // Rotate subjects with deep focus
    const subjects = ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science & Technology', 'Current Affairs']
    const allocation: Record<SubjectArea, number> = {} as Record<SubjectArea, number>
    
    subjects.forEach((subject, index) => {
      allocation[subject as SubjectArea] = index === 0 ? 70 : 5 // 70% on current subject, 5% maintenance on others
    })

    return allocation
  }

  private getIntegratedSubjectAllocation(userProfile: UserProfile): Record<SubjectArea, number> {
    return {
      'Polity': 15,
      'History': 15,
      'Geography': 15,
      'Economy': 15,
      'Environment': 15,
      'Science & Technology': 10,
      'Current Affairs': 15 // Equal emphasis for integration
    }
  }

  // Mock test schedules for each strategy
  private getFastTrackMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 7, // Weekly
      focus: ['Speed building', 'All subjects coverage', 'Time management']
    }
  }

  private getStandardMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 14, // Bi-weekly
      focus: ['Gradual improvement', 'Subject balance', 'Accuracy building']
    }
  }

  private getExtendedMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 30, // Monthly
      focus: ['Stress-free practice', 'Concept application', 'Confidence building']
    }
  }

  private getRevisionOnlyMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 4, // Twice weekly
      focus: ['Maximum practice', 'Weak area targeting', 'Final strategy']
    }
  }

  private getMainsFocusedMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 14, // Bi-weekly
      focus: ['Answer writing', 'GS papers', 'Essay practice']
    }
  }

  private getSubjectWiseMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 21, // Subject completion based
      focus: ['Subject mastery', 'Milestone assessment', 'Integration practice']
    }
  }

  private getIntegratedMockTestSchedule(): { frequency: number; focus: string[] } {
    return {
      frequency: 10, // Every 10 days
      focus: ['Cross-subject integration', 'Thematic practice', 'Holistic assessment']
    }
  }

  private normalizeAllocation(allocation: Record<SubjectArea, number>): Record<SubjectArea, number> {
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0)
    const normalized: Record<SubjectArea, number> = {} as Record<SubjectArea, number>
    
    Object.entries(allocation).forEach(([subject, value]) => {
      normalized[subject as SubjectArea] = (value / total) * 100
    })
    
    return normalized
  }
}

// Type definitions
interface StrategyImplementation {
  name: string
  calculateTimeline: (userProfile: UserProfile) => {
    totalDays: number
    phases: Array<{
      phase: StudyPhase
      percentage: number
      intensity: string
    }>
    dailyHours: number
  }
  generateDailySchedule: (userProfile: UserProfile, phase: StudyPhase, dayIndex: number) => Partial<DailySchedule>
  getSubjectAllocation: (userProfile: UserProfile) => Record<SubjectArea, number>
  getMockTestSchedule: () => { frequency: number; focus: string[] }
}

interface StrategyDetails {
  name: string
  description: string
  duration: number
  dailyHours: number
  intensity: string
  targetAudience: string[]
  phases: string[]
  mockTestFrequency: string
  revisionCycles: number
  specialFeatures: string[]
}