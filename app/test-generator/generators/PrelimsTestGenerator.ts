import {
  PrelimsTest,
  PrelimsQuestion,
  TestConfiguration,
  SubjectDistribution,
  PaperCompositionRules,
  TestPaperGenerator
} from '../types'
import { Question, SubjectArea, DifficultyLevel, QuestionType } from '../../question-generator/types'

export class PrelimsTestGenerator implements TestPaperGenerator {
  private compositionRules: PaperCompositionRules = {
    ensureConceptualCoverage: true,
    avoidQuestionClustering: true,
    balanceStaticVsCurrent: {
      staticPercentage: 70,
      currentPercentage: 30
    },
    includeTrapQuestions: {
      enabled: true,
      percentage: 10
    },
    statementSequencing: {
      maxConsecutiveStatements: 3,
      spacingBetweenStatements: 2
    },
    questionTypeSpacing: {
      noConsecutiveSameType: true,
      minSpacing: 2
    }
  }

  private standardSubjectDistribution: SubjectDistribution[] = [
    {
      subject: 'Polity',
      minQuestions: 17,
      maxQuestions: 22
    },
    {
      subject: 'History',
      minQuestions: 15,
      maxQuestions: 18,
      subTopicDistribution: {
        'Ancient': 3,
        'Medieval': 3,
        'Modern': 9
      }
    },
    {
      subject: 'Geography',
      minQuestions: 12,
      maxQuestions: 15,
      subTopicDistribution: {
        'Physical': 5,
        'Human': 5,
        'Economic': 5
      }
    },
    {
      subject: 'Economy',
      minQuestions: 13,
      maxQuestions: 17
    },
    {
      subject: 'Environment',
      minQuestions: 10,
      maxQuestions: 12
    },
    {
      subject: 'Science & Technology',
      minQuestions: 7,
      maxQuestions: 10
    },
    {
      subject: 'Current Affairs',
      minQuestions: 22,
      maxQuestions: 27
    }
  ]

  async generateTest(config: TestConfiguration): Promise<PrelimsTest> {
    const testConfig = this.mergeWithDefaults(config)
    
    // Step 1: Determine exact subject distribution
    const subjectQuestionCount = this.calculateSubjectDistribution(testConfig)
    
    // Step 2: Fetch questions from question bank
    const questionPool = await this.fetchQuestionPool(subjectQuestionCount, testConfig)
    
    // Step 3: Select questions based on difficulty distribution
    const selectedQuestions = this.selectQuestionsByDifficulty(questionPool, testConfig)
    
    // Step 4: Apply composition rules
    const composedQuestions = this.applyCompositionRules(selectedQuestions)
    
    // Step 5: Convert to Prelims format
    const prelimsQuestions = this.convertToPrelimsQuestions(composedQuestions)
    
    // Step 6: Shuffle intelligently
    const finalQuestions = this.intelligentShuffle(prelimsQuestions)
    
    // Step 7: Create test object
    return this.createPrelimsTest(finalQuestions, testConfig)
  }

  validateTest(test: PrelimsTest): boolean {
    // Validate question count
    if (test.questions.length !== test.totalQuestions) {
      return false
    }

    // Validate subject distribution
    const subjectCount = this.countBySubject(test.questions)
    for (const dist of this.standardSubjectDistribution) {
      const count = subjectCount[dist.subject] || 0
      if (count < dist.minQuestions || count > dist.maxQuestions) {
        return false
      }
    }

    // Validate difficulty distribution
    const difficultyCount = this.countByDifficulty(test.questions)
    const totalQuestions = test.questions.length
    
    const easyPercentage = (difficultyCount.easy / totalQuestions) * 100
    const mediumPercentage = (difficultyCount.medium / totalQuestions) * 100
    const hardPercentage = (difficultyCount.hard / totalQuestions) * 100
    
    if (Math.abs(easyPercentage - 25) > 5 || 
        Math.abs(mediumPercentage - 55) > 5 || 
        Math.abs(hardPercentage - 20) > 5) {
      return false
    }

    return true
  }

