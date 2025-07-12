import {
  StudyPlan,
  DailySchedule,
  StudySession,
  UserProfile,
  TimeSlot,
  SessionType,
  StudyPhase,
  ProgressTracking,
  SubjectProgress
} from '../types'
import { SubjectArea } from '../../question-generator/types'

export class SmartFeaturesOptimizer {
  
  async optimizeForEnergy(
    studyPlan: StudyPlan, 
    userProfile: UserProfile
  ): Promise<StudyPlan> {
    console.log('🔋 Optimizing study plan for energy levels...')
    
    const optimizedPlan = { ...studyPlan }
    
    optimizedPlan.dailySchedules = optimizedPlan.dailySchedules.map(schedule => 
      this.optimizeDayForEnergy(schedule, userProfile)
    )
    
    return optimizedPlan
  }

  async optimizeForVariety(
    studyPlan: StudyPlan,
    userProfile: UserProfile
  ): Promise<StudyPlan> {
    console.log('🎨 Optimizing study plan for variety management...')
    
    const optimizedPlan = { ...studyPlan }
    const varietyPreference = userProfile.preferences.varietyPreference
    
    if (varietyPreference > 70) {
      // High variety preference - ensure subject rotation
      optimizedPlan.dailySchedules = this.ensureSubjectRotation(optimizedPlan.dailySchedules)
    } else if (varietyPreference < 40) {
      // Low variety preference - allow subject blocking
      optimizedPlan.dailySchedules = this.enableSubjectBlocking(optimizedPlan.dailySchedules)
    }
    
    return optimizedPlan
  }

  async implementPomodoroTechnique(
    studyPlan: StudyPlan,
    userProfile: UserProfile
  ): Promise<StudyPlan> {
    console.log('🍅 Implementing Pomodoro Technique...')
    
    const optimizedPlan = { ...studyPlan }
    
    if (userProfile.preferences.breakFrequency <= 30) {
      optimizedPlan.dailySchedules = optimizedPlan.dailySchedules.map(schedule =>
        this.applyPomodoroToSchedule(schedule, userProfile.preferences.breakFrequency)
      )
    }
    
    return optimizedPlan
  }

  async optimizeSessionSequencing(
    studyPlan: StudyPlan,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): Promise<StudyPlan> {
    console.log('🔄 Optimizing session sequencing for maximum retention...')
    
    const optimizedPlan = { ...studyPlan }
    
    optimizedPlan.dailySchedules = optimizedPlan.dailySchedules.map(schedule =>
      this.optimizeSessionOrder(schedule, userProfile, progressData)
    )
    
    return optimizedPlan
  }

  async implementSpacedRepetition(
    studyPlan: StudyPlan,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): Promise<StudyPlan> {
    console.log('📈 Implementing spaced repetition algorithms...')
    
    const optimizedPlan = { ...studyPlan }
    
    // Enhance revision cycles with spaced repetition
    optimizedPlan.revisionCycles = this.enhanceRevisionWithSpacing(
      optimizedPlan.revisionCycles,
      userProfile,
      progressData
    )
    
    // Add revision sessions to daily schedules
    optimizedPlan.dailySchedules = this.integrateSpacedRevision(
      optimizedPlan.dailySchedules,
      optimizedPlan.revisionCycles
    )
    
    return optimizedPlan
  }

  async optimizeForTimeConstraints(
    studyPlan: StudyPlan,
    userProfile: UserProfile
  ): Promise<StudyPlan> {
    console.log('⏰ Optimizing for user time constraints...')
    
    const optimizedPlan = { ...studyPlan }
    
    optimizedPlan.dailySchedules = optimizedPlan.dailySchedules.map(schedule =>
      this.respectTimeConstraints(schedule, userProfile.constraints)
    )
    
    return optimizedPlan
  }

  async implementAdaptiveDifficulty(
    studyPlan: StudyPlan,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): Promise<StudyPlan> {
    console.log('🎯 Implementing adaptive difficulty progression...')
    
    const optimizedPlan = { ...studyPlan }
    
    optimizedPlan.dailySchedules = optimizedPlan.dailySchedules.map(schedule =>
      this.adjustDifficultyBasedOnProgress(schedule, userProfile, progressData)
    )
    
    return optimizedPlan
  }

  private optimizeDayForEnergy(schedule: DailySchedule, userProfile: UserProfile): DailySchedule {
    const optimizedSchedule = { ...schedule }
    const preferredTimes = userProfile.preferences.preferredStudyTimes
    
    if (preferredTimes.length === 0) {
      return optimizedSchedule // No preferences to optimize for
    }
    
    // Sort sessions by priority and difficulty
    const sortedSessions = [...optimizedSchedule.studySessions].sort((a, b) => {
      const aPriority = this.getSessionPriority(a)
      const bPriority = this.getSessionPriority(b)
      return bPriority - aPriority
    })
    
    // Map sessions to optimal time slots
    const mappedSessions = this.mapSessionsToEnergyLevels(sortedSessions, preferredTimes)
    
    optimizedSchedule.studySessions = mappedSessions
    return optimizedSchedule
  }

