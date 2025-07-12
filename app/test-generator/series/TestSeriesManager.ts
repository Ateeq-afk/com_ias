import {
  TestSeries,
  TestSeriesConfig,
  TestSchedule,
  PrelimsTest,
  MainsTest,
  TestConfiguration,
  TestSeriesManager
} from '../types'
import { PrelimsTestGenerator } from '../generators/PrelimsTestGenerator'
import { MainsTestGenerator } from '../generators/MainsTestGenerator'
import { SectionalTestGenerator } from '../generators/SectionalTestGenerator'
import { SubjectArea } from '../../question-generator/types'

export class UPSCTestSeriesManager implements TestSeriesManager {
  private prelimsGenerator = new PrelimsTestGenerator()
  private mainsGenerator = new MainsTestGenerator()
  private sectionalGenerator = new SectionalTestGenerator()

  async createTestSeries(config: TestSeriesConfig): Promise<TestSeries> {
    const schedule = await this.createSeriesSchedule(config)
    
    return {
      id: `test-series-${Date.now()}`,
      name: config.name,
      type: config.type,
      totalTests: config.totalTests,
      schedule,
      currentTestIndex: 0,
      enrolledUsers: 0,
      averageScore: 0,
      createdAt: new Date()
    }
  }

  async scheduleTests(seriesId: string): Promise<TestSchedule[]> {
    // In production, this would fetch series config from database
    const mockConfig: TestSeriesConfig = {
      name: 'UPSC Prelims Test Series 2024',
      type: 'Prelims',
      totalTests: 60,
      frequency: 'Weekly',
      startDate: new Date(),
      syllabusProgression: 'Spiral'
    }

    return this.createSeriesSchedule(mockConfig)
  }

  async getNextTest(seriesId: string, userId: string): Promise<PrelimsTest | MainsTest> {
    // In production, this would check user progress and return next test
    const mockProgress = await this.getUserProgress(seriesId, userId)
    const nextTestIndex = mockProgress.currentTestIndex + 1
    
    // Generate appropriate test based on series type and progress
    if (mockProgress.seriesType === 'Prelims') {
      return this.generatePrelimsTestForSeries(nextTestIndex, mockProgress.syllabusProgression)
    } else {
      return this.generateMainsTestForSeries(nextTestIndex, mockProgress.syllabusProgression)
    }
  }

  async updateProgress(seriesId: string, userId: string, testId: string): Promise<void> {
    // In production, this would update user progress in database
    console.log(`Updated progress for user ${userId} in series ${seriesId}, completed test ${testId}`)
  }

  async createPrelimsTestSeries(): Promise<TestSeries> {
    const config: TestSeriesConfig = {
      name: 'UPSC Prelims Test Series 2024',
      type: 'Prelims',
      totalTests: 60,
      frequency: 'Weekly',
      startDate: new Date(),
      syllabusProgression: 'Spiral'
    }

    return this.createTestSeries(config)
  }

  async createMainsTestSeries(): Promise<TestSeries> {
    const config: TestSeriesConfig = {
      name: 'UPSC Mains Test Series 2024',
      type: 'Mains',
      totalTests: 30,
      frequency: 'Biweekly',
      startDate: new Date(),
      syllabusProgression: 'Linear'
    }

    return this.createTestSeries(config)
  }

  async createIntegratedTestSeries(): Promise<TestSeries> {
    const config: TestSeriesConfig = {
      name: 'UPSC Integrated Test Series 2024',
      type: 'Integrated',
      totalTests: 40,
      frequency: 'Weekly',
      startDate: new Date(),
      syllabusProgression: 'Mixed'
    }

    return this.createTestSeries(config)
  }

