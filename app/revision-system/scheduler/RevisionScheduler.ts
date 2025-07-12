import {
  RevisionScheduler,
  RevisionSchedule,
  RevisionSession,
  RevisionItem,
  RevisionSessionType,
  ScheduledSession,
  ScheduleAdjustment
} from '../types'
import { UPSCSpacedRepetitionEngine } from '../engine/SpacedRepetitionEngine'
import { UPSCContentTracker } from '../tracking/ContentTracker'

export class UPSCRevisionScheduler implements RevisionScheduler {
  
  private spacedRepetitionEngine: UPSCSpacedRepetitionEngine
  private contentTracker: UPSCContentTracker
  private userPreferences: Map<string, any> = new Map()

  constructor() {
    this.spacedRepetitionEngine = new UPSCSpacedRepetitionEngine()
    this.contentTracker = new UPSCContentTracker()
  }

  async generateDailySchedule(userId: string, date: Date): Promise<RevisionSchedule> {
    console.log(`📅 Generating daily revision schedule for ${userId} on ${date.toDateString()}`)
    
    // Get revision items due for today
    const dueItems = await this.spacedRepetitionEngine.getBatchForRevision(userId, date)
    
    // Get user preferences
    const preferences = await this.getUserPreferences(userId)
    
    // Create different session types
    const sessions = await this.createDailySessions(dueItems, preferences, date)
    
    // Calculate total time and priority
    const totalTime = sessions.reduce((sum, session) => sum + session.estimatedDuration, 0)
    const priority = this.calculateSchedulePriority(dueItems)
    
    const schedule: RevisionSchedule = {
      userId,
      date,
      sessions,
      totalTime,
      priority,
      flexibility: preferences.flexibility || 50,
      completed: false,
      adjustments: []
    }
    
    console.log(`✅ Generated schedule with ${sessions.length} sessions, total time: ${totalTime} minutes`)
    
    return schedule
  }

  async getRevisionQueue(userId: string): Promise<RevisionItem[]> {
    console.log(`📋 Getting revision queue for user ${userId}`)
    
    const now = new Date()
    const items = await this.spacedRepetitionEngine.getBatchForRevision(userId, now)
    
    // Get upcoming items (next 7 days)
    const upcoming = await this.getUpcomingItems(userId, 7)
    
    // Combine and sort by priority
    const allItems = [...items, ...upcoming]
    const sortedItems = this.sortByUrgencyAndImportance(allItems)
    
    console.log(`📊 Queue contains ${sortedItems.length} items`)
    
    return sortedItems
  }

  async scheduleSession(
    userId: string, 
    sessionType: RevisionSessionType, 
    items: RevisionItem[]
  ): Promise<RevisionSession> {
    console.log(`🎯 Scheduling ${sessionType} session with ${items.length} items`)
    
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    
    // Estimate duration based on session type and items
    const estimatedDuration = this.estimateSessionDuration(sessionType, items)
    
    const session: RevisionSession = {
      id: sessionId,
      userId,
      sessionType,
      scheduledDate: now,
      duration: estimatedDuration,
      items: items.map(item => ({
        revisionItemId: item.id,
        format: this.selectOptimalFormat(item, sessionType),
        startTime: now,
        response: {
          answer: '',
          confidence: 3,
          timeSpent: 0,
          hintsUsed: 0,
          selfRating: 'Good'
        },
        performance: {
          accuracy: 0,
          speed: 0,
          retention: 0,
          improvement: 0
        }
      })),
      performance: {
        overallAccuracy: 0,
        averageSpeed: 0,
        completionRate: 0,
        retentionScore: 0,
        timeEfficiency: 0,
        strugglingItems: [],
        masteredItems: []
      },
      completed: false
    }
    
    console.log(`✅ Session scheduled: ${sessionId}, duration: ${estimatedDuration} minutes`)
    
    return session
  }