  private mapSessionsToEnergyLevels(sessions: StudySession[], timeSlots: TimeSlot[]): StudySession[] {
    const highEnergySlots = timeSlots.filter(slot => slot.energyLevel === 'High')
    const mediumEnergySlots = timeSlots.filter(slot => slot.energyLevel === 'Medium')
    const lowEnergySlots = timeSlots.filter(slot => slot.energyLevel === 'Low')
    
    const mappedSessions = [...sessions]
    
    // Map difficult sessions to high energy times
    const difficultSessions = sessions.filter(s => 
      s.sessionType === 'NewConcept' || s.difficulty === 'hard'
    )
    
    // Map medium sessions to medium energy times
    const mediumSessions = sessions.filter(s => 
      s.sessionType === 'Practice' && s.difficulty === 'medium'
    )
    
    // Map easy sessions to low energy times
    const easySessions = sessions.filter(s => 
      s.sessionType === 'Revision' || s.sessionType === 'CurrentAffairs'
    )
    
    // Adjust session start times based on energy mapping
    this.assignTimesToSessions(difficultSessions, highEnergySlots)
    this.assignTimesToSessions(mediumSessions, mediumEnergySlots)
    this.assignTimesToSessions(easySessions, lowEnergySlots)
    
    return mappedSessions
  }

  private assignTimesToSessions(sessions: StudySession[], timeSlots: TimeSlot[]): void {
    sessions.forEach((session, index) => {
      if (timeSlots.length > 0) {
        const slotIndex = index % timeSlots.length
        const slot = timeSlots[slotIndex]
        session.startTime = slot.startTime
        session.endTime = this.addMinutes(slot.startTime, session.duration)
      }
    })
  }

  private ensureSubjectRotation(schedules: DailySchedule[]): DailySchedule[] {
    return schedules.map((schedule, dayIndex) => {
      const rotatedSchedule = { ...schedule }
      
      // Ensure no subject appears in consecutive sessions
      const sessions = [...schedule.studySessions]
      const optimizedSessions = this.rotateSubjects(sessions)
      
      rotatedSchedule.studySessions = optimizedSessions
      return rotatedSchedule
    })
  }

  private rotateSubjects(sessions: StudySession[]): StudySession[] {
    const optimized = [...sessions]
    
    for (let i = 1; i < optimized.length; i++) {
      if (optimized[i].subject === optimized[i - 1].subject) {
        // Find a different subject session to swap with
        for (let j = i + 1; j < optimized.length; j++) {
          if (optimized[j].subject !== optimized[i - 1].subject) {
            // Swap sessions
            [optimized[i], optimized[j]] = [optimized[j], optimized[i]]
            break
          }
        }
      }
    }
    
    return optimized
  }

  private enableSubjectBlocking(schedules: DailySchedule[]): DailySchedule[] {
    return schedules.map(schedule => {
      const blockedSchedule = { ...schedule }
      
      // Group sessions by subject
      const sessionsBySubject = this.groupSessionsBySubject(schedule.studySessions)
      
      // Arrange sessions in blocks
      const blockedSessions = this.arrangeInBlocks(sessionsBySubject)
      
      blockedSchedule.studySessions = blockedSessions
      return blockedSchedule
    })
  }

  private groupSessionsBySubject(sessions: StudySession[]): Record<SubjectArea, StudySession[]> {
    const grouped: Record<SubjectArea, StudySession[]> = {} as Record<SubjectArea, StudySession[]>
    
    sessions.forEach(session => {
      if (!grouped[session.subject]) {
        grouped[session.subject] = []
      }
      grouped[session.subject].push(session)
    })
    
    return grouped
  }

  private arrangeInBlocks(sessionsBySubject: Record<SubjectArea, StudySession[]>): StudySession[] {
    const blocked: StudySession[] = []
    
    Object.values(sessionsBySubject).forEach(subjectSessions => {
      blocked.push(...subjectSessions)
    })
    
    return blocked
  }

