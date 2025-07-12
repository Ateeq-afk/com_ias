import {
  SectionalTest,
  TestConfiguration,
  AdaptiveTest,
  UserProfile
} from '../types'
import { Question, SubjectArea, DifficultyLevel } from '../../question-generator/types'

export class SectionalTestGenerator {
  
  async generateSectionalTest(
    subject: SubjectArea,
    topics: string[],
    config: Partial<TestConfiguration> = {}
  ): Promise<SectionalTest> {
    const defaultConfig: TestConfiguration = {
      testType: 'Sectional',
      duration: 60,
      totalQuestions: 25,
      negativeMarking: -0.66,
      subjectDistribution: [{
        subject,
        minQuestions: config.totalQuestions || 25,
        maxQuestions: config.totalQuestions || 25
      }],
      difficultyDistribution: {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      }
    }

    const finalConfig = { ...defaultConfig, ...config }
    const questions = await this.generateSubjectQuestions(subject, topics, finalConfig)
    
    return {
      id: `sectional-${subject.toLowerCase()}-${Date.now()}`,
      title: `${subject} Sectional Test`,
      subject,
      topics,
      duration: finalConfig.duration,
      totalQuestions: questions.length,
      questions,
      difficultyLevel: 'Mixed',
      createdAt: new Date()
    }
  }