  async adjustScheduleForMissed(userId: string, missedSessions: string[]): Promise<RevisionSchedule> {
    console.log(`🔄 Adjusting schedule for ${missedSessions.length} missed sessions`)
    
    const today = new Date()
    const currentSchedule = await this.generateDailySchedule(userId, today)
    
    // Get items from missed sessions
    const missedItems = await this.getItemsFromMissedSessions(userId, missedSessions)
    
    // Prioritize missed items
    const prioritizedItems = this.prioritizeMissedItems(missedItems)
    
    // Create catch-up sessions
    const catchUpSessions = await this.createCatchUpSessions(prioritizedItems, today)
    
    // Integrate with existing schedule
    const adjustedSessions = this.integrateSessionsWithExisting(currentSchedule.sessions, catchUpSessions)
    
    // Create adjustment records
    const adjustments: ScheduleAdjustment[] = missedSessions.map(sessionId => ({
      reason: `Catch-up for missed session: ${sessionId}`,
      originalTime: 'N/A',
      newTime: catchUpSessions[0]?.startTime || 'TBD',
      impact: 'Added catch-up sessions',
      automatic: true,
      timestamp: new Date()
    }))
    
    const adjustedSchedule: RevisionSchedule = {
      ...currentSchedule,
      sessions: adjustedSessions,
      totalTime: adjustedSessions.reduce((sum, session) => sum + session.estimatedDuration, 0),
      adjustments: [...currentSchedule.adjustments, ...adjustments]
    }
    
    console.log(`✅ Schedule adjusted with ${catchUpSessions.length} catch-up sessions`)
    
    return adjustedSchedule
  }

  async optimizeScheduleForExam(userId: string, examDate: Date): Promise<RevisionSchedule[]> {
    console.log(`🎯 Optimizing revision schedule for exam on ${examDate.toDateString()}`)
    
    const daysUntilExam = Math.floor((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExam <= 0) {
      throw new Error('Exam date is in the past or today')
    }
    
    // Get all revision items
    const allItems = await this.getAllUserRevisionItems(userId)
    
    // Create exam-optimized schedule
    const schedules: RevisionSchedule[] = []
    
    for (let day = 0; day < daysUntilExam; day++) {
      const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000)
      const dailySchedule = await this.createExamOptimizedDailySchedule(
        userId, 
        date, 
        allItems, 
        examDate, 
        day
      )
      schedules.push(dailySchedule)
    }
    
    console.log(`✅ Created exam-optimized schedule for ${daysUntilExam} days`)
    
    return schedules
  }

  // Advanced scheduling methods
  async createIntensiveRevisionPlan(userId: string, subjects: string[], days: number): Promise<RevisionSchedule[]> {
    console.log(`🚀 Creating intensive revision plan for ${subjects.join(', ')} over ${days} days`)
    
    const schedules: RevisionSchedule[] = []
    const intensiveItems = await this.getItemsForSubjects(userId, subjects)
    
    // Distribute items across days with high intensity
    const itemsPerDay = Math.ceil(intensiveItems.length / days)
    
    for (let day = 0; day < days; day++) {
      const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000)
      const dayItems = intensiveItems.slice(day * itemsPerDay, (day + 1) * itemsPerDay)
      
      const intensiveSchedule = await this.createIntensiveDaySchedule(userId, date, dayItems)
      schedules.push(intensiveSchedule)
    }
    