  ensureQualityStandards(test: PrelimsTest): boolean {
    // Check for question diversity
    const questionTypes = new Set(test.questions.map(q => q.type))
    if (questionTypes.size < 8) {
      return false // Should use at least 8 different question types
    }

    // Check for conceptual coverage
    const concepts = new Set(test.questions.flatMap(q => q.conceptsTested || []))
    if (concepts.size < 50) {
      return false // Should cover at least 50 different concepts
    }

    // Check for trap questions
    const trapQuestions = test.questions.filter(q => this.isTrapQuestion(q))
    const trapPercentage = (trapQuestions.length / test.questions.length) * 100
    if (trapPercentage < 8 || trapPercentage > 12) {
      return false
    }

    // Check spacing rules
    if (!this.validateSpacingRules(test.questions)) {
      return false
    }

    return true
  }

  private mergeWithDefaults(config: TestConfiguration): TestConfiguration {
    return {
      testType: 'Prelims',
      duration: 120,
      totalQuestions: 100,
      negativeMarking: -0.66,
      subjectDistribution: this.standardSubjectDistribution,
      difficultyDistribution: {
        easy: 0.25,
        medium: 0.55,
        hard: 0.20
      },
      ...config
    }
  }

  private calculateSubjectDistribution(config: TestConfiguration): Record<SubjectArea, number> {
    const distribution: Record<SubjectArea, number> = {} as Record<SubjectArea, number>
    let totalAllocated = 0
    const totalQuestions = config.totalQuestions

    // First, allocate minimum questions to each subject
    for (const subDist of config.subjectDistribution) {
      distribution[subDist.subject] = subDist.minQuestions
      totalAllocated += subDist.minQuestions
    }

    // Distribute remaining questions proportionally
    let remainingQuestions = totalQuestions - totalAllocated
    while (remainingQuestions > 0) {
      for (const subDist of config.subjectDistribution) {
        if (distribution[subDist.subject] < subDist.maxQuestions && remainingQuestions > 0) {
          distribution[subDist.subject]++
          remainingQuestions--
        }
      }
    }

    return distribution
  }

  private async fetchQuestionPool(
    subjectQuestionCount: Record<SubjectArea, number>,
    config: TestConfiguration
  ): Promise<Question[]> {
    // In a real implementation, this would fetch from the question bank
    // For now, we'll simulate with generated questions
    const questionPool: Question[] = []
    
    for (const [subject, count] of Object.entries(subjectQuestionCount)) {
      // Fetch 2x questions to have selection flexibility
      const subjectQuestions = await this.generateSubjectQuestions(
        subject as SubjectArea, 
        count * 2,
        config
      )
      questionPool.push(...subjectQuestions)
    }

    return questionPool
  }

