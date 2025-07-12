import {
  AdaptiveTest,
  UserProfile,
  TestAttempt,
  TestConfiguration,
  AdaptiveTestGenerator
} from '../types'
import { Question, SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class AdaptiveTestEngine implements AdaptiveTestGenerator {
  
  async analyzeUserProfile(userId: string): Promise<UserProfile> {
    // In production, this would fetch from database
    const attemptHistory = await this.getAttemptHistory(userId)
    
    return {
      userId,
      weakAreas: await this.identifyWeakAreas(attemptHistory),
      strongAreas: await this.identifyStrongAreas(attemptHistory),
      overallAccuracy: this.calculateOverallAccuracy(attemptHistory),
      averageTimePerQuestion: this.calculateAverageTime(attemptHistory),
      attemptHistory
    }
  }

  async generateAdaptiveTest(
    profile: UserProfile,
    config: Partial<TestConfiguration> = {}
  ): Promise<AdaptiveTest> {
    const testConfig = this.buildAdaptiveConfig(profile, config)
    const questions = await this.selectAdaptiveQuestions(profile, testConfig)
    const difficultyProgression = this.planDifficultyProgression(profile, questions.length)
    
    return {
      id: `adaptive-test-${profile.userId}-${Date.now()}`,
      title: 'Adaptive Practice Test',
      userProfile: profile,
      duration: testConfig.duration || 90,
      totalQuestions: questions.length,
      questions,
      focusAreas: this.extractFocusAreas(profile),
      difficultyProgression,
      createdAt: new Date()
    }
  }

  async updateProfileAfterAttempt(
    profile: UserProfile,
    attempt: TestAttempt
  ): Promise<UserProfile> {
    const updatedHistory = [...profile.attemptHistory, attempt]
    
    return {
      ...profile,
      weakAreas: await this.identifyWeakAreas(updatedHistory),
      strongAreas: await this.identifyStrongAreas(updatedHistory),
      overallAccuracy: this.calculateOverallAccuracy(updatedHistory),
      averageTimePerQuestion: this.calculateAverageTime(updatedHistory),
      attemptHistory: updatedHistory
    }
  }

  async generateProgressiveTest(
    profile: UserProfile,
    targetImprovement: number = 10 // percentage improvement target
  ): Promise<AdaptiveTest> {
    // Generate test that gradually increases difficulty
    const questions = await this.selectProgressiveQuestions(profile, targetImprovement)
    const difficultyProgression = this.createProgressiveProgression(questions.length)
    
    return {
      id: `progressive-test-${profile.userId}-${Date.now()}`,
      title: 'Progressive Difficulty Test',
      userProfile: profile,
      duration: Math.ceil(questions.length * 1.5), // More time for progressive difficulty
      totalQuestions: questions.length,
      questions,
      focusAreas: [`Improvement in ${profile.weakAreas[0]?.subject || 'Overall'}`],
      difficultyProgression,
      createdAt: new Date()
    }
  }

  async generateTargetedWeaknessTest(
    profile: UserProfile,
    maxWeakAreas: number = 3
  ): Promise<AdaptiveTest> {
    const topWeakAreas = profile.weakAreas.slice(0, maxWeakAreas)
    const questions = await this.selectWeaknessTargetedQuestions(topWeakAreas)
    
    return {
      id: `weakness-targeted-${profile.userId}-${Date.now()}`,
      title: 'Weakness Targeted Test',
      userProfile: profile,
      duration: 60,
      totalQuestions: questions.length,
      questions,
      focusAreas: topWeakAreas.map(area => `${area.subject} - ${area.topics.join(', ')}`),
      difficultyProgression: this.createTargetedProgression(questions.length),
      createdAt: new Date()
    }
  }

  async generateSpeedVsAccuracyTest(
    profile: UserProfile,
    focusMode: 'speed' | 'accuracy' | 'balanced'
  ): Promise<AdaptiveTest> {
    const questions = await this.selectSpeedAccuracyQuestions(profile, focusMode)
    const timePerQuestion = this.calculateOptimalTime(profile, focusMode)
    
    return {
      id: `speed-accuracy-${focusMode}-${profile.userId}-${Date.now()}`,
      title: `${focusMode.charAt(0).toUpperCase() + focusMode.slice(1)} Focus Test`,
      userProfile: profile,
      duration: Math.ceil(questions.length * timePerQuestion),
      totalQuestions: questions.length,
      questions,
      focusAreas: [`${focusMode} optimization`],
      difficultyProgression: this.createBalancedProgression(questions.length),
      createdAt: new Date()
    }
  }

  private async getAttemptHistory(userId: string): Promise<TestAttempt[]> {
    // Mock attempt history for demonstration
    return [
      {
        testId: 'prelims-test-1',
        userId,
        attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        responses: this.generateMockResponses('Polity', 20, 0.65),
        score: 65,
        accuracy: 65,
        timeSpent: 120,
        percentile: 45
      },
      {
        testId: 'sectional-history-1',
        userId,
        attemptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        responses: this.generateMockResponses('History', 25, 0.45),
        score: 45,
        accuracy: 45,
        timeSpent: 45,
        percentile: 30
      },
      {
        testId: 'economy-test-1',
        userId,
        attemptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        responses: this.generateMockResponses('Economy', 30, 0.80),
        score: 80,
        accuracy: 80,
        timeSpent: 60,
        percentile: 75
      }
    ]
  }

  private generateMockResponses(subject: string, count: number, accuracy: number): any[] {
    const responses = []
    for (let i = 0; i < count; i++) {
      responses.push({
        questionId: `${subject.toLowerCase()}-q${i + 1}`,
        selectedOption: Math.floor(Math.random() * 4),
        timeSpent: 60 + Math.random() * 120, // 1-3 minutes
        isCorrect: Math.random() < accuracy,
        marksAwarded: Math.random() < accuracy ? 2 : -0.66
      })
    }
    return responses
  }

  private async identifyWeakAreas(attempts: TestAttempt[]): Promise<UserProfile['weakAreas']> {
    const subjectPerformance = new Map<SubjectArea, { total: number; correct: number; topics: Set<string> }>()
    
    // Aggregate performance by subject
    attempts.forEach(attempt => {
      attempt.responses.forEach(response => {
        // Extract subject from questionId (simplified)
        const subject = this.extractSubjectFromQuestionId(response.questionId)
        
        if (!subjectPerformance.has(subject)) {
          subjectPerformance.set(subject, { total: 0, correct: 0, topics: new Set() })
        }
        
        const perf = subjectPerformance.get(subject)!
        perf.total++
        if (response.isCorrect) perf.correct++
        
        // Extract topic (simplified)
        const topic = this.extractTopicFromQuestionId(response.questionId)
        perf.topics.add(topic)
      })
    })

    // Identify weak areas (accuracy < 60%)
    const weakAreas: UserProfile['weakAreas'] = []
    subjectPerformance.forEach((perf, subject) => {
      const accuracy = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0
      if (accuracy < 60) {
        weakAreas.push({
          subject,
          topics: Array.from(perf.topics),
          averageScore: accuracy
        })
      }
    })

    return weakAreas.sort((a, b) => a.averageScore - b.averageScore)
  }

  private async identifyStrongAreas(attempts: TestAttempt[]): Promise<UserProfile['strongAreas']> {
    const subjectPerformance = new Map<SubjectArea, { total: number; correct: number; topics: Set<string> }>()
    
    // Similar logic as weak areas but for strong performance (accuracy > 75%)
    attempts.forEach(attempt => {
      attempt.responses.forEach(response => {
        const subject = this.extractSubjectFromQuestionId(response.questionId)
        
        if (!subjectPerformance.has(subject)) {
          subjectPerformance.set(subject, { total: 0, correct: 0, topics: new Set() })
        }
        
        const perf = subjectPerformance.get(subject)!
        perf.total++
        if (response.isCorrect) perf.correct++
        
        const topic = this.extractTopicFromQuestionId(response.questionId)
        perf.topics.add(topic)
      })
    })

    const strongAreas: UserProfile['strongAreas'] = []
    subjectPerformance.forEach((perf, subject) => {
      const accuracy = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0
      if (accuracy > 75) {
        strongAreas.push({
          subject,
          topics: Array.from(perf.topics),
          averageScore: accuracy
        })
      }
    })

    return strongAreas.sort((a, b) => b.averageScore - a.averageScore)
  }

  private calculateOverallAccuracy(attempts: TestAttempt[]): number {
    if (attempts.length === 0) return 0
    
    const totalAccuracy = attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0)
    return totalAccuracy / attempts.length
  }

  private calculateAverageTime(attempts: TestAttempt[]): number {
    if (attempts.length === 0) return 0
    
    let totalQuestions = 0
    let totalTime = 0
    
    attempts.forEach(attempt => {
      totalQuestions += attempt.responses.length
      totalTime += attempt.responses.reduce((sum, response) => sum + response.timeSpent, 0)
    })

    return totalQuestions > 0 ? totalTime / totalQuestions : 0
  }

  private buildAdaptiveConfig(
    profile: UserProfile,
    config: Partial<TestConfiguration>
  ): TestConfiguration {
    const defaultQuestionCount = 30
    const weakAreasWeight = Math.min(profile.weakAreas.length / 3, 1) // Max weight of 1
    
    return {
      testType: 'Adaptive',
      duration: config.duration || 45,
      totalQuestions: config.totalQuestions || defaultQuestionCount,
      negativeMarking: -0.66,
      subjectDistribution: this.calculateAdaptiveSubjectDistribution(profile),
      difficultyDistribution: this.calculateAdaptiveDifficultyDistribution(profile),
      ...config
    }
  }

  private calculateAdaptiveSubjectDistribution(profile: UserProfile): any[] {
    const distribution: any[] = []
    const totalQuestions = 30
    
    // Allocate 60% questions to weak areas
    const weakAreaQuestions = Math.floor(totalQuestions * 0.6)
    const strongAreaQuestions = Math.floor(totalQuestions * 0.2)
    const mixedQuestions = totalQuestions - weakAreaQuestions - strongAreaQuestions
    
    // Distribute weak area questions
    if (profile.weakAreas.length > 0) {
      const questionsPerWeakArea = Math.floor(weakAreaQuestions / profile.weakAreas.length)
      profile.weakAreas.forEach(area => {
        distribution.push({
          subject: area.subject,
          minQuestions: questionsPerWeakArea,
          maxQuestions: questionsPerWeakArea + 2
        })
      })
    }

    // Add some strong areas for confidence building
    if (profile.strongAreas.length > 0) {
      const questionsPerStrongArea = Math.floor(strongAreaQuestions / Math.min(profile.strongAreas.length, 2))
      profile.strongAreas.slice(0, 2).forEach(area => {
        distribution.push({
          subject: area.subject,
          minQuestions: questionsPerStrongArea,
          maxQuestions: questionsPerStrongArea + 1
        })
      })
    }

    return distribution
  }

  private calculateAdaptiveDifficultyDistribution(profile: UserProfile): any {
    const baseAccuracy = profile.overallAccuracy

    if (baseAccuracy < 50) {
      // Struggling student: more easy questions
      return { easy: 0.5, medium: 0.35, hard: 0.15 }
    } else if (baseAccuracy < 70) {
      // Average student: balanced distribution
      return { easy: 0.3, medium: 0.5, hard: 0.2 }
    } else {
      // Advanced student: more challenging questions
      return { easy: 0.2, medium: 0.4, hard: 0.4 }
    }
  }

  private async selectAdaptiveQuestions(
    profile: UserProfile,
    config: TestConfiguration
  ): Promise<Question[]> {
    const questions: Question[] = []
    
    // Generate questions for weak areas
    for (const weakArea of profile.weakAreas.slice(0, 3)) {
      const areaQuestions = await this.generateQuestionsForSubject(
        weakArea.subject,
        weakArea.topics,
        8, // 8 questions per weak area
        this.getDifficultyForWeakArea(weakArea.averageScore)
      )
      questions.push(...areaQuestions)
    }

    // Add some questions from strong areas for confidence
    for (const strongArea of profile.strongAreas.slice(0, 1)) {
      const areaQuestions = await this.generateQuestionsForSubject(
        strongArea.subject,
        strongArea.topics,
        6, // 6 questions from strong area
        'medium'
      )
      questions.push(...areaQuestions)
    }

    return questions.slice(0, config.totalQuestions)
  }

  private getDifficultyForWeakArea(averageScore: number): DifficultyLevel {
    if (averageScore < 30) return 'easy'
    if (averageScore < 50) return 'medium'
    return 'hard'
  }

  private async generateQuestionsForSubject(
    subject: SubjectArea,
    topics: string[],
    count: number,
    difficulty: DifficultyLevel | 'mixed'
  ): Promise<Question[]> {
    // Simplified question generation for demo
    const questions: Question[] = []
    
    for (let i = 0; i < count; i++) {
      const topic = topics[i % topics.length]
      const questionDifficulty = difficulty === 'mixed' ? 
        (['easy', 'medium', 'hard'] as DifficultyLevel[])[i % 3] : 
        difficulty as DifficultyLevel
      
      questions.push({
        id: `adaptive-${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}-${i}`,
        type: 'SingleCorrectMCQ',
        subject,
        topic,
        subTopic: 'General',
        difficulty: questionDifficulty,
        question: `Adaptive question on ${topic} (${questionDifficulty})`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: `Targeted explanation for ${topic} based on user's weak areas`,
        concepts: [`${topic} concept`],
        yearAsked: [],
        source: 'Adaptive Generator',
        tags: ['adaptive', subject.toLowerCase(), questionDifficulty]
      })
    }

    return questions
  }

  private planDifficultyProgression(profile: UserProfile, questionCount: number): DifficultyLevel[] {
    const progression: DifficultyLevel[] = []
    const baseAccuracy = profile.overallAccuracy
    
    // Start with easier questions, gradually increase difficulty
    for (let i = 0; i < questionCount; i++) {
      const progressRatio = i / questionCount
      
      if (baseAccuracy < 50) {
        // Struggling student: gentle progression
        if (progressRatio < 0.6) progression.push('easy')
        else if (progressRatio < 0.9) progression.push('medium')
        else progression.push('hard')
      } else if (baseAccuracy < 70) {
        // Average student: standard progression
        if (progressRatio < 0.3) progression.push('easy')
        else if (progressRatio < 0.7) progression.push('medium')
        else progression.push('hard')
      } else {
        // Advanced student: quick progression to hard
        if (progressRatio < 0.2) progression.push('easy')
        else if (progressRatio < 0.4) progression.push('medium')
        else progression.push('hard')
      }
    }

    return progression
  }

  private extractFocusAreas(profile: UserProfile): string[] {
    const focusAreas: string[] = []
    
    // Add weak areas as focus
    profile.weakAreas.slice(0, 3).forEach(area => {
      focusAreas.push(`Improve ${area.subject} (Current: ${area.averageScore.toFixed(1)}%)`)
    })

    // Add general improvement goals
    if (profile.overallAccuracy < 60) {
      focusAreas.push('Build foundational concepts')
    } else if (profile.overallAccuracy < 80) {
      focusAreas.push('Enhance analytical skills')
    } else {
      focusAreas.push('Master advanced concepts')
    }

    return focusAreas
  }

  private extractSubjectFromQuestionId(questionId: string): SubjectArea {
    // Simplified extraction based on question ID pattern
    if (questionId.includes('polity')) return 'Polity'
    if (questionId.includes('history')) return 'History'
    if (questionId.includes('geography')) return 'Geography'
    if (questionId.includes('economy')) return 'Economy'
    if (questionId.includes('environment')) return 'Environment'
    if (questionId.includes('science')) return 'Science & Technology'
    return 'Current Affairs'
  }

  private extractTopicFromQuestionId(questionId: string): string {
    // Simplified topic extraction
    const parts = questionId.split('-')
    return parts.length > 2 ? parts[2].replace(/([A-Z])/g, ' $1').trim() : 'General'
  }

  private async selectProgressiveQuestions(
    profile: UserProfile,
    targetImprovement: number
  ): Promise<Question[]> {
    // Select questions that gradually increase in difficulty
    const questions: Question[] = []
    const questionCount = 25
    
    // Focus on the weakest area
    const weakestArea = profile.weakAreas[0]
    if (weakestArea) {
      for (let i = 0; i < questionCount; i++) {
        const progressRatio = i / questionCount
        let difficulty: DifficultyLevel = 'easy'
        
        if (progressRatio > 0.3) difficulty = 'medium'
        if (progressRatio > 0.7) difficulty = 'hard'
        
        const question = await this.generateQuestionsForSubject(
          weakestArea.subject,
          [weakestArea.topics[0]],
          1,
          difficulty
        )
        questions.push(...question)
      }
    }

    return questions
  }

  private createProgressiveProgression(questionCount: number): DifficultyLevel[] {
    const progression: DifficultyLevel[] = []
    
    for (let i = 0; i < questionCount; i++) {
      const ratio = i / questionCount
      if (ratio < 0.3) progression.push('easy')
      else if (ratio < 0.7) progression.push('medium')
      else progression.push('hard')
    }

    return progression
  }

  private async selectWeaknessTargetedQuestions(
    weakAreas: UserProfile['weakAreas']
  ): Promise<Question[]> {
    const questions: Question[] = []
    const questionsPerArea = Math.floor(20 / weakAreas.length)
    
    for (const weakArea of weakAreas) {
      const areaQuestions = await this.generateQuestionsForSubject(
        weakArea.subject,
        weakArea.topics,
        questionsPerArea,
        this.getDifficultyForWeakArea(weakArea.averageScore)
      )
      questions.push(...areaQuestions)
    }

    return questions
  }

  private createTargetedProgression(questionCount: number): DifficultyLevel[] {
    // For targeted weakness tests, maintain consistent difficulty
    return Array(questionCount).fill('medium') as DifficultyLevel[]
  }

  private async selectSpeedAccuracyQuestions(
    profile: UserProfile,
    focusMode: 'speed' | 'accuracy' | 'balanced'
  ): Promise<Question[]> {
    const questionCount = focusMode === 'speed' ? 40 : 20
    
    let difficultyDist
    switch (focusMode) {
      case 'speed':
        difficultyDist = 'easy' // Easy questions for speed
        break
      case 'accuracy':
        difficultyDist = 'hard' // Hard questions for accuracy
        break
      default:
        difficultyDist = 'mixed'
    }

    // Mix of subjects for speed/accuracy training
    const subjects: SubjectArea[] = ['Polity', 'History', 'Geography', 'Economy']
    const questions: Question[] = []
    
    for (const subject of subjects) {
      const subjectQuestions = await this.generateQuestionsForSubject(
        subject,
        ['General'],
        Math.floor(questionCount / subjects.length),
        difficultyDist
      )
      questions.push(...subjectQuestions)
    }

    return questions
  }

  private calculateOptimalTime(profile: UserProfile, focusMode: string): number {
    const baseTime = profile.averageTimePerQuestion || 90 // 1.5 minutes default
    
    switch (focusMode) {
      case 'speed':
        return Math.max(baseTime * 0.6, 30) // 40% less time, minimum 30 seconds
      case 'accuracy':
        return baseTime * 1.5 // 50% more time
      default:
        return baseTime
    }
  }

  private createBalancedProgression(questionCount: number): DifficultyLevel[] {
    const progression: DifficultyLevel[] = []
    
    for (let i = 0; i < questionCount; i++) {
      const cyclePosition = i % 3
      if (cyclePosition === 0) progression.push('easy')
      else if (cyclePosition === 1) progression.push('medium')
      else progression.push('hard')
    }

    return progression
  }
}