  async generateFoundationSeries(): Promise<TestSeries> {
    // Series for beginners focusing on basic concepts
    const schedule: TestSchedule[] = []
    const startDate = new Date()
    
    const subjects: SubjectArea[] = ['Polity', 'History', 'Geography', 'Economy']
    
    subjects.forEach((subject, index) => {
      for (let week = 1; week <= 4; week++) {
        const testDate = new Date(startDate)
        testDate.setDate(startDate.getDate() + (index * 28) + (week - 1) * 7)
        
        schedule.push({
          testNumber: index * 4 + week,
          title: `${subject} Foundation Test ${week}`,
          type: 'Sectional',
          subjects: [subject],
          scheduledDate: testDate,
          status: 'Upcoming',
          syllabusCoverage: [`Basic ${subject} concepts`, `Foundation level questions`]
        })
      }
    })

    return {
      id: `foundation-series-${Date.now()}`,
      name: 'Foundation Test Series',
      type: 'Prelims',
      totalTests: 16,
      schedule,
      currentTestIndex: 0,
      enrolledUsers: 0,
      averageScore: 0,
      createdAt: new Date()
    }
  }

  async generateAdvancedSeries(): Promise<TestSeries> {
    // Series for advanced students
    const schedule: TestSchedule[] = []
    const startDate = new Date()
    
    for (let week = 1; week <= 20; week++) {
      const testDate = new Date(startDate)
      testDate.setDate(startDate.getDate() + (week - 1) * 7)
      
      if (week % 4 === 0) {
        // Grand test every 4 weeks
        schedule.push({
          testNumber: week,
          title: `Grand Test ${Math.floor(week / 4)}`,
          type: 'Grand',
          subjects: undefined,
          scheduledDate: testDate,
          status: 'Upcoming',
          syllabusCoverage: ['All subjects', 'Advanced level', 'Current affairs integration']
        })
      } else {
        // Regular Prelims tests
        schedule.push({
          testNumber: week,
          title: `Advanced Prelims Test ${week}`,
          type: 'Prelims',
          subjects: undefined,
          scheduledDate: testDate,
          status: 'Upcoming',
          syllabusCoverage: ['Mixed subjects', 'Hard difficulty', 'Analytical questions']
        })
      }
    }

    return {
      id: `advanced-series-${Date.now()}`,
      name: 'Advanced Test Series',
      type: 'Prelims',
      totalTests: 20,
      schedule,
      currentTestIndex: 0,
      enrolledUsers: 0,
      averageScore: 0,
      createdAt: new Date()
    }
  }

  async generateRevisionSeries(): Promise<TestSeries> {
    // Series for revision phase (2 months before exam)
    const schedule: TestSchedule[] = []
    const startDate = new Date()
    
    // Daily tests for 60 days
    for (let day = 1; day <= 60; day++) {
      const testDate = new Date(startDate)
      testDate.setDate(startDate.getDate() + day - 1)
      
      const testType = day % 7 === 0 ? 'Grand' : 'Sectional'
      const title = testType === 'Grand' ? 
        `Grand Revision Test ${Math.floor(day / 7)}` : 
        `Daily Revision Test ${day}`
      
      schedule.push({
        testNumber: day,
        title,
        type: testType,
        subjects: testType === 'Grand' ? undefined : [this.getRevisionSubject(day)],
        scheduledDate: testDate,
        status: 'Upcoming',
        syllabusCoverage: testType === 'Grand' ? 
          ['All subjects', 'Previous year pattern', 'Time bound'] :
          ['Topic revision', 'Quick practice', 'Concept reinforcement']
      })
    }

    return {
      id: `revision-series-${Date.now()}`,
      name: 'Revision Test Series',
      type: 'Prelims',
      totalTests: 60,
      schedule,
      currentTestIndex: 0,
      enrolledUsers: 0,
      averageScore: 0,
      createdAt: new Date()
    }
  }

  async generateCurrentAffairsSeries(): Promise<TestSeries> {
    // Monthly current affairs tests
    const schedule: TestSchedule[] = []
    const startDate = new Date()
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    months.forEach((month, index) => {
      const testDate = new Date(startDate)
      testDate.setMonth(startDate.getMonth() + index)
      
      schedule.push({
        testNumber: index + 1,
        title: `${month} Current Affairs Test`,
        type: 'Sectional',
        subjects: ['Current Affairs'],
        scheduledDate: testDate,
        status: 'Upcoming',
        syllabusCoverage: [
          `${month} current events`,
          'Government schemes and policies',
          'International developments',
          'Science and technology updates'
        ]
      })
    })

    return {
      id: `current-affairs-series-${Date.now()}`,
      name: 'Current Affairs Test Series',
      type: 'Prelims',
      totalTests: 12,
      schedule,
      currentTestIndex: 0,
      enrolledUsers: 0,
      averageScore: 0,
      createdAt: new Date()
    }
  }