  async generateTopicTest(
    subject: SubjectArea,
    topic: string,
    difficulty: DifficultyLevel | 'Mixed' = 'Mixed',
    questionCount: number = 15
  ): Promise<SectionalTest> {
    const questions = await this.generateTopicQuestions(subject, topic, difficulty, questionCount)
    
    return {
      id: `topic-${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      title: `${topic} - ${subject} Test`,
      subject,
      topics: [topic],
      duration: Math.ceil(questionCount * 1.2), // 1.2 minutes per question
      totalQuestions: questions.length,
      questions,
      difficultyLevel: difficulty,
      createdAt: new Date()
    }
  }

  async generateRevisionTest(
    weakAreas: Array<{ subject: SubjectArea; topics: string[] }>,
    questionCount: number = 30
  ): Promise<SectionalTest> {
    const questions: Question[] = []
    const allTopics: string[] = []
    
    // Distribute questions proportionally among weak areas
    const questionsPerArea = Math.floor(questionCount / weakAreas.length)
    const remainder = questionCount % weakAreas.length
    
    for (let i = 0; i < weakAreas.length; i++) {
      const area = weakAreas[i]
      const areaQuestionCount = questionsPerArea + (i < remainder ? 1 : 0)
      
      const areaQuestions = await this.generateSubjectQuestions(
        area.subject,
        area.topics,
        {
          testType: 'Sectional',
          duration: 60,
          totalQuestions: areaQuestionCount,
          negativeMarking: -0.66,
          subjectDistribution: [],
          difficultyDistribution: {
            easy: 0.2, // Focus more on medium and hard for revision
            medium: 0.5,
            hard: 0.3
          }
        }
      )
      
      questions.push(...areaQuestions)
      allTopics.push(...area.topics)
    }

    // Shuffle questions to mix subjects
    const shuffledQuestions = this.shuffleArray(questions)
    
    return {
      id: `revision-test-${Date.now()}`,
      title: 'Revision Test - Weak Areas',
      subject: 'Current Affairs', // Mixed subjects
      topics: [...new Set(allTopics)],
      duration: Math.ceil(questions.length * 1.5), // More time for revision
      totalQuestions: questions.length,
      questions: shuffledQuestions,
      difficultyLevel: 'Mixed',
      createdAt: new Date()
    }
  }

  async generatePreviousYearTest(
    year: number,
    subject?: SubjectArea,
    questionCount: number = 50
  ): Promise<SectionalTest> {
    // In production, this would fetch actual PYQs from database
    const questions = await this.generatePYQQuestions(year, subject, questionCount)
    
    return {
      id: `pyq-${year}-${subject?.toLowerCase() || 'all'}-${Date.now()}`,
      title: `${year} Previous Year Questions${subject ? ` - ${subject}` : ''}`,
      subject: subject || 'Current Affairs',
      topics: subject ? this.getSubjectTopics(subject) : ['Mixed Topics'],
      duration: Math.ceil(questionCount * 1.2),
      totalQuestions: questions.length,
      questions,
      difficultyLevel: 'Mixed',
      createdAt: new Date()
    }
  }

  async generateSpeedTest(
    subject: SubjectArea,
    timePerQuestion: number = 0.8 // 48 seconds per question
  ): Promise<SectionalTest> {
    const questionCount = 50
    const questions = await this.generateSpeedTestQuestions(subject, questionCount)
    
    return {
      id: `speed-test-${subject.toLowerCase()}-${Date.now()}`,
      title: `${subject} Speed Test`,
      subject,
      topics: this.getSubjectTopics(subject),
      duration: Math.ceil(questionCount * timePerQuestion),
      totalQuestions: questions.length,
      questions,
      difficultyLevel: 'Mixed',
      createdAt: new Date()
    }
  }

  async generateAccuracyTest(
    subject: SubjectArea,
    timePerQuestion: number = 2.0 // 2 minutes per question
  ): Promise<SectionalTest> {
    const questionCount = 20
    // Generate more challenging questions for accuracy test
    const questions = await this.generateAccuracyTestQuestions(subject, questionCount)
    
    return {
      id: `accuracy-test-${subject.toLowerCase()}-${Date.now()}`,
      title: `${subject} Accuracy Test`,
      subject,
      topics: this.getSubjectTopics(subject),
      duration: Math.ceil(questionCount * timePerQuestion),
      totalQuestions: questions.length,
      questions,
      difficultyLevel: 'hard',
      createdAt: new Date()
    }
  }

  private async generateSubjectQuestions(
    subject: SubjectArea,
    topics: string[],
    config: TestConfiguration
  ): Promise<Question[]> {
    const questions: Question[] = []
    const totalQuestions = config.totalQuestions
    
    // Calculate questions per topic
    const questionsPerTopic = Math.floor(totalQuestions / topics.length)
    const remainderQuestions = totalQuestions % topics.length
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i]
      const topicQuestionCount = questionsPerTopic + (i < remainderQuestions ? 1 : 0)
      
      const topicQuestions = await this.generateQuestionsForTopic(
        subject,
        topic,
        topicQuestionCount,
        config.difficultyDistribution
      )
      
      questions.push(...topicQuestions)
    }

    return questions
  }

  private async generateTopicQuestions(
    subject: SubjectArea,
    topic: string,
    difficulty: DifficultyLevel | 'Mixed',
    questionCount: number
  ): Promise<Question[]> {
    if (difficulty === 'Mixed') {
      return this.generateQuestionsForTopic(subject, topic, questionCount, {
        easy: 0.3,
        medium: 0.5,
        hard: 0.2
      })
    } else {
      return this.generateQuestionsForTopic(subject, topic, questionCount, {
        easy: difficulty === 'easy' ? 1 : 0,
        medium: difficulty === 'medium' ? 1 : 0,
        hard: difficulty === 'hard' ? 1 : 0
      })
    }
  }

  private async generateQuestionsForTopic(
    subject: SubjectArea,
    topic: string,
    questionCount: number,
    difficultyDistribution: { easy: number; medium: number; hard: number }
  ): Promise<Question[]> {
    const questions: Question[] = []
    
    // Calculate difficulty distribution
    const easyCount = Math.round(questionCount * difficultyDistribution.easy)
    const mediumCount = Math.round(questionCount * difficultyDistribution.medium)
    const hardCount = questionCount - easyCount - mediumCount

    // Generate questions for each difficulty
    questions.push(...await this.createQuestions(subject, topic, 'easy', easyCount))
    questions.push(...await this.createQuestions(subject, topic, 'medium', mediumCount))
    questions.push(...await this.createQuestions(subject, topic, 'hard', hardCount))

    return this.shuffleArray(questions)
  }

  private async createQuestions(
    subject: SubjectArea,
    topic: string,
    difficulty: DifficultyLevel,
    count: number
  ): Promise<Question[]> {
    const questions: Question[] = []
    const questionTypes = ['SingleCorrectMCQ', 'StatementBased', 'AssertionReasoning', 'MultipleCorrectMCQ']
    
    for (let i = 0; i < count; i++) {
      const questionType = questionTypes[i % questionTypes.length]
      
      questions.push({
        id: `${subject.toLowerCase()}-${topic.replace(/\s+/g, '-').toLowerCase()}-${difficulty}-${i + 1}`,
        type: questionType as any,
        subject,
        topic,
        subTopic: 'General',
        difficulty,
        question: this.generateQuestionText(subject, topic, difficulty, i + 1),
        options: this.generateOptions(subject, topic, difficulty),
        correctAnswer: this.generateCorrectAnswer(questionType),
        explanation: this.generateExplanation(subject, topic, difficulty),
        concepts: this.generateConcepts(subject, topic),
        yearAsked: this.generateYearAsked(),
        source: 'Generated',
        tags: [subject.toLowerCase(), topic.toLowerCase(), difficulty]
      })
    }

    return questions
  }

  private generateQuestionText(
    subject: SubjectArea,
    topic: string,
    difficulty: DifficultyLevel,
    questionNumber: number
  ): string {
    const templates = {
      easy: [
        `Which of the following is related to ${topic}?`,
        `${topic} is associated with which of the following?`,
        `What is the primary characteristic of ${topic}?`
      ],
      medium: [
        `Consider the following statements about ${topic}:`,
        `Which of the following best describes the significance of ${topic}?`,
        `Analyze the relationship between ${topic} and its implications.`
      ],
      hard: [
        `Critically evaluate the following statements regarding ${topic}:`,
        `Which of the following complex scenarios best illustrates ${topic}?`,
        `In the context of ${topic}, which analytical framework is most appropriate?`
      ]
    }

    const template = templates[difficulty][questionNumber % templates[difficulty].length]
    return `${template} (${subject} - ${difficulty.toUpperCase()})`
  }

  private generateOptions(subject: SubjectArea, topic: string, difficulty: DifficultyLevel): string[] {
    const baseOptions = [
      `Correct option related to ${topic}`,
      `Plausible but incorrect option for ${topic}`,
      `Distractor option for ${topic}`,
      `Another distractor for ${topic}`
    ]

    if (difficulty === 'hard') {
      return [
        `Highly specific correct answer about ${topic}`,
        `Very close but incorrect option`,
        `Technically accurate but contextually wrong`,
        `Conceptually related but inappropriate`
      ]
    }

    return baseOptions
  }

  private generateCorrectAnswer(questionType: string): number {
    if (questionType === 'MultipleCorrectMCQ') {
      return Math.floor(Math.random() * 4) // For demo, single correct answer
    }
    return Math.floor(Math.random() * 4)
  }

  private generateExplanation(subject: SubjectArea, topic: string, difficulty: DifficultyLevel): string {
    const depth = difficulty === 'hard' ? 'detailed analytical' : difficulty === 'medium' ? 'comprehensive' : 'clear'
    return `This ${depth} explanation covers the key aspects of ${topic} in ${subject}, including relevant concepts, current applications, and UPSC examination perspective.`
  }

  private generateConcepts(subject: SubjectArea, topic: string): string[] {
    return [
      `Core concept of ${topic}`,
      `${subject} principle`,
      `Analytical framework`,
      `Current affairs linkage`
    ]
  }

  private generateYearAsked(): number[] {
    const years = [2023, 2022, 2021, 2020, 2019]
    const randomYears = []
    const count = Math.floor(Math.random() * 3) // 0-2 years
    
    for (let i = 0; i < count; i++) {
      randomYears.push(years[Math.floor(Math.random() * years.length)])
    }
    
    return [...new Set(randomYears)]
  }

  private async generatePYQQuestions(
    year: number,
    subject: SubjectArea | undefined,
    questionCount: number
  ): Promise<Question[]> {
    // In production, this would fetch actual previous year questions
    const questions: Question[] = []
    const subjects = subject ? [subject] : this.getAllSubjects()
    
    const questionsPerSubject = Math.floor(questionCount / subjects.length)
    
    for (const subj of subjects) {
      const topics = this.getSubjectTopics(subj)
      
      for (let i = 0; i < questionsPerSubject; i++) {
        const topic = topics[i % topics.length]
        
        questions.push({
          id: `pyq-${year}-${subj.toLowerCase()}-${i + 1}`,
          type: 'SingleCorrectMCQ',
          subject: subj,
          topic,
          subTopic: 'General',
          difficulty: 'medium',
          question: `Previous Year ${year} Question on ${topic} - ${subj}`,
          options: [
            'Historical correct answer',
            'Historical wrong option 1',
            'Historical wrong option 2',
            'Historical wrong option 3'
          ],
          correctAnswer: 0,
          explanation: `This question was asked in UPSC ${year} and tests understanding of ${topic}.`,
          concepts: [`${topic} concept`, `${subj} principle`],
          yearAsked: [year],
          source: `UPSC ${year}`,
          tags: ['pyq', year.toString(), subj.toLowerCase()]
        })
      }
    }

    return questions.slice(0, questionCount)
  }

  private async generateSpeedTestQuestions(
    subject: SubjectArea,
    questionCount: number
  ): Promise<Question[]> {
    // Speed test focuses on quick recall and basic concepts
    return this.generateQuestionsForTopic(subject, 'Speed Test Topics', questionCount, {
      easy: 0.6,   // More easy questions for speed
      medium: 0.3,
      hard: 0.1
    })
  }

  private async generateAccuracyTestQuestions(
    subject: SubjectArea,
    questionCount: number
  ): Promise<Question[]> {
    // Accuracy test focuses on detailed analysis and tricky questions
    return this.generateQuestionsForTopic(subject, 'Accuracy Test Topics', questionCount, {
      easy: 0.1,
      medium: 0.3,
      hard: 0.6    // More hard questions for accuracy
    })
  }

  private getSubjectTopics(subject: SubjectArea): string[] {
    const topicMap: Record<SubjectArea, string[]> = {
      'Polity': [
        'Constitution', 'Parliament', 'Judiciary', 'Executive', 'Elections',
        'Fundamental Rights', 'DPSP', 'Emergency Provisions', 'Amendments',
        'Centre-State Relations', 'Local Government', 'Constitutional Bodies'
      ],
      'History': [
        'Ancient India', 'Medieval India', 'Modern India', 'Freedom Struggle',
        'Post-Independence', 'World History', 'Art and Culture', 'Monuments',
        'Literature', 'Philosophy', 'Social Reforms', 'Regional History'
      ],
      'Geography': [
        'Physical Geography', 'Indian Geography', 'World Geography', 'Climate',
        'Natural Resources', 'Agriculture', 'Industries', 'Transport',
        'Population', 'Urbanization', 'Regional Planning', 'Environmental Geography'
      ],
      'Economy': [
        'Basic Concepts', 'National Income', 'Banking', 'Public Finance',
        'International Trade', 'Agriculture', 'Industry', 'Services',
        'Infrastructure', 'Economic Reforms', 'Poverty', 'Employment'
      ],
      'Environment': [
        'Ecology', 'Biodiversity', 'Climate Change', 'Pollution',
        'Conservation', 'Environmental Laws', 'Sustainable Development',
        'Renewable Energy', 'Waste Management', 'Forest Conservation'
      ],
      'Science & Technology': [
        'Physics', 'Chemistry', 'Biology', 'Space Technology',
        'Information Technology', 'Biotechnology', 'Nanotechnology',
        'Energy Technology', 'Defense Technology', 'Medical Science'
      ],
      'Current Affairs': [
        'Government Schemes', 'International Relations', 'Economic Developments',
        'Science and Technology', 'Awards and Honors', 'Sports',
        'Books and Authors', 'Summits and Conferences', 'Reports and Indices'
      ],
      'Social Issues': [
        'Education', 'Health', 'Women and Child', 'Tribal Issues',
        'Minorities', 'Human Rights', 'Social Justice', 'Poverty',
        'Unemployment', 'Migration', 'Urbanization', 'Demographic Trends'
      ],
      'Art & Culture': [
        'Indian Art', 'Architecture', 'Sculpture', 'Painting',
        'Music', 'Dance', 'Literature', 'Festivals', 'Traditions',
        'Heritage Sites', 'Museums', 'Cultural Institutions'
      ],
      'Ethics': [
        'Moral Philosophy', 'Ethical Theories', 'Values', 'Attitude',
        'Emotional Intelligence', 'Public Service Ethics', 'Integrity',
        'Accountability', 'Transparency', 'Case Studies'
      ]
    }

    return topicMap[subject] || ['General Topics']
  }

  private getAllSubjects(): SubjectArea[] {
    return [
      'Polity', 'History', 'Geography', 'Economy', 'Environment',
      'Science & Technology', 'Current Affairs', 'Social Issues'
    ]
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}