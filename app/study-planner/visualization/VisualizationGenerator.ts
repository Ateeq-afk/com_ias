import {
  PlanVisualization,
  CalendarEvent,
  GanttItem,
  ProgressRing,
  ProgressRingDetail,
  MilestoneTracker,
  TrackedMilestone,
  VisualizationAnalytics,
  WeeklyTrend,
  Achievement,
  StudyPlan,
  DailySchedule,
  StudySession,
  WeeklyTarget,
  MonthlyMilestone,
  ProgressTracking,
  UserProfile
} from '../types'
import { SubjectArea } from '../../question-generator/types'

export class UPSCVisualizationGenerator {
  
  async generateVisualization(
    studyPlan: StudyPlan, 
    progressData?: ProgressTracking,
    userProfile?: UserProfile
  ): Promise<PlanVisualization> {
    const calendarView = this.generateCalendarView(studyPlan)
    const ganttChart = this.generateGanttChart(studyPlan)
    const progressRings = this.generateProgressRings(studyPlan, progressData)
    const milestoneTracker = this.generateMilestoneTracker(studyPlan, progressData)
    const analytics = this.generateAnalytics(studyPlan, progressData, userProfile)
    
    return {
      calendarView,
      ganttChart,
      progressRings,
      milestoneTracker,
      analytics
    }
  }