  private async createSeriesSchedule(config: TestSeriesConfig): Promise<TestSchedule[]> {
    const schedule: TestSchedule[] = []
    const startDate = config.startDate
    
    const frequencyDays = {
      'Daily': 1,
      'Weekly': 7,
      'Biweekly': 14
    }
    
    const daysBetweenTests = frequencyDays[config.frequency]
    
    for (let i = 0; i < config.totalTests; i++) {
      const testDate = new Date(startDate)
      testDate.setDate(startDate.getDate() + i * daysBetweenTests)
      
      const testSchedule = this.createIndividualTestSchedule(
        i + 1,
        testDate,
        config,
        i
      )
      
      schedule.push(testSchedule)
    }

    return schedule
  }

  private createIndividualTestSchedule(
    testNumber: number,
    date: Date,
    config: TestSeriesConfig,
    index: number
  ): TestSchedule {
    const syllabusProgression = this.getSyllabusForTest(config, testNumber)
    const testType = this.determineTestType(config, testNumber)
    
    return {
      testNumber,
      title: this.generateTestTitle(config, testNumber, testType),
      type: testType,
      subjects: this.getSubjectsForTest(config, testNumber),
      scheduledDate: date,
      status: 'Upcoming',
      syllabusCoverage: syllabusProgression
    }
  }