    return schedules
  }

  async createWeakAreaFocusedSchedule(userId: string, weakAreas: string[]): Promise<RevisionSchedule> {
    console.log(`🎯 Creating weak area focused schedule for: ${weakAreas.join(', ')}`)
    
    const today = new Date()
    const weakAreaItems = await this.getWeakAreaItems(userId, weakAreas)
    
    // Create focused sessions
    const focusedSessions = await this.createWeakAreaSessions(weakAreaItems, today)
    
    return {
      userId,
      date: today,
      sessions: focusedSessions,
      totalTime: focusedSessions.reduce((sum, session) => sum + session.estimatedDuration, 0),
      priority: 'High',
      flexibility: 20, // Low flexibility for weak area focus
      completed: false,
      adjustments: []
    }
  }

  async createPreExamRevisionSchedule(userId: string, examDate: Date, intensiveDays: number = 7): Promise<RevisionSchedule[]> {
    console.log(`⚡ Creating pre-exam intensive revision for ${intensiveDays} days before exam`)
    
    const schedules: RevisionSchedule[] = []
    const startDate = new Date(examDate.getTime() - intensiveDays * 24 * 60 * 60 * 1000)
    
    // Get high-priority items
    const criticalItems = await this.getCriticalItemsForExam(userId)
    
    for (let day = 0; day < intensiveDays; day++) {
      const date = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000)
      const preExamSchedule = await this.createPreExamDaySchedule(userId, date, criticalItems, day, intensiveDays)
      schedules.push(preExamSchedule)
    }
    
    return schedules
  }

  // Private helper methods
  private async createDailySessions(
    items: RevisionItem[], 
    preferences: any, 
    date: Date
  ): Promise<ScheduledSession[]> {
    const sessions: ScheduledSession[] = []
    
    if (items.length === 0) {
      return sessions
    }
    
    // Morning revision (30 minutes)
    const morningItems = this.selectItemsForSession(items, 'MorningRevision', 30)
    if (morningItems.length > 0) {
      sessions.push({
        sessionId: `morning-${date.getTime()}`,
        startTime: preferences.morningTime || '07:00',
        endTime: this.addMinutes(preferences.morningTime || '07:00', 30),
        type: 'MorningRevision',
        items: morningItems.map(item => item.id),
        estimatedDuration: 30,
        priority: 3,
        prerequisites: []
      })
    }
    
    // Evening quick recall (15 minutes)
    const eveningItems = this.selectItemsForSession(items, 'EveningRecall', 15)
    if (eveningItems.length > 0) {
      sessions.push({
        sessionId: `evening-${date.getTime()}`,
        startTime: preferences.eveningTime || '20:00',
        endTime: this.addMinutes(preferences.eveningTime || '20:00', 15),
        type: 'EveningRecall',
        items: eveningItems.map(item => item.id),
        estimatedDuration: 15,
        priority: 2
      })
    }
    
    // Weekend comprehensive review (if weekend)
    if (this.isWeekend(date)) {
      const weekendItems = this.selectItemsForSession(items, 'WeekendReview', 60)
      if (weekendItems.length > 0) {
        sessions.push({
          sessionId: `weekend-${date.getTime()}`,
          startTime: preferences.weekendTime || '10:00',
          endTime: this.addMinutes(preferences.weekendTime || '10:00', 60),
          type: 'WeekendReview',
          items: weekendItems.map(item => item.id),
          estimatedDuration: 60,
          priority: 4
        })
      }
    }
    
    // Subject-wise cycles (if due)
    const subjectCycleItems = this.getSubjectCycleItems(items, date)
    if (subjectCycleItems.length > 0) {
      sessions.push({
        sessionId: `subject-cycle-${date.getTime()}`,
        startTime: preferences.studyTime || '16:00',
        endTime: this.addMinutes(preferences.studyTime || '16:00', 45),
        type: 'SubjectCycle',
        items: subjectCycleItems.map(item => item.id),
        estimatedDuration: 45,
        priority: 3
      })
    }
    
    return sessions
  }

  private selectItemsForSession(
    items: RevisionItem[], 
    sessionType: RevisionSessionType, 
    durationMinutes: number
  ): RevisionItem[] {
    // Estimate time per item based on session type
    const timePerItem = sessionType === 'EveningRecall' ? 1 : 
                       sessionType === 'MorningRevision' ? 2 : 3
    
    const maxItems = Math.floor(durationMinutes / timePerItem)
    
    // Select items based on session type
    let selectedItems: RevisionItem[] = []
    
    switch (sessionType) {
      case 'MorningRevision':
        // Focus on difficult items when mind is fresh
        selectedItems = items
          .filter(item => item.difficulty === 'hard' || item.strugglingCount > 0)
          .slice(0, maxItems)
        break
        
      case 'EveningRecall':
        // Quick recall of today's items
        selectedItems = items
          .filter(item => item.masteryLevel === 'Reviewing')
          .slice(0, maxItems)
        break
        
      case 'WeekendReview':
        // Comprehensive review of week's items
        selectedItems = items
          .filter(item => item.repetition >= 2)
          .slice(0, maxItems)
        break
        
      case 'SubjectCycle':
        // Focus on specific subject
        const subjects = [...new Set(items.map(item => item.subject))]
        const focusSubject = subjects[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % subjects.length]
        selectedItems = items
          .filter(item => item.subject === focusSubject)
          .slice(0, maxItems)
        break
        
      default:
        selectedItems = items.slice(0, maxItems)
    }
    
    return selectedItems
  }

  private selectOptimalFormat(item: RevisionItem, sessionType: RevisionSessionType): any {
    // Select format based on item type and session type
    if (item.contentType === 'Date') {
      return 'Timeline'
    }
    
    if (item.contentType === 'Formula') {
      return 'BlankPaper'
    }
    
    if (sessionType === 'EveningRecall') {
      return 'FlashCard'
    }
    
    if (sessionType === 'MorningRevision') {
      return item.difficulty === 'hard' ? 'TeachBack' : 'QuickQuiz'
    }
    
    return 'FlashCard'
  }

  private estimateSessionDuration(sessionType: RevisionSessionType, items: RevisionItem[]): number {
    const baseTimes: Record<RevisionSessionType, number> = {
      'MorningRevision': 30,
      'EveningRecall': 15,
      'WeekendReview': 60,
      'PreTestRevision': 45,
      'SubjectCycle': 45,
      'MixedTopics': 30,
      'WeakAreaFocus': 40,
      'RapidFire': 20,
      'ComprehensiveReview': 90
    }
    
    const baseTime = baseTimes[sessionType] || 30
    const itemAdjustment = Math.min(items.length * 2, 20) // Max 20 minutes adjustment
    
    return baseTime + itemAdjustment
  }

  private calculateSchedulePriority(items: RevisionItem[]): 'High' | 'Medium' | 'Low' {
    const overdueItems = items.filter(item => item.nextRevisionDate < new Date()).length
    const criticalItems = items.filter(item => item.importance === 'Critical').length
    const strugglingItems = items.filter(item => item.strugglingCount > 2).length
    
    if (overdueItems > 5 || criticalItems > 3 || strugglingItems > 2) {
      return 'High'
    }
    
    if (overdueItems > 2 || criticalItems > 1 || strugglingItems > 0) {
      return 'Medium'
    }
    
    return 'Low'
  }

  private async getUpcomingItems(userId: string, days: number): Promise<RevisionItem[]> {
    // Mock implementation - get items due in next X days
    const items = await this.getAllUserRevisionItems(userId)
    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    
    return items.filter(item => 
      item.nextRevisionDate > now && item.nextRevisionDate <= futureDate
    )
  }

  private sortByUrgencyAndImportance(items: RevisionItem[]): RevisionItem[] {
    return items.sort((a, b) => {
      // Primary: Overdue items first
      const now = new Date()
      const aOverdue = a.nextRevisionDate < now ? 1 : 0
      const bOverdue = b.nextRevisionDate < now ? 1 : 0
      if (aOverdue !== bOverdue) return bOverdue - aOverdue
      
      // Secondary: Importance
      const importanceValues = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
      const importanceDiff = importanceValues[b.importance] - importanceValues[a.importance]
      if (importanceDiff !== 0) return importanceDiff
      
      // Tertiary: Struggling count
      const strugglingDiff = b.strugglingCount - a.strugglingCount
      if (strugglingDiff !== 0) return strugglingDiff
      
      // Final: Next revision date (sooner first)
      return a.nextRevisionDate.getTime() - b.nextRevisionDate.getTime()
    })
  }

  private async createExamOptimizedDailySchedule(
    userId: string,
    date: Date,
    allItems: RevisionItem[],
    examDate: Date,
    dayNumber: number
  ): Promise<RevisionSchedule> {
    const daysUntilExam = Math.floor((examDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    // Filter items that should be reviewed based on exam proximity
    const relevantItems = allItems.filter(item => {
      const optimalRevisionDate = new Date(examDate.getTime() - item.interval * 24 * 60 * 60 * 1000)
      return Math.abs(date.getTime() - optimalRevisionDate.getTime()) < (3 * 24 * 60 * 60 * 1000) // Within 3 days
    })
    
    // Create exam-focused sessions
    const sessions: ScheduledSession[] = []
    
    // Morning intensive session
    const morningItems = relevantItems
      .filter(item => item.importance === 'Critical' || item.importance === 'High')
      .slice(0, 15)
    
    if (morningItems.length > 0) {
      sessions.push({
        sessionId: `exam-morning-${date.getTime()}`,
        startTime: '06:00',
        endTime: '07:30',
        type: 'ComprehensiveReview',
        items: morningItems.map(item => item.id),
        estimatedDuration: 90,
        priority: 5
      })
    }
    
    // Evening consolidation
    const eveningItems = relevantItems
      .filter(item => !morningItems.includes(item))
      .slice(0, 20)
    
    if (eveningItems.length > 0) {
      sessions.push({
        sessionId: `exam-evening-${date.getTime()}`,
        startTime: '19:00',
        endTime: '20:00',
        type: 'RapidFire',
        items: eveningItems.map(item => item.id),
        estimatedDuration: 60,
        priority: 4
      })
    }
    
    return {
      userId,
      date,
      sessions,
      totalTime: sessions.reduce((sum, session) => sum + session.estimatedDuration, 0),
      priority: daysUntilExam <= 3 ? 'High' : 'Medium',
      flexibility: Math.max(10, 50 - (10 - daysUntilExam) * 5), // Less flexibility as exam approaches
      completed: false,
      adjustments: []
    }
  }

  // Additional helper methods
  private async getUserPreferences(userId: string): Promise<any> {
    return this.userPreferences.get(userId) || {
      morningTime: '07:00',
      eveningTime: '20:00',
      weekendTime: '10:00',
      studyTime: '16:00',
      flexibility: 50,
      maxDailyRevisionTime: 120
    }
  }

  private async getAllUserRevisionItems(userId: string): Promise<RevisionItem[]> {
    // Mock implementation - would fetch from database
    return []
  }

  private async getItemsFromMissedSessions(userId: string, sessionIds: string[]): Promise<RevisionItem[]> {
    // Mock implementation
    return []
  }

  private prioritizeMissedItems(items: RevisionItem[]): RevisionItem[] {
    return items.sort((a, b) => {
      // Prioritize by importance and struggling count
      const importanceValues = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
      const importanceDiff = importanceValues[b.importance] - importanceValues[a.importance]
      if (importanceDiff !== 0) return importanceDiff
      
      return b.strugglingCount - a.strugglingCount
    })
  }

  private async createCatchUpSessions(items: RevisionItem[], date: Date): Promise<ScheduledSession[]> {
    const sessions: ScheduledSession[] = []
    
    if (items.length === 0) return sessions
    
    // Create focused catch-up session
    sessions.push({
      sessionId: `catchup-${date.getTime()}`,
      startTime: '21:00',
      endTime: '21:30',
      type: 'WeakAreaFocus',
      items: items.slice(0, 15).map(item => item.id),
      estimatedDuration: 30,
      priority: 5
    })
    
    return sessions
  }

  private integrateSessionsWithExisting(
    existingSessions: ScheduledSession[], 
    newSessions: ScheduledSession[]
  ): ScheduledSession[] {
    // Simple integration - add new sessions if no conflicts
    const integrated = [...existingSessions]
    
    newSessions.forEach(newSession => {
      const hasConflict = integrated.some(session => 
        this.hasTimeConflict(session, newSession)
      )
      
      if (!hasConflict) {
        integrated.push(newSession)
      }
    })
    
    return integrated.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  private hasTimeConflict(session1: ScheduledSession, session2: ScheduledSession): boolean {
    const start1 = this.timeToMinutes(session1.startTime)
    const end1 = this.timeToMinutes(session1.endTime)
    const start2 = this.timeToMinutes(session2.startTime)
    const end2 = this.timeToMinutes(session2.endTime)
    
    return (start1 < end2 && end1 > start2)
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private addMinutes(time: string, minutes: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutes
    const hours = Math.floor(totalMinutes / 60) % 24
    const mins = totalMinutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  private getSubjectCycleItems(items: RevisionItem[], date: Date): RevisionItem[] {
    // Get items for subject cycle based on day of week
    const dayOfWeek = date.getDay()
    const subjects = ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science & Technology', 'Current Affairs']
    const subjectIndex = dayOfWeek % subjects.length
    const focusSubject = subjects[subjectIndex]
    
    return items.filter(item => item.subject === focusSubject).slice(0, 15)
  }

  private async getItemsForSubjects(userId: string, subjects: string[]): Promise<RevisionItem[]> {
    const allItems = await this.getAllUserRevisionItems(userId)
    return allItems.filter(item => subjects.includes(item.subject))
  }

  private async createIntensiveDaySchedule(
    userId: string, 
    date: Date, 
    items: RevisionItem[]
  ): Promise<RevisionSchedule> {
    const sessions: ScheduledSession[] = []
    
    // Morning intensive session (2 hours)
    const morningItems = items.slice(0, Math.floor(items.length / 2))
    sessions.push({
      sessionId: `intensive-morning-${date.getTime()}`,
      startTime: '06:00',
      endTime: '08:00',
      type: 'ComprehensiveReview',
      items: morningItems.map(item => item.id),
      estimatedDuration: 120,
      priority: 5
    })
    
    // Evening intensive session (1.5 hours)
    const eveningItems = items.slice(Math.floor(items.length / 2))
    sessions.push({
      sessionId: `intensive-evening-${date.getTime()}`,
      startTime: '18:00',
      endTime: '19:30',
      type: 'WeakAreaFocus',
      items: eveningItems.map(item => item.id),
      estimatedDuration: 90,
      priority: 4
    })
    
    return {
      userId,
      date,
      sessions,
      totalTime: 210, // 3.5 hours
      priority: 'High',
      flexibility: 10, // Low flexibility for intensive mode
      completed: false,
      adjustments: []
    }
  }

  private async getWeakAreaItems(userId: string, weakAreas: string[]): Promise<RevisionItem[]> {
    const allItems = await this.getAllUserRevisionItems(userId)
    return allItems.filter(item => 
      weakAreas.includes(item.subject) || 
      weakAreas.includes(item.topic) ||
      item.strugglingCount > 1
    )
  }

  private async createWeakAreaSessions(items: RevisionItem[], date: Date): Promise<ScheduledSession[]> {
    const sessions: ScheduledSession[] = []
    
    // Create multiple focused sessions
    const itemsPerSession = 10
    const numSessions = Math.ceil(items.length / itemsPerSession)
    
    for (let i = 0; i < numSessions; i++) {
      const sessionItems = items.slice(i * itemsPerSession, (i + 1) * itemsPerSession)
      const startHour = 8 + (i * 2) // 8:00, 10:00, 12:00, etc.
      
      sessions.push({
        sessionId: `weak-area-${i}-${date.getTime()}`,
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${(startHour + 1).toString().padStart(2, '0')}:00`,
        type: 'WeakAreaFocus',
        items: sessionItems.map(item => item.id),
        estimatedDuration: 60,
        priority: 5
      })
    }
    
    return sessions
  }

  private async getCriticalItemsForExam(userId: string): Promise<RevisionItem[]> {
    const allItems = await this.getAllUserRevisionItems(userId)
    return allItems.filter(item => 
      item.importance === 'Critical' || 
      item.importance === 'High' ||
      item.strugglingCount > 0
    )
  }

  private async createPreExamDaySchedule(
    userId: string,
    date: Date,
    criticalItems: RevisionItem[],
    dayNumber: number,
    totalDays: number
  ): Promise<RevisionSchedule> {
    const itemsPerDay = Math.ceil(criticalItems.length / totalDays)
    const dayItems = criticalItems.slice(dayNumber * itemsPerDay, (dayNumber + 1) * itemsPerDay)
    
    const sessions: ScheduledSession[] = []
    
    // Pre-exam intensive sessions
    sessions.push({
      sessionId: `pre-exam-${dayNumber}-${date.getTime()}`,
      startTime: '06:00',
      endTime: '08:00',
      type: 'PreTestRevision',
      items: dayItems.map(item => item.id),
      estimatedDuration: 120,
      priority: 5
    })
    
    // Final review session
    sessions.push({
      sessionId: `final-review-${dayNumber}-${date.getTime()}`,
      startTime: '20:00',
      endTime: '21:00',
      type: 'RapidFire',
      items: dayItems.slice(0, 20).map(item => item.id),
      estimatedDuration: 60,
      priority: 5
    })
    
    return {
      userId,
      date,
      sessions,
      totalTime: 180,
      priority: 'High',
      flexibility: 5, // Very low flexibility before exam
      completed: false,
      adjustments: []
    }
  }
}