  private applyPomodoroToSchedule(schedule: DailySchedule, breakFrequency: number): DailySchedule {
    const pomodoroSchedule = { ...schedule }
    const pomodoroLength = 25 // 25 minutes work session
    const shortBreak = 5 // 5 minutes break
    const longBreak = 15 // 15 minutes break after 4 pomodoros
    
    const modifiedSessions: StudySession[] = []
    const modifiedBreaks: any[] = []
    
    let pomodoroCount = 0
    let currentTime = schedule.studySessions[0]?.startTime || '09:00'
    
    schedule.studySessions.forEach(session => {
      // Split long sessions into pomodoro chunks
      const chunks = Math.ceil(session.duration / pomodoroLength)
      
      for (let chunk = 0; chunk < chunks; chunk++) {
        const chunkDuration = Math.min(pomodoroLength, session.duration - (chunk * pomodoroLength))
        
        modifiedSessions.push({
          ...session,
          id: `${session.id}-pomodoro-${chunk + 1}`,
          startTime: currentTime,
          endTime: this.addMinutes(currentTime, chunkDuration),
          duration: chunkDuration
        })
        
        currentTime = this.addMinutes(currentTime, chunkDuration)
        pomodoroCount++
        
        // Add break after each pomodoro
        if (chunk < chunks - 1 || pomodoroCount % 4 !== 0) {
          const breakDuration = pomodoroCount % 4 === 0 ? longBreak : shortBreak
          
          modifiedBreaks.push({
            startTime: currentTime,
            endTime: this.addMinutes(currentTime, breakDuration),
            duration: breakDuration,
            type: pomodoroCount % 4 === 0 ? 'Long Break' : 'Short Break',
            activity: 'Pomodoro Break'
          })
          
          currentTime = this.addMinutes(currentTime, breakDuration)
        }
      }
    })
    
    pomodoroSchedule.studySessions = modifiedSessions
    pomodoroSchedule.breaks = [...schedule.breaks, ...modifiedBreaks]
    
    return pomodoroSchedule
  }

  private optimizeSessionOrder(
    schedule: DailySchedule,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): DailySchedule {
    const optimizedSchedule = { ...schedule }
    const sessions = [...schedule.studySessions]
    
    // Apply optimal sequencing based on learning science
    const optimizedSessions = sessions.sort((a, b) => {
      // 1. Start with medium difficulty to warm up
      // 2. Peak difficulty in the middle
      // 3. End with revision or light topics
      
      const aScore = this.calculateSequenceScore(a, userProfile, progressData)
      const bScore = this.calculateSequenceScore(b, userProfile, progressData)
      
      return bScore - aScore
    })
    
    optimizedSchedule.studySessions = optimizedSessions
    return optimizedSchedule
  }

  private calculateSequenceScore(
    session: StudySession,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): number {
    let score = 0
    
    // Prefer weak areas earlier in the day
    const isWeakArea = userProfile.weaknesses.some(w => w.subject === session.subject)
    if (isWeakArea) score += 10
    
    // Prefer new concepts in middle sessions
    if (session.sessionType === 'NewConcept') score += 5
    
    // Prefer revision sessions later
    if (session.sessionType === 'Revision') score -= 5
    
    // Consider user's learning style
    if (userProfile.learningStyle === 'Practice-heavy' && session.sessionType === 'Practice') {
      score += 8
    }
    
    return score
  }