  private getSyllabusForTest(config: TestSeriesConfig, testNumber: number): string[] {
    const allTopics = this.getAllSyllabusTopics()
    
    switch (config.syllabusProgression) {
      case 'Linear':
        // Sequential coverage
        const topicsPerTest = Math.ceil(allTopics.length / config.totalTests)
        const startIndex = (testNumber - 1) * topicsPerTest
        return allTopics.slice(startIndex, startIndex + topicsPerTest)
        
      case 'Spiral':
        // Revisit topics with increasing complexity
        const phase = Math.floor((testNumber - 1) / 20) + 1
        return allTopics.map(topic => `${topic} (Phase ${phase})`)
        
      case 'Mixed':
        // Random mix of topics
        const shuffled = [...allTopics].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, Math.min(10, allTopics.length))
        
      default:
        return allTopics.slice(0, 10)
    }
  }

  private determineTestType(config: TestSeriesConfig, testNumber: number): any {
    if (config.type === 'Integrated') {
      // Mix Prelims and Mains
      return testNumber % 3 === 0 ? 'Mains' : 'Prelims'
    }
    
    // Special tests at intervals
    if (testNumber % 10 === 0) {
      return 'Grand'
    }
    
    if (testNumber % 5 === 0) {
      return 'Sectional'
    }
    
    return config.type === 'Mains' ? 'Mains' : 'Prelims'
  }

  private generateTestTitle(config: TestSeriesConfig, testNumber: number, testType: any): string {
    if (testType === 'Grand') {
      return `Grand Test ${Math.floor(testNumber / 10)}`
    }
    
    if (testType === 'Sectional') {
      const subjects = ['Polity', 'History', 'Geography', 'Economy', 'Environment']
      const subject = subjects[(testNumber - 1) % subjects.length]
      return `${subject} Sectional Test`
    }
    
    return `${config.type} Test ${testNumber}`
  }

  private getSubjectsForTest(config: TestSeriesConfig, testNumber: number): SubjectArea[] | undefined {
    const testType = this.determineTestType(config, testNumber)
    
    if (testType === 'Sectional') {
      const subjects: SubjectArea[] = ['Polity', 'History', 'Geography', 'Economy', 'Environment']
      return [subjects[(testNumber - 1) % subjects.length]]
    }
    
    return undefined // Full syllabus
  }

  private getAllSyllabusTopics(): string[] {
    return [
      'Indian Constitution',
      'Parliamentary System',
      'Judiciary',
      'Executive',
      'Ancient India',
      'Medieval India',
      'Modern India',
      'Freedom Struggle',
      'Post-Independence',
      'Physical Geography',
      'Human Geography',
      'Indian Geography',
      'World Geography',
      'Basic Economic Concepts',
      'Indian Economy',
      'Economic Development',
      'International Economics',
      'Ecology and Environment',
      'Climate Change',
      'Biodiversity',
      'Environmental Laws',
      'Science and Technology',
      'Space Technology',
      'Defence Technology',
      'Medical Science',
      'Current Affairs',
      'International Relations',
      'Government Schemes',
      'Reports and Indices'
    ]
  }

  private async getUserProgress(seriesId: string, userId: string): Promise<{
    currentTestIndex: number
    seriesType: 'Prelims' | 'Mains' | 'Integrated'
    syllabusProgression: 'Linear' | 'Mixed' | 'Spiral'
  }> {
    // Mock user progress
    return {
      currentTestIndex: Math.floor(Math.random() * 10),
      seriesType: 'Prelims',
      syllabusProgression: 'Spiral'
    }
  }

  private async generatePrelimsTestForSeries(
    testIndex: number,
    syllabusProgression: string
  ): Promise<PrelimsTest> {
    const config: TestConfiguration = {
      testType: 'Prelims',
      duration: 120,
      totalQuestions: 100,
      negativeMarking: -0.66,
      subjectDistribution: this.getSeriesSubjectDistribution(testIndex),
      difficultyDistribution: this.getSeriesDifficultyDistribution(testIndex)
    }

    return this.prelimsGenerator.generateTest(config)
  }

  private async generateMainsTestForSeries(
    testIndex: number,
    syllabusProgression: string
  ): Promise<MainsTest> {
    const config: TestConfiguration = {
      testType: 'Mains',
      duration: 180,
      totalQuestions: 20,
      negativeMarking: 0,
      subjectDistribution: [],
      difficultyDistribution: {
        easy: 0.2,
        medium: 0.5,
        hard: 0.3
      }
    }

    return this.mainsGenerator.generateTest(config)
  }

  private getSeriesSubjectDistribution(testIndex: number): any[] {
    // Adjust distribution based on test position in series
    const baseDistribution = [
      { subject: 'Polity', minQuestions: 17, maxQuestions: 22 },
      { subject: 'History', minQuestions: 15, maxQuestions: 18 },
      { subject: 'Geography', minQuestions: 12, maxQuestions: 15 },
      { subject: 'Economy', minQuestions: 13, maxQuestions: 17 },
      { subject: 'Environment', minQuestions: 10, maxQuestions: 12 },
      { subject: 'Science & Technology', minQuestions: 7, maxQuestions: 10 },
      { subject: 'Current Affairs', minQuestions: 22, maxQuestions: 27 }
    ]

    // Vary emphasis based on test number
    if (testIndex % 10 === 1) {
      // Polity focus
      baseDistribution[0].minQuestions += 3
      baseDistribution[0].maxQuestions += 3
    } else if (testIndex % 10 === 2) {
      // History focus
      baseDistribution[1].minQuestions += 3
      baseDistribution[1].maxQuestions += 3
    }

    return baseDistribution
  }

  private getSeriesDifficultyDistribution(testIndex: number): any {
    // Progressive difficulty increase
    const progressRatio = Math.min(testIndex / 50, 1) // Assuming 50 test series
    
    const easyPercentage = Math.max(0.15, 0.35 - progressRatio * 0.2)
    const hardPercentage = Math.min(0.35, 0.15 + progressRatio * 0.2)
    const mediumPercentage = 1 - easyPercentage - hardPercentage

    return {
      easy: easyPercentage,
      medium: mediumPercentage,
      hard: hardPercentage
    }
  }

  private getRevisionSubject(day: number): SubjectArea {
    const subjects: SubjectArea[] = [
      'Polity', 'History', 'Geography', 'Economy', 
      'Environment', 'Science & Technology', 'Current Affairs'
    ]
    return subjects[(day - 1) % subjects.length]
  }
}