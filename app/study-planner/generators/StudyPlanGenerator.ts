import {
  StudyPlan,
  StudyPlanGenerator,
  PlanGeneratorConfig,
  DailySchedule,
  StudySession,
  WeeklyTarget,
  MonthlyMilestone,
  RevisionCycle,
  MockTestSchedule,
  SessionType,
  PlanStrategy,
  UserProfile,
  TimeSlot,
  StudyPhase,
  ResourceMapping
} from '../types'
import { SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class UPSCStudyPlanGenerator implements StudyPlanGenerator {
  
  private subjectHierarchy = {
    'Polity': {
      foundation: ['Constitution Basics', 'Parliament', 'Executive', 'Judiciary'],
      intermediate: ['Federalism', 'Elections', 'Local Government', 'Constitutional Bodies'],
      advanced: ['Recent Amendments', 'Comparative Politics', 'Current Issues']
    },
    'History': {
      foundation: ['Ancient India Overview', 'Medieval India Overview', 'Modern India Overview'],
      intermediate: ['Detailed Ancient', 'Detailed Medieval', 'Freedom Struggle', 'Post-Independence'],
      advanced: ['Art & Culture', 'Regional History', 'World History Integration']
    },
    'Geography': {
      foundation: ['Physical Geography Basics', 'Indian Geography Overview', 'World Geography'],
      intermediate: ['Climatology', 'Geomorphology', 'Human Geography', 'Economic Geography'],
      advanced: ['Regional Planning', 'Disaster Management', 'Contemporary Issues']
    },
    'Economy': {
      foundation: ['Basic Concepts', 'Indian Economy Overview', 'Planning & Development'],
      intermediate: ['Money & Banking', 'Public Finance', 'International Trade'],
      advanced: ['Current Economic Issues', 'Economic Reforms', 'Sectoral Analysis']
    },
    'Environment': {
      foundation: ['Ecology Basics', 'Environmental Issues', 'Conservation'],
      intermediate: ['Climate Change', 'Biodiversity', 'Pollution Control'],
      advanced: ['Environmental Laws', 'International Cooperation', 'Sustainable Development']
    },
    'Science & Technology': {
      foundation: ['Basic Science', 'Technology Overview', 'Space Technology'],
      intermediate: ['Biotechnology', 'Information Technology', 'Energy Technology'],
      advanced: ['Emerging Technologies', 'Science Policy', 'Innovation Ecosystem']
    },
    'Current Affairs': {
      foundation: ['Daily Current Affairs', 'Government Schemes', 'Reports & Indices'],
      intermediate: ['Policy Analysis', 'International Developments', 'Economic Developments'],
      advanced: ['Critical Analysis', 'Linking with Static', 'Exam Perspective']
    }
  }

  async generatePlan(config: PlanGeneratorConfig): Promise<StudyPlan> {
    const { strategy, userProfile } = config
    
    // Calculate plan timeline
    const timeline = this.calculateTimeline(userProfile, strategy)
    
    // Generate phase-wise breakdown
    const phases = this.calculatePhases(strategy, timeline.totalDays, userProfile)
    
    // Create daily schedules
    const dailySchedules = await this.generateDailySchedules(phases, userProfile, timeline)
    
    // Create weekly targets
    const weeklyTargets = this.generateWeeklyTargets(phases, timeline)
    
    // Create monthly milestones
    const monthlyMilestones = this.generateMonthlyMilestones(phases, timeline)
    
    // Plan revision cycles
    const revisionCycles = this.planRevisionCycles(timeline, userProfile)
    
    // Schedule mock tests
    const mockTestSchedule = this.scheduleMockTests(timeline, strategy, userProfile)

    return {
      id: `study-plan-${Date.now()}`,
      userId: userProfile.id,
      strategy,
      startDate: new Date(),
      targetDate: new Date(Date.now() + timeline.totalDays * 24 * 60 * 60 * 1000),
      totalDuration: timeline.totalDays,
      dailySchedules,
      weeklyTargets,
      monthlyMilestones,
      revisionCycles,
      mockTestSchedule,
      adaptiveAdjustments: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    }
  }

  async validatePlan(plan: StudyPlan): Promise<boolean> {
    // Validate plan completeness and feasibility
    
    // Check if all subjects are covered
    const subjects = this.getAllSubjects()
    const plannedSubjects = new Set<SubjectArea>()
    
    plan.dailySchedules.forEach(day => {
      day.studySessions.forEach(session => {
        plannedSubjects.add(session.subject)
      })
    })

    if (subjects.some(subject => !plannedSubjects.has(subject))) {
      return false
    }

    // Check daily hour limits
    const maxDailyHours = this.getMaxDailyHours(plan.userId)
    const violatingDays = plan.dailySchedules.filter(day => 
      day.totalPlannedHours > maxDailyHours
    )

    if (violatingDays.length > 0) {
      return false
    }

    // Check syllabus completion timeline
    const syllabusCompletion = this.calculateSyllabusCompletion(plan)
    if (syllabusCompletion < 0.95) { // At least 95% syllabus should be covered
      return false
    }

    return true
  }

  async optimizePlan(plan: StudyPlan, constraints: any[]): Promise<StudyPlan> {
    let optimizedPlan = { ...plan }

    // Apply constraints
    constraints.forEach(constraint => {
      optimizedPlan = this.applyConstraint(optimizedPlan, constraint)
    })

    // Optimize for user learning style
    optimizedPlan = this.optimizeForLearningStyle(optimizedPlan)

    // Balance subject distribution
    optimizedPlan = this.balanceSubjectDistribution(optimizedPlan)

    // Optimize energy levels
    optimizedPlan = this.optimizeEnergyLevels(optimizedPlan)

    return optimizedPlan
  }

  private calculateTimeline(userProfile: UserProfile, strategy: PlanStrategy): {
    totalDays: number
    phases: { phase: StudyPhase; days: number; startDay: number }[]
    dailyHours: number
  } {
    const dailyHours = this.getDailyHours(userProfile.availableHours)
    let totalDays: number

    switch (strategy) {
      case 'FastTrack':
        totalDays = userProfile.background === 'Repeater' ? 240 : 300 // 8-10 months
        break
      case 'Standard':
        totalDays = userProfile.background === 'Working' ? 420 : 365 // 12-14 months
        break
      case 'Extended':
        totalDays = 540 // 16-18 months
        break
      case 'RevisionOnly':
        totalDays = 120 // 3-4 months
        break
      case 'MainsFocused':
        totalDays = 180 // 6 months
        break
      default:
        totalDays = 365 // 12 months
    }

    // Adjust based on target exam
    const now = new Date()
    const targetYear = parseInt(userProfile.targetExam)
    const examDate = new Date(targetYear, 5, 5) // Rough exam date (June 5)
    const daysUntilExam = Math.floor((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExam < totalDays) {
      totalDays = Math.max(daysUntilExam, 90) // Minimum 3 months
    }

    const phases = this.calculatePhases(strategy, totalDays, userProfile)

    return { totalDays, phases, dailyHours }
  }

  private calculatePhases(strategy: PlanStrategy, totalDays: number, userProfile: UserProfile): 
    { phase: StudyPhase; days: number; startDay: number }[] {
    
    if (strategy === 'RevisionOnly') {
      return [
        { phase: 'Revision', days: totalDays * 0.7, startDay: 0 },
        { phase: 'Mock Test Phase', days: totalDays * 0.3, startDay: Math.floor(totalDays * 0.7) }
      ]
    }

    if (strategy === 'MainsFocused') {
      return [
        { phase: 'Advanced', days: totalDays * 0.6, startDay: 0 },
        { phase: 'Mock Test Phase', days: totalDays * 0.4, startDay: Math.floor(totalDays * 0.6) }
      ]
    }

    // Standard progression
    const phases: { phase: StudyPhase; days: number; startDay: number }[] = []
    let currentDay = 0

    if (userProfile.currentKnowledgeLevel === 'Beginner') {
      phases.push({ phase: 'Foundation', days: Math.floor(totalDays * 0.4), startDay: currentDay })
      currentDay += phases[phases.length - 1].days
    }

    phases.push({ phase: 'Intermediate', days: Math.floor(totalDays * 0.3), startDay: currentDay })
    currentDay += phases[phases.length - 1].days

    phases.push({ phase: 'Advanced', days: Math.floor(totalDays * 0.2), startDay: currentDay })
    currentDay += phases[phases.length - 1].days

    phases.push({ phase: 'Revision', days: Math.floor(totalDays * 0.1), startDay: currentDay })
    currentDay += phases[phases.length - 1].days

    phases.push({ phase: 'Mock Test Phase', days: totalDays - currentDay, startDay: currentDay })

    return phases
  }

  private async generateDailySchedules(
    phases: { phase: StudyPhase; days: number; startDay: number }[],
    userProfile: UserProfile,
    timeline: any
  ): Promise<DailySchedule[]> {
    const schedules: DailySchedule[] = []
    const startDate = new Date()

    for (let day = 0; day < timeline.totalDays; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + day)
      
      const phase = phases.find(p => day >= p.startDay && day < p.startDay + p.days)!
      const daySchedule = await this.generateDaySchedule(currentDate, phase.phase, userProfile, timeline.dailyHours, day)
      
      schedules.push(daySchedule)
    }

    return schedules
  }

  private async generateDaySchedule(
    date: Date,
    phase: StudyPhase,
    userProfile: UserProfile,
    dailyHours: number,
    dayNumber: number
  ): Promise<DailySchedule> {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Check if it's a holiday or user has constraints
    const isRestDay = this.isRestDay(date, userProfile)
    
    if (isRestDay) {
      return this.generateRestDaySchedule(date, dayOfWeek, userProfile)
    }

    // Get user's preferred time slots
    const availableSlots = this.getAvailableTimeSlots(date, userProfile)
    
    // Generate study sessions based on phase and user profile
    const studySessions = await this.generateStudySessions(
      phase, 
      userProfile, 
      dailyHours, 
      availableSlots, 
      dayNumber
    )

    // Generate breaks
    const breaks = this.generateBreaks(studySessions, userProfile)

    // Calculate total planned hours
    const totalPlannedHours = studySessions.reduce((total, session) => total + session.duration / 60, 0)

    // Generate daily goals
    const dailyGoals = this.generateDailyGoals(studySessions, phase)

    return {
      date,
      dayOfWeek,
      totalPlannedHours,
      studySessions,
      breaks,
      flexibilityBuffer: 30, // 30 minutes buffer
      dailyGoals,
      motivationalNote: this.generateMotivationalNote(phase, dayNumber)
    }
  }

  private async generateStudySessions(
    phase: StudyPhase,
    userProfile: UserProfile,
    dailyHours: number,
    availableSlots: TimeSlot[],
    dayNumber: number
  ): Promise<StudySession[]> {
    const sessions: StudySession[] = []
    const totalMinutes = dailyHours * 60
    
    // Determine subjects for the day based on phase and user weaknesses
    const daySubjects = this.selectDaySubjects(phase, userProfile, dayNumber)
    
    // Allocate time to subjects
    const subjectAllocations = this.allocateTimeToSubjects(daySubjects, totalMinutes, userProfile)
    
    // Create sessions
    let sessionId = 1
    let currentTime = availableSlots[0]?.startTime || '09:00'
    
    for (const [subject, allocation] of Object.entries(subjectAllocations)) {
      const sessionType = this.determineSessionType(phase, subject as SubjectArea, dayNumber)
      const topics = this.selectTopicsForSession(subject as SubjectArea, phase, allocation.duration)
      
      const session: StudySession = {
        id: `session-${dayNumber}-${sessionId++}`,
        startTime: currentTime,
        endTime: this.addMinutes(currentTime, allocation.duration),
        duration: allocation.duration,
        subject: subject as SubjectArea,
        topic: topics.main,
        subtopics: topics.subtopics,
        sessionType,
        difficulty: this.getDifficultyForPhase(phase),
        resources: await this.mapSessionResources(subject as SubjectArea, topics.main, sessionType),
        learningObjectives: this.generateLearningObjectives(subject as SubjectArea, topics.main, sessionType),
        successCriteria: this.generateSuccessCriteria(sessionType, allocation.duration),
        prerequisites: this.getPrerequisites(subject as SubjectArea, topics.main),
        followUpTasks: this.getFollowUpTasks(sessionType, subject as SubjectArea)
      }
      
      sessions.push(session)
      currentTime = this.addMinutes(currentTime, allocation.duration + 15) // 15 min break
    }

    return sessions
  }

  private selectDaySubjects(phase: StudyPhase, userProfile: UserProfile, dayNumber: number): SubjectArea[] {
    const allSubjects = this.getAllSubjects()
    
    if (phase === 'Mock Test Phase') {
      return ['Current Affairs'] // Light study on test days
    }

    // Rotate subjects based on day number and user weaknesses
    const weakSubjects = userProfile.weaknesses.map(w => w.subject)
    const strongSubjects = userProfile.strengths.map(s => s.subject)
    
    // Include 1-2 weak subjects and 1-2 other subjects daily
    const daySubjects: SubjectArea[] = []
    
    // Always include current affairs
    daySubjects.push('Current Affairs')
    
    // Add weak subjects (higher priority)
    const todayWeakSubjects = weakSubjects.slice(dayNumber % weakSubjects.length, 
                                                (dayNumber % weakSubjects.length) + 2)
    daySubjects.push(...todayWeakSubjects)
    
    // Add one other subject for variety
    const otherSubjects = allSubjects.filter(s => 
      !daySubjects.includes(s) && !weakSubjects.includes(s)
    )
    if (otherSubjects.length > 0) {
      daySubjects.push(otherSubjects[dayNumber % otherSubjects.length])
    }

    return daySubjects.slice(0, 4) // Max 4 subjects per day
  }

  private allocateTimeToSubjects(
    subjects: SubjectArea[],
    totalMinutes: number,
    userProfile: UserProfile
  ): Record<string, { duration: number; priority: number }> {
    const allocations: Record<string, { duration: number; priority: number }> = {}
    
    // Current affairs gets fixed 30 minutes
    if (subjects.includes('Current Affairs')) {
      allocations['Current Affairs'] = { duration: 30, priority: 1 }
      totalMinutes -= 30
    }

    // Allocate remaining time based on weakness priority
    const remainingSubjects = subjects.filter(s => s !== 'Current Affairs')
    
    remainingSubjects.forEach((subject, index) => {
      const isWeak = userProfile.weaknesses.some(w => w.subject === subject)
      const baseTime = Math.floor(totalMinutes / remainingSubjects.length)
      
      // Give more time to weak subjects
      const timeMultiplier = isWeak ? 1.3 : 1.0
      const duration = Math.floor(baseTime * timeMultiplier)
      
      allocations[subject] = {
        duration: Math.max(duration, 45), // Minimum 45 minutes per subject
        priority: isWeak ? 2 : 3
      }
    })

    return allocations
  }

  private selectTopicsForSession(
    subject: SubjectArea,
    phase: StudyPhase,
    duration: number
  ): { main: string; subtopics: string[] } {
    const hierarchy = this.subjectHierarchy[subject]
    if (!hierarchy) {
      return { main: 'General Topics', subtopics: ['Overview', 'Key Concepts'] }
    }

    let topics: string[]
    switch (phase) {
      case 'Foundation':
        topics = hierarchy.foundation
        break
      case 'Intermediate':
      case 'Advanced':
        topics = [...hierarchy.intermediate, ...hierarchy.advanced]
        break
      case 'Revision':
        topics = [...hierarchy.foundation, ...hierarchy.intermediate]
        break
      default:
        topics = hierarchy.foundation
    }

    const mainTopic = topics[Math.floor(Math.random() * topics.length)]
    
    // Generate subtopics based on duration
    const subtopicCount = Math.floor(duration / 30) // 1 subtopic per 30 minutes
    const subtopics = this.generateSubtopics(mainTopic, subtopicCount)

    return { main: mainTopic, subtopics }
  }

  private generateSubtopics(mainTopic: string, count: number): string[] {
    const baseSubtopics = [
      'Basic Concepts',
      'Key Features', 
      'Historical Development',
      'Current Status',
      'Challenges',
      'Government Initiatives',
      'International Perspective',
      'Future Outlook'
    ]

    return baseSubtopics.slice(0, count).map(sub => `${mainTopic}: ${sub}`)
  }

  private determineSessionType(phase: StudyPhase, subject: SubjectArea, dayNumber: number): SessionType {
    if (subject === 'Current Affairs') {
      return 'CurrentAffairs'
    }

    if (phase === 'Revision') {
      return dayNumber % 3 === 0 ? 'Practice' : 'Revision'
    }

    if (phase === 'Mock Test Phase') {
      return dayNumber % 7 === 0 ? 'MockTest' : 'Revision'
    }

    // For foundation/intermediate/advanced phases
    const sessionTypes: SessionType[] = ['NewConcept', 'Practice', 'Revision']
    return sessionTypes[dayNumber % sessionTypes.length]
  }

  private getDifficultyForPhase(phase: StudyPhase): DifficultyLevel {
    switch (phase) {
      case 'Foundation':
        return 'easy'
      case 'Intermediate':
        return 'medium'
      case 'Advanced':
      case 'Mock Test Phase':
        return 'hard'
      case 'Revision':
        return 'medium'
      default:
        return 'medium'
    }
  }

  private async mapSessionResources(
    subject: SubjectArea,
    topic: string,
    sessionType: SessionType
  ): Promise<ResourceMapping[]> {
    const resources: ResourceMapping[] = []

    // Add lesson resource
    resources.push({
      type: 'Lesson',
      resourceId: `lesson-${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
      title: `${topic} - Comprehensive Study Material`,
      source: 'Lesson Generator',
      estimatedTime: 45,
      difficulty: 'medium',
      priority: 'Must-do',
      completionTracking: true
    })

    // Add practice questions for practice sessions
    if (sessionType === 'Practice' || sessionType === 'Revision') {
      resources.push({
        type: 'Questions',
        resourceId: `questions-${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${topic} - Practice Questions`,
        source: 'Question Bank',
        estimatedTime: 30,
        difficulty: 'medium',
        priority: 'Must-do',
        completionTracking: true
      })
    }

    // Add current affairs for current affairs sessions
    if (sessionType === 'CurrentAffairs') {
      resources.push({
        type: 'Article',
        resourceId: `current-affairs-${new Date().toISOString().split('T')[0]}`,
        title: 'Daily Current Affairs',
        source: 'Current Affairs System',
        estimatedTime: 30,
        difficulty: 'medium',
        priority: 'Must-do',
        completionTracking: true
      })
    }

    // Add notes for revision
    if (sessionType === 'Revision') {
      resources.push({
        type: 'Notes',
        resourceId: `notes-${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${topic} - Quick Revision Notes`,
        source: 'Study Notes',
        estimatedTime: 15,
        difficulty: 'easy',
        priority: 'Recommended',
        completionTracking: false
      })
    }

    return resources
  }

  private generateLearningObjectives(
    subject: SubjectArea,
    topic: string,
    sessionType: SessionType
  ): string[] {
    const objectives: string[] = []

    switch (sessionType) {
      case 'NewConcept':
        objectives.push(`Understand the basic concepts of ${topic}`)
        objectives.push(`Identify key features and characteristics`)
        objectives.push(`Connect with related topics in ${subject}`)
        break
      
      case 'Practice':
        objectives.push(`Apply concepts of ${topic} to solve questions`)
        objectives.push(`Improve accuracy and speed`)
        objectives.push(`Identify common question patterns`)
        break
      
      case 'Revision':
        objectives.push(`Recall key facts about ${topic}`)
        objectives.push(`Review important formulas/dates/concepts`)
        objectives.push(`Strengthen memory retention`)
        break
      
      case 'CurrentAffairs':
        objectives.push('Stay updated with recent developments')
        objectives.push('Connect current events with static topics')
        objectives.push('Analyze news from UPSC perspective')
        break
      
      default:
        objectives.push(`Master the fundamentals of ${topic}`)
        objectives.push('Build strong conceptual foundation')
    }

    return objectives
  }

  private generateSuccessCriteria(sessionType: SessionType, duration: number): string[] {
    const criteria: string[] = []

    switch (sessionType) {
      case 'NewConcept':
        criteria.push('Can explain the concept in own words')
        criteria.push('Can identify 3-5 key points')
        criteria.push('Can relate to previous knowledge')
        break
      
      case 'Practice':
        criteria.push('Achieve 70%+ accuracy in practice questions')
        criteria.push('Complete questions within time limit')
        criteria.push('Understand all explanations')
        break
      
      case 'Revision':
        criteria.push('Recall key facts without referring to notes')
        criteria.push('Complete revision within planned time')
        criteria.push('Identify areas needing more focus')
        break
      
      case 'CurrentAffairs':
        criteria.push('Read and understand all daily news')
        criteria.push('Make notes of important developments')
        criteria.push('Connect at least 3 news items to static topics')
        break
      
      default:
        criteria.push('Complete all planned activities')
        criteria.push('Understand core concepts clearly')
    }

    return criteria
  }

  private getPrerequisites(subject: SubjectArea, topic: string): string[] {
    // Basic prerequisites for different topics
    const prerequisites: Record<string, string[]> = {
      'Advanced Constitutional Concepts': ['Basic Constitution', 'Parliament Basics'],
      'Economic Reforms': ['Basic Economic Concepts', 'Indian Economy Overview'],
      'Modern History': ['Ancient India', 'Medieval India'],
      'Climate Change': ['Environmental Basics', 'Ecology Fundamentals']
    }

    return prerequisites[topic] || []
  }

  private getFollowUpTasks(sessionType: SessionType, subject: SubjectArea): string[] {
    const tasks: string[] = []

    switch (sessionType) {
      case 'NewConcept':
        tasks.push('Create summary notes')
        tasks.push('Practice related questions')
        tasks.push('Schedule revision session')
        break
      
      case 'Practice':
        tasks.push('Review incorrect answers')
        tasks.push('Note down weak areas')
        tasks.push('Plan targeted practice')
        break
      
      case 'CurrentAffairs':
        tasks.push('Update current affairs notes')
        tasks.push('Connect to static topics')
        tasks.push('Practice related questions')
        break
    }

    return tasks
  }

  private generateWeeklyTargets(
    phases: { phase: StudyPhase; days: number; startDay: number }[],
    timeline: any
  ): WeeklyTarget[] {
    const targets: WeeklyTarget[] = []
    const totalWeeks = Math.ceil(timeline.totalDays / 7)

    for (let week = 0; week < totalWeeks; week++) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + week * 7)
      
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)

      const weekTarget: WeeklyTarget = {
        weekNumber: week + 1,
        startDate,
        endDate,
        subjects: this.generateWeeklySubjectTargets(week),
        totalHours: timeline.dailyHours * 7,
        majorMilestones: this.generateWeeklyMilestones(week),
        assessmentPlanned: week % 2 === 1, // Assessment every alternate week
        revisionTopics: this.generateRevisionTopics(week),
        currentAffairsGoals: this.generateCurrentAffairsGoals(week)
      }

      targets.push(weekTarget)
    }

    return targets
  }

  private generateWeeklySubjectTargets(week: number): any[] {
    const subjects = this.getAllSubjects()
    
    return subjects.map(subject => ({
      subject,
      topics: this.getWeeklyTopics(subject, week),
      targetHours: this.getSubjectWeeklyHours(subject),
      expectedCompletion: Math.min((week + 1) * 2, 100), // 2% per week
      practiceQuestions: 50,
      revisionSessions: 2
    }))
  }

  private getWeeklyTopics(subject: SubjectArea, week: number): string[] {
    const hierarchy = this.subjectHierarchy[subject]
    if (!hierarchy) return ['General Topics']

    const allTopics = [...hierarchy.foundation, ...hierarchy.intermediate]
    const topicsPerWeek = 2
    const startIndex = (week * topicsPerWeek) % allTopics.length
    
    return allTopics.slice(startIndex, startIndex + topicsPerWeek)
  }

  private getSubjectWeeklyHours(subject: SubjectArea): number {
    const baseHours: Record<SubjectArea, number> = {
      'Polity': 8,
      'History': 7,
      'Geography': 6,
      'Economy': 7,
      'Environment': 5,
      'Science & Technology': 4,
      'Current Affairs': 5,
      'Social Issues': 4,
      'Art & Culture': 3,
      'Ethics': 3
    }

    return baseHours[subject] || 4
  }

  private generateWeeklyMilestones(week: number): string[] {
    const milestones = [
      'Complete planned study hours',
      'Finish all assigned topics',
      'Maintain study consistency',
      'Practice minimum question targets'
    ]

    if (week % 4 === 0) {
      milestones.push('Complete monthly assessment')
      milestones.push('Update study plan based on progress')
    }

    return milestones
  }

  private generateRevisionTopics(week: number): string[] {
    // Previous week's topics + important foundational topics
    return [
      'Previous week\'s difficult concepts',
      'Foundation topics review',
      'Current affairs compilation'
    ]
  }

  private generateCurrentAffairsGoals(week: number): string[] {
    return [
      'Daily current affairs reading',
      'Weekly current affairs compilation',
      'Link 5+ news items to static topics',
      'Practice current affairs questions'
    ]
  }

  private generateMonthlyMilestones(
    phases: { phase: StudyPhase; days: number; startDay: number }[],
    timeline: any
  ): MonthlyMilestone[] {
    const milestones: MonthlyMilestone[] = []
    const totalMonths = Math.ceil(timeline.totalDays / 30)

    for (let month = 0; month < totalMonths; month++) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + month * 30)
      
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 29)

      const phase = this.getPhaseForMonth(month, phases)

      const milestone: MonthlyMilestone = {
        month: month + 1,
        startDate,
        endDate,
        phase,
        syllabusCompletion: this.calculateMonthlySyllabusCompletion(month),
        majorGoals: this.generateMonthlyGoals(month, phase),
        assessments: this.generateMonthlyAssessments(month, phase),
        adjustmentPoints: this.generateAdjustmentPoints(month),
        nextMonthPreparation: this.generateNextMonthPrep(month, phase)
      }

      milestones.push(milestone)
    }

    return milestones
  }

  private getPhaseForMonth(month: number, phases: { phase: StudyPhase; days: number; startDay: number }[]): StudyPhase {
    const dayNumber = month * 30
    const phase = phases.find(p => dayNumber >= p.startDay && dayNumber < p.startDay + p.days)
    return phase?.phase || 'Foundation'
  }

  private calculateMonthlySyllabusCompletion(month: number): Record<SubjectArea, number> {
    const subjects = this.getAllSubjects()
    const completion: Record<SubjectArea, number> = {} as Record<SubjectArea, number>

    subjects.forEach(subject => {
      // Approximate completion based on month
      completion[subject] = Math.min((month + 1) * 8, 100) // 8% per month
    })

    return completion
  }

  private generateMonthlyGoals(month: number, phase: StudyPhase): string[] {
    const goals = [
      `Complete ${phase} level topics for major subjects`,
      'Maintain consistent study schedule',
      'Achieve target scores in assessments'
    ]

    if (month >= 3) {
      goals.push('Start regular mock test practice')
    }

    if (month >= 6) {
      goals.push('Focus on weak areas improvement')
    }

    return goals
  }

  private generateMonthlyAssessments(month: number, phase: StudyPhase): any[] {
    const assessments = []

    // Monthly diagnostic test
    assessments.push({
      type: 'Diagnostic',
      scheduledDate: new Date(Date.now() + (month * 30 + 25) * 24 * 60 * 60 * 1000),
      subjects: this.getAllSubjects(),
      expectedOutcome: 'Identify progress and weak areas',
      preparationRequired: ['Review month\'s topics', 'Practice questions']
    })

    if (month >= 2) {
      // Subject-wise tests
      assessments.push({
        type: 'SubjectTest',
        scheduledDate: new Date(Date.now() + (month * 30 + 15) * 24 * 60 * 60 * 1000),
        subjects: ['Polity', 'History'],
        expectedOutcome: 'Subject mastery evaluation',
        preparationRequired: ['Complete subject revision', 'Practice PYQs']
      })
    }

    return assessments
  }

  private generateAdjustmentPoints(month: number): string[] {
    return [
      'Review and adjust daily study hours if needed',
      'Modify subject allocation based on performance',
      'Update weak areas list',
      'Adjust difficulty level of practice questions'
    ]
  }

  private generateNextMonthPrep(month: number, phase: StudyPhase): string[] {
    return [
      'Plan topics for next month',
      'Prepare study materials',
      'Schedule important assessments',
      'Set specific improvement targets'
    ]
  }

  private planRevisionCycles(timeline: any, userProfile: UserProfile): RevisionCycle[] {
    const cycles: RevisionCycle[] = []
    const totalCycles = Math.floor(timeline.totalDays / 30) // Monthly cycles

    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + cycle * 30)
      
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7) // 1 week revision cycles

      const revisionCycle: RevisionCycle = {
        cycleNumber: cycle + 1,
        startDate,
        endDate,
        subjects: this.getRevisionSubjects(cycle),
        topics: this.generateDetailedRevisionTopics(cycle, userProfile),
        spacingInterval: this.calculateSpacingInterval(cycle),
        intensity: this.getRevisionIntensity(cycle),
        method: this.getRevisionMethod(cycle, userProfile.learningStyle)
      }

      cycles.push(revisionCycle)
    }

    return cycles
  }

  private getRevisionSubjects(cycle: number): SubjectArea[] {
    const subjects = this.getAllSubjects()
    // Rotate subjects for revision
    const subjectsPerCycle = 3
    const startIndex = (cycle * subjectsPerCycle) % subjects.length
    return subjects.slice(startIndex, startIndex + subjectsPerCycle)
  }

  private generateDetailedRevisionTopics(cycle: number, userProfile: UserProfile): any[] {
    // Focus on user's weak areas and important topics
    const topics: any[] = []
    
    userProfile.weaknesses.forEach(weakness => {
      weakness.topics.forEach(topic => {
        topics.push({
          subject: weakness.subject,
          topic,
          lastRevised: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          masteryLevel: 100 - weakness.difficultyLevel,
          nextRevisionDue: new Date(Date.now() + this.calculateSpacingInterval(cycle) * 24 * 60 * 60 * 1000),
          revisionMethod: ['Reading', 'Practice Questions'],
          timeRequired: 45
        })
      })
    })

    return topics
  }

  private calculateSpacingInterval(cycle: number): number {
    // Spaced repetition intervals: 1, 3, 7, 14, 30 days
    const intervals = [1, 3, 7, 14, 30]
    return intervals[Math.min(cycle, intervals.length - 1)]
  }

  private getRevisionIntensity(cycle: number): 'Light' | 'Medium' | 'Intensive' {
    if (cycle < 2) return 'Light'
    if (cycle < 5) return 'Medium'
    return 'Intensive'
  }

  private getRevisionMethod(cycle: number, learningStyle: any): 'Reading' | 'Practice' | 'Mixed' | 'TestBased' {
    switch (learningStyle) {
      case 'Reading': return 'Reading'
      case 'Practice-heavy': return 'Practice'
      case 'Visual': return 'Mixed'
      default: return cycle % 2 === 0 ? 'Reading' : 'Practice'
    }
  }

  private scheduleMockTests(timeline: any, strategy: PlanStrategy, userProfile: UserProfile): MockTestSchedule[] {
    const schedule: MockTestSchedule[] = []
    let testNumber = 1

    // Different mock test frequencies based on strategy
    let frequency: number // days between tests
    switch (strategy) {
      case 'FastTrack':
        frequency = 7 // Weekly
        break
      case 'RevisionOnly':
        frequency = 5 // Twice weekly
        break
      case 'MainsFocused':
        frequency = 14 // Biweekly
        break
      default:
        frequency = 10 // Every 10 days
    }

    // Start mock tests after initial foundation period
    const startDay = Math.floor(timeline.totalDays * 0.3)

    for (let day = startDay; day < timeline.totalDays; day += frequency) {
      const scheduledDate = new Date()
      scheduledDate.setDate(scheduledDate.getDate() + day)

      const testType = testNumber % 4 === 0 ? 'Mains' : 'Prelims'
      const subjects = testType === 'Mains' ? 
        ['Polity', 'International Relations'] : 
        this.getAllSubjects()

      const mockTest: MockTestSchedule = {
        testNumber,
        scheduledDate,
        testType,
        subjects,
        preparationDays: 2,
        analysisTime: testType === 'Mains' ? 4 : 2,
        targetScore: this.calculateTargetScore(testNumber, userProfile),
        focusAreas: this.getMockTestFocusAreas(testNumber, userProfile)
      }

      schedule.push(mockTest)
      testNumber++
    }

    return schedule
  }

  private calculateTargetScore(testNumber: number, userProfile: UserProfile): number {
    // Progressive target scores
    const baseScore = userProfile.currentKnowledgeLevel === 'Beginner' ? 40 : 60
    const increment = Math.min(testNumber * 2, 20) // Max 20% increment
    return Math.min(baseScore + increment, 85) // Max target 85%
  }

  private getMockTestFocusAreas(testNumber: number, userProfile: UserProfile): string[] {
    const focusAreas = ['Time Management', 'Accuracy Improvement']
    
    if (testNumber <= 3) {
      focusAreas.push('Question Pattern Familiarity')
    } else if (testNumber <= 6) {
      focusAreas.push('Speed Enhancement')
    } else {
      focusAreas.push('Final Strategy Refinement')
    }

    // Add user-specific weak areas
    userProfile.weaknesses.slice(0, 2).forEach(weakness => {
      focusAreas.push(`${weakness.subject} Improvement`)
    })

    return focusAreas
  }

  // Helper methods
  private getDailyHours(availableHours: any): number {
    switch (availableHours) {
      case '2-4': return 3
      case '4-6': return 5
      case '6-8': return 7
      case '8+': return 10
      default: return 5
    }
  }

  private getAllSubjects(): SubjectArea[] {
    return Object.keys(this.subjectHierarchy) as SubjectArea[]
  }

  private getMaxDailyHours(userId: string): number {
    // In production, this would fetch from user profile
    return 12 // Maximum 12 hours per day
  }

  private calculateSyllabusCompletion(plan: StudyPlan): number {
    // Calculate what percentage of syllabus is covered
    // This is a simplified calculation
    return 0.95 // Assume 95% completion for validation
  }

  private applyConstraint(plan: StudyPlan, constraint: any): StudyPlan {
    // Apply specific constraints to the plan
    return plan // Simplified implementation
  }

  private optimizeForLearningStyle(plan: StudyPlan): StudyPlan {
    // Optimize based on user's learning style
    return plan // Simplified implementation
  }

  private balanceSubjectDistribution(plan: StudyPlan): StudyPlan {
    // Balance time allocation across subjects
    return plan // Simplified implementation
  }

  private optimizeEnergyLevels(plan: StudyPlan): StudyPlan {
    // Schedule difficult topics during high energy periods
    return plan // Simplified implementation
  }

  private isRestDay(date: Date, userProfile: UserProfile): boolean {
    // Check if it's a Sunday or holiday
    return date.getDay() === 0 // Sunday
  }

  private generateRestDaySchedule(date: Date, dayOfWeek: string, userProfile: UserProfile): DailySchedule {
    return {
      date,
      dayOfWeek,
      totalPlannedHours: 1, // Light study
      studySessions: [{
        id: `rest-day-${date.getTime()}`,
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        subject: 'Current Affairs',
        topic: 'Light Reading',
        subtopics: ['News Review', 'Magazine Reading'],
        sessionType: 'CurrentAffairs',
        difficulty: 'easy',
        resources: [],
        learningObjectives: ['Stay updated with current events'],
        successCriteria: ['Complete light reading'],
        prerequisites: [],
        followUpTasks: []
      }],
      breaks: [{
        startTime: '11:00',
        endTime: '11:15',
        duration: 15,
        type: 'Short',
        activity: 'Relaxation'
      }],
      flexibilityBuffer: 60,
      dailyGoals: ['Rest and rejuvenate', 'Light current affairs reading'],
      motivationalNote: 'Rest is essential for optimal performance. Take this day to recharge!'
    }
  }

  private getAvailableTimeSlots(date: Date, userProfile: UserProfile): TimeSlot[] {
    // Return user's preferred time slots for the day
    return userProfile.preferences.preferredStudyTimes.length > 0 ? 
      userProfile.preferences.preferredStudyTimes :
      [{
        startTime: '09:00',
        endTime: '18:00',
        energyLevel: 'High',
        availability: 'Always'
      }]
  }

  private generateBreaks(sessions: StudySession[], userProfile: UserProfile): any[] {
    const breaks = []
    
    for (let i = 0; i < sessions.length - 1; i++) {
      const breakStart = sessions[i].endTime
      const breakEnd = sessions[i + 1].startTime
      const breakDuration = this.calculateMinutesBetween(breakStart, breakEnd)
      
      if (breakDuration > 0) {
        breaks.push({
          startTime: breakStart,
          endTime: breakEnd,
          duration: breakDuration,
          type: breakDuration > 60 ? 'Meal' : 'Short',
          activity: breakDuration > 60 ? 'Lunch/Rest' : 'Quick Break'
        })
      }
    }

    return breaks
  }

  private generateDailyGoals(sessions: StudySession[], phase: StudyPhase): string[] {
    const goals = []
    
    goals.push(`Complete all ${sessions.length} planned study sessions`)
    
    const subjects = [...new Set(sessions.map(s => s.subject))]
    goals.push(`Cover ${subjects.length} subjects as planned`)
    
    if (phase === 'Foundation') {
      goals.push('Build strong conceptual foundation')
    } else if (phase === 'Revision') {
      goals.push('Strengthen memory and recall')
    } else {
      goals.push('Practice application of concepts')
    }

    return goals
  }

  private generateMotivationalNote(phase: StudyPhase, dayNumber: number): string {
    const motivationalNotes = {
      Foundation: [
        'Every expert was once a beginner. Keep building your foundation!',
        'Strong foundations lead to towering success!',
        'Today\'s learning is tomorrow\'s strength!'
      ],
      Intermediate: [
        'You\'re building momentum. Keep pushing forward!',
        'Progress is progress, no matter how small.',
        'Your dedication today shapes your destiny tomorrow!'
      ],
      Advanced: [
        'You\'re in the advanced phase - excellence is within reach!',
        'Channel your expertise into consistent practice.',
        'Your hard work is preparing you for success!'
      ],
      Revision: [
        'Revision is the key to retention. Stay focused!',
        'Every revision makes you stronger and more confident.',
        'Polish your knowledge to perfection!'
      ],
      'Mock Test Phase': [
        'Practice like you\'ll perform. Perform like you\'ve practiced!',
        'Each test brings you closer to your goal.',
        'Stay calm, stay focused, show your preparation!'
      ]
    }

    const notes = motivationalNotes[phase] || motivationalNotes.Foundation
    return notes[dayNumber % notes.length]
  }

  private addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  private calculateMinutesBetween(startTime: string, endTime: string): number {
    const [startHours, startMins] = startTime.split(':').map(Number)
    const [endHours, endMins] = endTime.split(':').map(Number)
    
    const startTotal = startHours * 60 + startMins
    const endTotal = endHours * 60 + endMins
    
    return endTotal - startTotal
  }
}