  private generateCalendarView(studyPlan: StudyPlan): CalendarEvent[] {
    const events: CalendarEvent[] = []
    
    // Generate events from daily schedules
    studyPlan.dailySchedules.forEach((schedule, dayIndex) => {
      // Add study sessions as events
      schedule.studySessions.forEach((session, sessionIndex) => {
        events.push({
          id: `session-${dayIndex}-${sessionIndex}`,
          date: schedule.date,
          title: `${session.subject}: ${session.topic}`,
          subject: session.subject,
          duration: session.duration,
          type: session.sessionType,
          color: this.getSubjectColor(session.subject),
          priority: this.getSessionPriority(session)
        })
      })
      
      // Add break events for longer breaks
      schedule.breaks.forEach((breakSlot, breakIndex) => {
        if (breakSlot.duration > 30) { // Only show breaks longer than 30 minutes
          events.push({
            id: `break-${dayIndex}-${breakIndex}`,
            date: schedule.date,
            title: `${breakSlot.type} Break`,
            subject: 'Current Affairs', // Default subject for breaks
            duration: breakSlot.duration,
            type: 'CurrentAffairs',
            color: this.getBreakColor(breakSlot.type),
            priority: 1
          })
        }
      })
    })
    
    // Add mock test events
    studyPlan.mockTestSchedule.forEach((mockTest, testIndex) => {
      events.push({
        id: `mock-test-${testIndex}`,
        date: mockTest.scheduledDate,
        title: `Mock Test ${mockTest.testNumber} (${mockTest.testType})`,
        subject: 'Current Affairs', // Mock tests cover all subjects
        duration: mockTest.testType === 'Mains' ? 180 : 120,
        type: 'MockTest',
        color: '#FF4444', // Red for mock tests
        priority: 5 // High priority
      })
    })
    
    // Add milestone events
    studyPlan.monthlyMilestones.forEach((milestone, milestoneIndex) => {
      events.push({
        id: `milestone-${milestoneIndex}`,
        date: milestone.endDate,
        title: `Month ${milestone.month} Milestone`,
        subject: 'Current Affairs',
        duration: 60,
        type: 'CurrentAffairs',
        color: '#FFD700', // Gold for milestones
        priority: 4
      })
    })
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  private generateGanttChart(studyPlan: StudyPlan): GanttItem[] {
    const ganttItems: GanttItem[] = []
    
    // Add weekly targets as Gantt items
    studyPlan.weeklyTargets.forEach((target, weekIndex) => {
      target.subjects.forEach((subjectTarget, subjectIndex) => {
        ganttItems.push({
          id: `week-${weekIndex}-${subjectTarget.subject}`,
          name: `Week ${target.weekNumber}: ${subjectTarget.subject}`,
          startDate: target.startDate,
          endDate: target.endDate,
          progress: subjectTarget.expectedCompletion,
          dependencies: weekIndex > 0 ? [`week-${weekIndex-1}-${subjectTarget.subject}`] : [],
          category: 'Subject Progress',
          color: this.getSubjectColor(subjectTarget.subject)
        })
      })
    })
    
    // Add monthly milestones as major Gantt items
    studyPlan.monthlyMilestones.forEach((milestone, milestoneIndex) => {
      ganttItems.push({
        id: `milestone-${milestoneIndex}`,
        name: `${milestone.phase} Phase - Month ${milestone.month}`,
        startDate: milestone.startDate,
        endDate: milestone.endDate,
        progress: this.calculateMilestoneProgress(milestone),
        dependencies: milestoneIndex > 0 ? [`milestone-${milestoneIndex-1}`] : [],
        category: 'Study Phase',
        color: this.getPhaseColor(milestone.phase)
      })
    })
    
    // Add revision cycles
    studyPlan.revisionCycles.forEach((cycle, cycleIndex) => {
      ganttItems.push({
        id: `revision-${cycleIndex}`,
        name: `Revision Cycle ${cycle.cycleNumber} (${cycle.intensity})`,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        progress: 0, // Will be updated based on actual progress
        dependencies: [],
        category: 'Revision',
        color: '#9B59B6' // Purple for revision
      })
    })
    
    // Add mock test preparation periods
    studyPlan.mockTestSchedule.forEach((mockTest, testIndex) => {
      const prepStartDate = new Date(mockTest.scheduledDate)
      prepStartDate.setDate(prepStartDate.getDate() - mockTest.preparationDays)
      
      ganttItems.push({
        id: `mock-prep-${testIndex}`,
        name: `Mock Test ${mockTest.testNumber} Preparation`,
        startDate: prepStartDate,
        endDate: mockTest.scheduledDate,
        progress: 0,
        dependencies: [],
        category: 'Mock Test',
        color: '#E74C3C' // Red for mock tests
      })
    })
    
    return ganttItems.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }

  private generateProgressRings(studyPlan: StudyPlan, progressData?: ProgressTracking): ProgressRing[] {
    const rings: ProgressRing[] = []
    const subjects = this.getAllSubjects()
    
    subjects.forEach(subject => {
      const subjectProgress = progressData?.subjectProgress[subject]
      const completion = subjectProgress ? 
        (subjectProgress.topicsCompleted / subjectProgress.totalTopics) * 100 : 0
      
      const target = this.calculateSubjectTarget(subject, studyPlan)
      const trend = this.calculateProgressTrend(subjectProgress)
      
      rings.push({
        subject,
        completion,
        target,
        trend,
        color: this.getSubjectColor(subject),
        details: this.generateProgressRingDetails(subject, subjectProgress, studyPlan)
      })
    })
    
    return rings
  }

  private generateProgressRingDetails(
    subject: SubjectArea, 
    subjectProgress: any, 
    studyPlan: StudyPlan
  ): ProgressRingDetail[] {
    const details: ProgressRingDetail[] = []
    
    if (subjectProgress) {
      details.push({
        label: 'Topics Completed',
        value: subjectProgress.topicsCompleted,
        target: subjectProgress.totalTopics,
        unit: 'topics'
      })
      
      details.push({
        label: 'Hours Studied',
        value: subjectProgress.hoursSpent,
        target: subjectProgress.plannedHours,
        unit: 'hours'
      })
      
      details.push({
        label: 'Average Score',
        value: subjectProgress.averageScore,
        target: 85,
        unit: '%'
      })
    } else {
      // Default details when no progress data available
      details.push({
        label: 'Topics Planned',
        value: 0,
        target: this.getSubjectTopicCount(subject),
        unit: 'topics'
      })
      
      details.push({
        label: 'Hours Planned',
        value: 0,
        target: this.getSubjectPlannedHours(subject),
        unit: 'hours'
      })
    }
    
    return details
  }

  private generateMilestoneTracker(studyPlan: StudyPlan, progressData?: ProgressTracking): MilestoneTracker {
    const milestones: TrackedMilestone[] = []
    
    // Track monthly milestones
    studyPlan.monthlyMilestones.forEach((milestone, index) => {
      const progress = this.calculateMilestoneProgress(milestone, progressData)
      const status = this.determineMilestoneStatus(milestone, progress)
      
      milestones.push({
        id: `milestone-${index}`,
        title: `${milestone.phase} Phase - Month ${milestone.month}`,
        targetDate: milestone.endDate,
        status,
        progress,
        dependencies: index > 0 ? [`milestone-${index-1}`] : [],
        criticalPath: this.isCriticalPath(milestone, studyPlan)
      })
    })
    
    // Track key assessments
    studyPlan.monthlyMilestones.forEach((milestone, monthIndex) => {
      milestone.assessments.forEach((assessment, assessIndex) => {
        milestones.push({
          id: `assessment-${monthIndex}-${assessIndex}`,
          title: `${assessment.type} Assessment`,
          targetDate: assessment.scheduledDate,
          status: this.determineAssessmentStatus(assessment),
          progress: 0,
          dependencies: [`milestone-${monthIndex}`],
          criticalPath: assessment.type === 'Diagnostic'
        })
      })
    })
    
    const overallProgress = this.calculateOverallProgress(milestones)
    const timeRemaining = this.calculateTimeRemaining(studyPlan)
    const projectedCompletion = this.calculateProjectedCompletion(studyPlan, overallProgress)
    
    return {
      milestones,
      overallProgress,
      timeRemaining,
      projectedCompletion
    }
  }

  private generateAnalytics(
    studyPlan: StudyPlan, 
    progressData?: ProgressTracking,
    userProfile?: UserProfile
  ): VisualizationAnalytics {
    const studyStreak = this.calculateStudyStreak(progressData)
    const mostProductiveTime = this.findMostProductiveTime(progressData, userProfile)
    const averageSessionLength = this.calculateAverageSessionLength(studyPlan)
    const subjectBalance = this.calculateSubjectBalance(studyPlan, progressData)
    const weeklyTrends = this.generateWeeklyTrends(progressData)
    const achievements = this.generateAchievements(progressData, studyPlan)
    
    return {
      studyStreak,
      mostProductiveTime,
      averageSessionLength,
      subjectBalance,
      weeklyTrends,
      achievements
    }
  }

  private generateWeeklyTrends(progressData?: ProgressTracking): WeeklyTrend[] {
    const trends: WeeklyTrend[] = []
    
    // Generate last 8 weeks of trends (mock data)
    for (let week = 0; week < 8; week++) {
      const weekDate = new Date()
      weekDate.setDate(weekDate.getDate() - (week * 7))
      
      trends.unshift({
        week: `Week ${8 - week}`,
        hoursStudied: 35 + Math.random() * 10, // 35-45 hours per week
        efficiency: 75 + Math.random() * 20, // 75-95% efficiency
        subjectFocus: this.getRandomSubject(),
        keyAchievements: this.generateWeeklyAchievements(week)
      })
    }
    
    return trends
  }

  private generateAchievements(progressData?: ProgressTracking, studyPlan?: StudyPlan): Achievement[] {
    const achievements: Achievement[] = []
    
    // Study streak achievements
    const streak = this.calculateStudyStreak(progressData)
    if (streak >= 7) {
      achievements.push({
        id: 'streak-7',
        title: 'Week Warrior',
        description: '7 days continuous study streak',
        earnedDate: new Date(),
        category: 'Consistency',
        points: 100
      })
    }
    
    if (streak >= 30) {
      achievements.push({
        id: 'streak-30',
        title: 'Month Marathon',
        description: '30 days continuous study streak',
        earnedDate: new Date(),
        category: 'Consistency',
        points: 500
      })
    }
    
    // Performance achievements
    if (progressData && progressData.efficiencyScore > 90) {
      achievements.push({
        id: 'efficiency-90',
        title: 'Efficiency Expert',
        description: 'Achieved 90%+ study efficiency',
        earnedDate: new Date(),
        category: 'Performance',
        points: 250
      })
    }
    
    // Milestone achievements
    if (studyPlan && studyPlan.monthlyMilestones.length > 0) {
      achievements.push({
        id: 'first-milestone',
        title: 'Milestone Master',
        description: 'Completed first monthly milestone',
        earnedDate: new Date(),
        category: 'Milestone',
        points: 200
      })
    }
    
    return achievements
  }

  // Helper methods
  private getSubjectColor(subject: SubjectArea): string {
    const colors: Record<SubjectArea, string> = {
      'Polity': '#3498DB',
      'History': '#E67E22',
      'Geography': '#27AE60',
      'Economy': '#9B59B6',
      'Environment': '#2ECC71',
      'Science & Technology': '#34495E',
      'Current Affairs': '#E74C3C',
      'Social Issues': '#F39C12',
      'Art & Culture': '#8E44AD',
      'Ethics': '#16A085'
    }
    return colors[subject] || '#95A5A6'
  }

  private getBreakColor(breakType: string): string {
    const colors: Record<string, string> = {
      'Short': '#BDC3C7',
      'Meal': '#F39C12',
      'Exercise': '#E74C3C',
      'Recreation': '#9B59B6'
    }
    return colors[breakType] || '#95A5A6'
  }

  private getPhaseColor(phase: string): string {
    const colors: Record<string, string> = {
      'Foundation': '#3498DB',
      'Intermediate': '#F39C12',
      'Advanced': '#E74C3C',
      'Revision': '#9B59B6',
      'Mock Test Phase': '#27AE60'
    }
    return colors[phase] || '#95A5A6'
  }

  private getSessionPriority(session: StudySession): number {
    const priorities: Record<string, number> = {
      'MockTest': 5,
      'WeakAreaFocus': 4,
      'NewConcept': 3,
      'Practice': 3,
      'Revision': 2,
      'CurrentAffairs': 2,
      'PYQPractice': 3,
      'StrengthReinforcement': 1
    }
    return priorities[session.sessionType] || 2
  }

  private calculateMilestoneProgress(milestone: any, progressData?: ProgressTracking): number {
    if (!progressData) return 0
    
    // Calculate based on syllabus completion
    const subjects = Object.keys(milestone.syllabusCompletion)
    const totalCompletion = subjects.reduce((sum, subject) => {
      const expected = milestone.syllabusCompletion[subject as SubjectArea]
      const actual = progressData.subjectProgress[subject as SubjectArea]?.topicsCompleted || 0
      const actualTotal = progressData.subjectProgress[subject as SubjectArea]?.totalTopics || 1
      const actualPercentage = (actual / actualTotal) * 100
      return sum + Math.min(actualPercentage / expected, 1)
    }, 0)
    
    return (totalCompletion / subjects.length) * 100
  }

  private determineMilestoneStatus(milestone: any, progress: number): 'Completed' | 'OnTrack' | 'AtRisk' | 'Delayed' {
    const now = new Date()
    const timeRemaining = milestone.endDate.getTime() - now.getTime()
    const totalTime = milestone.endDate.getTime() - milestone.startDate.getTime()
    const timeProgress = 1 - (timeRemaining / totalTime)
    
    if (progress >= 100) return 'Completed'
    if (progress >= timeProgress * 100 - 10) return 'OnTrack'
    if (progress >= timeProgress * 100 - 25) return 'AtRisk'
    return 'Delayed'
  }

  private isCriticalPath(milestone: any, studyPlan: StudyPlan): boolean {
    // Milestones in the last 3 months are critical
    const examDate = studyPlan.targetDate
    const threeMonthsBefore = new Date(examDate)
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3)
    
    return milestone.endDate >= threeMonthsBefore
  }