  private async generateSubjectQuestions(
    subject: SubjectArea,
    count: number,
    config: TestConfiguration
  ): Promise<Question[]> {
    // Simulate question generation for the subject
    const questions: Question[] = []
    const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard']
    const questionTypes: QuestionType[] = [
      'SingleCorrectMCQ',
      'MultipleCorrectMCQ',
      'MatchTheFollowing',
      'AssertionReasoning',
      'StatementBased'
    ]

    for (let i = 0; i < count; i++) {
      questions.push({
        id: `${subject.toLowerCase()}-${Date.now()}-${i}`,
        type: questionTypes[i % questionTypes.length],
        subject,
        topic: this.getRandomTopic(subject),
        subTopic: 'General',
        difficulty: difficulties[i % 3],
        question: `Sample ${subject} question ${i + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: i % 4,
        explanation: `This is the explanation for ${subject} question ${i + 1}`,
        concepts: [`${subject} Concept ${i % 5}`],
        yearAsked: [],
        source: 'Generated',
        tags: [subject.toLowerCase(), 'prelims']
      } as Question)
    }

    return questions
  }

  private selectQuestionsByDifficulty(
    questionPool: Question[],
    config: TestConfiguration
  ): Question[] {
    const selected: Question[] = []
    const totalQuestions = config.totalQuestions
    
    // Calculate exact numbers for each difficulty
    const easyCount = Math.round(totalQuestions * config.difficultyDistribution.easy)
    const mediumCount = Math.round(totalQuestions * config.difficultyDistribution.medium)
    const hardCount = totalQuestions - easyCount - mediumCount

    // Group questions by difficulty
    const byDifficulty = this.groupByDifficulty(questionPool)

    // Select questions
    selected.push(...this.selectRandomQuestions(byDifficulty.easy, easyCount))
    selected.push(...this.selectRandomQuestions(byDifficulty.medium, mediumCount))
    selected.push(...this.selectRandomQuestions(byDifficulty.hard, hardCount))

    return selected
  }

  private applyCompositionRules(questions: Question[]): Question[] {
    let composed = [...questions]

    // Apply trap questions
    if (this.compositionRules.includeTrapQuestions.enabled) {
      composed = this.insertTrapQuestions(composed)
    }

    // Balance static vs current affairs
    composed = this.balanceStaticVsCurrent(composed)

    // Ensure conceptual coverage
    if (this.compositionRules.ensureConceptualCoverage) {
      composed = this.ensureConceptualDiversity(composed)
    }

    return composed
  }

  private convertToPrelimsQuestions(questions: Question[]): PrelimsQuestion[] {
    return questions.map((q, index) => ({
      ...q,
      marks: 2,
      negativeMarks: 0.66,
      section: 'General Studies',
      previousYearReference: this.getPreviousYearReference(q)
    }))
  }

  private intelligentShuffle(questions: PrelimsQuestion[]): PrelimsQuestion[] {
    const shuffled: PrelimsQuestion[] = []
    const remaining = [...questions]
    
    while (remaining.length > 0) {
      const nextQuestion = this.selectNextQuestion(remaining, shuffled)
      const index = remaining.indexOf(nextQuestion)
      remaining.splice(index, 1)
      shuffled.push(nextQuestion)
    }

    return shuffled.map((q, index) => ({
      ...q,
      id: `prelims-q${index + 1}`
    }))
  }

  private selectNextQuestion(
    remaining: PrelimsQuestion[],
    placed: PrelimsQuestion[]
  ): PrelimsQuestion {
    if (placed.length === 0) {
      return remaining[0]
    }

    const lastQuestion = placed[placed.length - 1]
    
    // Apply spacing rules
    const candidates = remaining.filter(q => {
      // Avoid consecutive same type
      if (this.compositionRules.questionTypeSpacing.noConsecutiveSameType && 
          q.type === lastQuestion.type) {
        return false
      }

      // Avoid clustering same subject
      if (this.compositionRules.avoidQuestionClustering) {
        const recentSameSubject = placed.slice(-3).filter(p => p.subject === q.subject).length
        if (recentSameSubject >= 2) {
          return false
        }
      }

      return true
    })

    return candidates.length > 0 ? candidates[0] : remaining[0]
  }

  private createPrelimsTest(
    questions: PrelimsQuestion[],
    config: TestConfiguration
  ): PrelimsTest {
    const subjectBreakdown = this.countBySubject(questions)
    const difficultyBreakdown = this.countByDifficulty(questions)

    return {
      id: `prelims-test-${Date.now()}`,
      title: 'UPSC Prelims Mock Test',
      series: 'Complete Test Series',
      testNumber: 1,
      duration: config.duration,
      totalQuestions: questions.length,
      negativeMarking: config.negativeMarking,
      questions,
      subjectWiseBreakdown: subjectBreakdown,
      difficultyBreakdown,
      createdAt: new Date(),
      instructions: this.generateInstructions()
    }
  }

  private generateInstructions(): string[] {
    return [
      'This test contains 100 questions.',
      'Each question carries 2 marks.',
      'There is negative marking of 0.66 marks for each wrong answer.',
      'Total duration is 120 minutes.',
      'All questions are compulsory.',
      'Use of calculator is not allowed.',
      'Read each question carefully before answering.',
      'Mark your answers clearly on the OMR sheet.'
    ]
  }

  // Helper methods
  private countBySubject(questions: PrelimsQuestion[]): Record<SubjectArea, number> {
    const count: Partial<Record<SubjectArea, number>> = {}
    
    questions.forEach(q => {
      count[q.subject] = (count[q.subject] || 0) + 1
    })

    return count as Record<SubjectArea, number>
  }

  private countByDifficulty(questions: PrelimsQuestion[]): Record<DifficultyLevel, number> {
    return {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    }
  }

  private groupByDifficulty(questions: Question[]): Record<DifficultyLevel, Question[]> {
    return {
      easy: questions.filter(q => q.difficulty === 'easy'),
      medium: questions.filter(q => q.difficulty === 'medium'),
      hard: questions.filter(q => q.difficulty === 'hard')
    }
  }

  private selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  private isTrapQuestion(question: PrelimsQuestion): boolean {
    // Identify trap questions based on certain patterns
    const trapIndicators = [
      'none of the above',
      'all of the above',
      'both 1 and 2',
      'neither 1 nor 2',
      'except',
      'incorrect'
    ]
    
    return trapIndicators.some(indicator => 
      question.question.toLowerCase().includes(indicator) ||
      question.options.some(opt => opt.toLowerCase().includes(indicator))
    )
  }

  private validateSpacingRules(questions: PrelimsQuestion[]): boolean {
    for (let i = 1; i < questions.length; i++) {
      // Check consecutive same type
      if (questions[i].type === questions[i-1].type && 
          this.compositionRules.questionTypeSpacing.noConsecutiveSameType) {
        return false
      }

      // Check statement clustering
      if (questions[i].type === 'StatementBased') {
        let consecutiveStatements = 1
        for (let j = i - 1; j >= 0 && questions[j].type === 'StatementBased'; j--) {
          consecutiveStatements++
        }
        if (consecutiveStatements > this.compositionRules.statementSequencing.maxConsecutiveStatements) {
          return false
        }
      }
    }

    return true
  }

  private insertTrapQuestions(questions: Question[]): Question[] {
    const trapCount = Math.floor(questions.length * this.compositionRules.includeTrapQuestions.percentage / 100)
    let modified = [...questions]
    
    // Convert some questions to trap questions
    for (let i = 0; i < trapCount && i < modified.length; i++) {
      if (modified[i].type === 'SingleCorrectMCQ') {
        // Add "None of the above" as an option
        modified[i].options = [...modified[i].options.slice(0, 3), 'None of the above']
        // Randomly make it correct sometimes
        if (Math.random() < 0.3) {
          modified[i].correctAnswer = 3
        }
      }
    }

    return modified
  }

  private balanceStaticVsCurrent(questions: Question[]): Question[] {
    const currentAffairsQuestions = questions.filter(q => q.subject === 'Current Affairs')
    const staticQuestions = questions.filter(q => q.subject !== 'Current Affairs')
    
    const targetCurrentCount = Math.floor(questions.length * this.compositionRules.balanceStaticVsCurrent.currentPercentage / 100)
    const currentCurrentCount = currentAffairsQuestions.length
    
    if (Math.abs(currentCurrentCount - targetCurrentCount) <= 5) {
      return questions // Already balanced
    }

    // Rebalance if needed
    // This is simplified - in production, would be more sophisticated
    return questions
  }

  private ensureConceptualDiversity(questions: Question[]): Question[] {
    const conceptsCovered = new Set<string>()
    const diverse: Question[] = []
    
    // First pass: select questions with unique concepts
    for (const q of questions) {
      const newConcepts = (q.concepts || []).filter(c => !conceptsCovered.has(c))
      if (newConcepts.length > 0) {
        diverse.push(q)
        newConcepts.forEach(c => conceptsCovered.add(c))
      }
    }

    // Fill remaining slots
    const remaining = questions.filter(q => !diverse.includes(q))
    diverse.push(...remaining.slice(0, questions.length - diverse.length))

    return diverse
  }

  private getPreviousYearReference(question: Question): string | undefined {
    if (question.yearAsked && question.yearAsked.length > 0) {
      return `Similar to UPSC ${question.yearAsked[0]}`
    }
    return undefined
  }

  private getRandomTopic(subject: SubjectArea): string {
    const topics: Record<SubjectArea, string[]> = {
      'Polity': ['Parliament', 'Judiciary', 'Executive', 'Constitution', 'Elections'],
      'History': ['Ancient India', 'Medieval India', 'Modern India', 'World History'],
      'Geography': ['Physical Geography', 'Human Geography', 'Economic Geography', 'Indian Geography'],
      'Economy': ['Banking', 'Budget', 'Agriculture', 'Industry', 'Trade'],
      'Environment': ['Climate Change', 'Biodiversity', 'Pollution', 'Conservation'],
      'Science & Technology': ['Space', 'IT', 'Biotechnology', 'Energy', 'Health'],
      'Current Affairs': ['Government Schemes', 'International', 'Economic Survey', 'Reports'],
      'Social Issues': ['Education', 'Health', 'Poverty', 'Gender', 'Caste'],
      'Art & Culture': ['Architecture', 'Dance', 'Music', 'Festivals', 'Literature'],
      'Ethics': ['Values', 'Attitude', 'Emotional Intelligence', 'Case Studies']
    }
    
    const subjectTopics = topics[subject] || ['General']
    return subjectTopics[Math.floor(Math.random() * subjectTopics.length)]
  }
}