  private enhanceRevisionWithSpacing(
    revisionCycles: any[],
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): any[] {
    return revisionCycles.map(cycle => {
      const enhancedCycle = { ...cycle }
      
      // Apply spaced repetition intervals based on performance
      enhancedCycle.topics = cycle.topics.map((topic: any) => {
        const performance = this.getTopicPerformance(topic, progressData)
        const nextInterval = this.calculateSpacedInterval(performance, topic.lastRevised)
        
        return {
          ...topic,
          nextRevisionDue: new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000),
          spacingInterval: nextInterval
        }
      })
      
      return enhancedCycle
    })
  }

  private integrateSpacedRevision(schedules: DailySchedule[], revisionCycles: any[]): DailySchedule[] {
    return schedules.map((schedule, dayIndex) => {
      const enhancedSchedule = { ...schedule }
      
      // Check if any revision is due today
      const dueRevisions = this.getRevisionsForDay(schedule.date, revisionCycles)
      
      if (dueRevisions.length > 0) {
        // Add micro-revision sessions
        const microRevisionSessions = dueRevisions.map((revision, index) => ({
          id: `micro-revision-${dayIndex}-${index}`,
          startTime: this.findAvailableSlot(schedule),
          endTime: this.findAvailableSlot(schedule, 10),
          duration: 10, // 10-minute micro-revision
          subject: revision.subject,
          topic: revision.topic,
          subtopics: [],
          sessionType: 'Revision' as SessionType,
          difficulty: 'easy' as any,
          resources: [],
          learningObjectives: [`Quick revision of ${revision.topic}`],
          successCriteria: ['Recall key points without notes'],
          prerequisites: [],
          followUpTasks: []
        }))
        
        enhancedSchedule.studySessions = [...schedule.studySessions, ...microRevisionSessions]
      }
      
      return enhancedSchedule
    })
  }

  private respectTimeConstraints(schedule: DailySchedule, constraints: any[]): DailySchedule {
    const constrainedSchedule = { ...schedule }
    
    constraints.forEach(constraint => {
      if (constraint.type === 'Job' && constraint.timeImpact) {
        const unavailableTime = this.parseTimeImpact(constraint.timeImpact)
        constrainedSchedule.studySessions = this.moveSessionsOutsideConstraints(
          schedule.studySessions,
          unavailableTime
        )
      }
    })
    
    return constrainedSchedule
  }

  private adjustDifficultyBasedOnProgress(
    schedule: DailySchedule,
    userProfile: UserProfile,
    progressData?: ProgressTracking
  ): DailySchedule {
    const adaptedSchedule = { ...schedule }
    
    adaptedSchedule.studySessions = schedule.studySessions.map(session => {
      const adaptedSession = { ...session }
      
      if (progressData) {
        const subjectProgress = progressData.subjectProgress[session.subject]
        
        if (subjectProgress) {
          // Adjust difficulty based on performance
          if (subjectProgress.averageScore > 85) {
            adaptedSession.difficulty = 'hard'
          } else if (subjectProgress.averageScore < 60) {
            adaptedSession.difficulty = 'easy'
          }
          
          // Adjust session type based on momentum
          if (subjectProgress.momentum === 'Declining') {
            adaptedSession.sessionType = 'WeakAreaFocus'
          } else if (subjectProgress.momentum === 'Building') {
            adaptedSession.sessionType = 'StrengthReinforcement'
          }
        }
      }
      
      return adaptedSession
    })
    
    return adaptedSchedule
  }

  // Helper methods
  private getSessionPriority(session: StudySession): number {
    const priorities: Record<SessionType, number> = {
      'WeakAreaFocus': 5,
      'NewConcept': 4,
      'Practice': 3,
      'MockTest': 5,
      'Revision': 2,
      'CurrentAffairs': 2,
      'PYQPractice': 4,
      'StrengthReinforcement': 1
    }
    
    return priorities[session.sessionType] || 2
  }

  private addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private getTopicPerformance(topic: any, progressData?: ProgressTracking): number {
    // Mock implementation - return topic performance score
    return topic.masteryLevel || 70
  }

  private calculateSpacedInterval(performance: number, lastRevised: Date): number {
    // Spaced repetition algorithm: higher performance = longer interval
    const daysSinceLastRevision = Math.floor((Date.now() - lastRevised.getTime()) / (1000 * 60 * 60 * 24))
    
    if (performance > 90) return Math.min(daysSinceLastRevision * 2, 30) // Max 30 days
    if (performance > 75) return Math.min(daysSinceLastRevision * 1.5, 14) // Max 14 days
    if (performance > 60) return Math.min(daysSinceLastRevision * 1.2, 7) // Max 7 days
    return 3 // 3 days for poor performance
  }

  private getRevisionsForDay(date: Date, revisionCycles: any[]): any[] {
    const dueRevisions: any[] = []
    
    revisionCycles.forEach(cycle => {
      cycle.topics.forEach((topic: any) => {
        if (topic.nextRevisionDue && topic.nextRevisionDue <= date) {
          dueRevisions.push(topic)
        }
      })
    })
    
    return dueRevisions
  }

  private findAvailableSlot(schedule: DailySchedule, duration: number = 60): string {
    // Find gaps between sessions for micro-revisions
    if (schedule.studySessions.length === 0) return '09:00'
    
    const lastSession = schedule.studySessions[schedule.studySessions.length - 1]
    return this.addMinutes(lastSession.endTime, 5) // 5 minutes after last session
  }

  private parseTimeImpact(timeImpact: string): { start: string; end: string } {
    // Parse "09:00 - 18:00 unavailable" format
    const match = timeImpact.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/)
    return match ? { start: match[1], end: match[2] } : { start: '09:00', end: '18:00' }
  }

  private moveSessionsOutsideConstraints(
    sessions: StudySession[],
    unavailableTime: { start: string; end: string }
  ): StudySession[] {
    return sessions.map(session => {
      if (this.isTimeInRange(session.startTime, unavailableTime)) {
        // Move session to available time
        const adjustedSession = { ...session }
        adjustedSession.startTime = unavailableTime.end
        adjustedSession.endTime = this.addMinutes(unavailableTime.end, session.duration)
        return adjustedSession
      }
      return session
    })
  }

  private isTimeInRange(time: string, range: { start: string; end: string }): boolean {
    const timeMinutes = this.timeToMinutes(time)
    const startMinutes = this.timeToMinutes(range.start)
    const endMinutes = this.timeToMinutes(range.end)
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}