  private determineAssessmentStatus(assessment: any): 'Completed' | 'OnTrack' | 'AtRisk' | 'Delayed' {
    const now = new Date()
    if (assessment.scheduledDate <= now) return 'Delayed'
    
    const daysUntil = Math.floor((assessment.scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil > 7) return 'OnTrack'
    return 'AtRisk'
  }

  private calculateOverallProgress(milestones: TrackedMilestone[]): number {
    if (milestones.length === 0) return 0
    
    const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.progress, 0)
    return totalProgress / milestones.length
  }

  private calculateTimeRemaining(studyPlan: StudyPlan): number {
    const now = new Date()
    const timeRemaining = studyPlan.targetDate.getTime() - now.getTime()
    return Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24))) // Days remaining
  }

  private calculateProjectedCompletion(studyPlan: StudyPlan, progress: number): Date {
    if (progress === 0) return studyPlan.targetDate
    
    const now = new Date()
    const elapsed = now.getTime() - studyPlan.startDate.getTime()
    const progressRate = progress / 100
    const estimatedTotal = elapsed / progressRate
    
    return new Date(studyPlan.startDate.getTime() + estimatedTotal)
  }

  private calculateSubjectTarget(subject: SubjectArea, studyPlan: StudyPlan): number {
    // Calculate expected completion based on plan timeline
    const now = new Date()
    const elapsed = now.getTime() - studyPlan.startDate.getTime()
    const total = studyPlan.targetDate.getTime() - studyPlan.startDate.getTime()
    const timeProgress = elapsed / total
    
    return Math.min(timeProgress * 100, 100)
  }

  private calculateProgressTrend(subjectProgress: any): 'up' | 'down' | 'stable' {
    if (!subjectProgress) return 'stable'
    return subjectProgress.momentum === 'Building' ? 'up' : 
           subjectProgress.momentum === 'Declining' ? 'down' : 'stable'
  }

  private calculateStudyStreak(progressData?: ProgressTracking): number {
    // Mock implementation - return random streak between 1-30
    return Math.floor(Math.random() * 30) + 1
  }

  private findMostProductiveTime(progressData?: ProgressTracking, userProfile?: UserProfile): string {
    // Use user preference or default to morning
    if (userProfile?.preferences.preferredStudyTimes.length > 0) {
      const preferredTime = userProfile.preferences.preferredStudyTimes
        .find(slot => slot.energyLevel === 'High')
      return preferredTime ? preferredTime.startTime : '09:00 AM'
    }
    return '09:00 AM'
  }

  private calculateAverageSessionLength(studyPlan: StudyPlan): number {
    const allSessions = studyPlan.dailySchedules.flatMap(schedule => schedule.studySessions)
    if (allSessions.length === 0) return 60
    
    const totalTime = allSessions.reduce((sum, session) => sum + session.duration, 0)
    return Math.round(totalTime / allSessions.length)
  }

  private calculateSubjectBalance(studyPlan: StudyPlan, progressData?: ProgressTracking): Record<SubjectArea, number> {
    const balance: Record<SubjectArea, number> = {} as Record<SubjectArea, number>
    const subjects = this.getAllSubjects()
    
    // Calculate from planned sessions
    const allSessions = studyPlan.dailySchedules.flatMap(schedule => schedule.studySessions)
    const totalTime = allSessions.reduce((sum, session) => sum + session.duration, 0)
    
    subjects.forEach(subject => {
      const subjectTime = allSessions
        .filter(session => session.subject === subject)
        .reduce((sum, session) => sum + session.duration, 0)
      
      balance[subject] = totalTime > 0 ? (subjectTime / totalTime) * 100 : 0
    })
    
    return balance
  }

  private generateWeeklyAchievements(weekIndex: number): string[] {
    const achievementSets = [
      ['Completed all planned sessions', 'Maintained study consistency'],
      ['Improved test scores', 'Finished revision targets'],
      ['Mastered new concepts', 'Increased practice accuracy'],
      ['Completed monthly assessment', 'Updated study strategy'],
      ['Strengthened weak areas', 'Maintained strong subjects'],
      ['Perfect attendance week', 'Exceeded study hour targets'],
      ['High engagement scores', 'Excellent time management'],
      ['Breakthrough in difficult topics', 'Consistent performance']
    ]
    
    return achievementSets[weekIndex % achievementSets.length]
  }

  private getRandomSubject(): SubjectArea {
    const subjects = this.getAllSubjects()
    return subjects[Math.floor(Math.random() * subjects.length)]
  }

  private getAllSubjects(): SubjectArea[] {
    return [
      'Polity', 'History', 'Geography', 'Economy', 
      'Environment', 'Science & Technology', 'Current Affairs'
    ]
  }

  private getSubjectTopicCount(subject: SubjectArea): number {
    const topicCounts: Record<SubjectArea, number> = {
      'Polity': 45,
      'History': 40,
      'Geography': 35,
      'Economy': 40,
      'Environment': 30,
      'Science & Technology': 25,
      'Current Affairs': 50,
      'Social Issues': 25,
      'Art & Culture': 20,
      'Ethics': 15
    }
    return topicCounts[subject] || 30
  }

  private getSubjectPlannedHours(subject: SubjectArea): number {
    const plannedHours: Record<SubjectArea, number> = {
      'Polity': 80,
      'History': 70,
      'Geography': 60,
      'Economy': 75,
      'Environment': 50,
      'Science & Technology': 40,
      'Current Affairs': 60,
      'Social Issues': 40,
      'Art & Culture': 30,
      'Ethics': 25
    }
    return plannedHours[subject] || 50
  }
}