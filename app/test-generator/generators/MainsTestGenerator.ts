import {
  MainsTest,
  MainsQuestion,
  EssayPaper,
  EssaySection,
  EssayTopic,
  TestConfiguration,
  ModelAnswerFramework,
  WordLimit,
  TestPaperGenerator
} from '../types'
import { SubjectArea } from '../../question-generator/types'

export class MainsTestGenerator implements TestPaperGenerator {
  
  private paperSubjects = {
    'GS1': ['History', 'Geography', 'Social Issues', 'Art & Culture'] as SubjectArea[],
    'GS2': ['Polity', 'International Relations', 'Social Issues'] as SubjectArea[],
    'GS3': ['Economy', 'Environment', 'Science & Technology'] as SubjectArea[],
    'GS4': ['Ethics'] as SubjectArea[]
  }

  private questionDistribution = {
    'GS1': { 
      'History': 8, 
      'Geography': 6, 
      'Social Issues': 4, 
      'Art & Culture': 2 
    },
    'GS2': { 
      'Polity': 10, 
      'International Relations': 6, 
      'Social Issues': 4 
    },
    'GS3': { 
      'Economy': 8, 
      'Environment': 6, 
      'Science & Technology': 6 
    },
    'GS4': { 
      'Ethics': 20 
    }
  }

  async generateTest(config: TestConfiguration): Promise<MainsTest> {
    if (config.testType !== 'Mains') {
      throw new Error('MainsTestGenerator can only generate Mains tests')
    }

    const paper = this.determinePaper(config)
    
    if (paper === 'Essay') {
      return this.generateEssayPaper(config) as any
    }

    const questions = await this.generateMainsQuestions(paper, config)
    
    return this.createMainsTest(paper, questions, config)
  }

  async generateEssayPaper(config: TestConfiguration): Promise<EssayPaper> {
    const sections = await this.generateEssaySections()
    
    return {
      id: `essay-test-${Date.now()}`,
      title: 'UPSC Mains Essay Paper',
      series: 'Complete Test Series',
      testNumber: 1,
      duration: 180,
      sections,
      totalMarks: 250,
      createdAt: new Date(),
      instructions: this.generateEssayInstructions()
    }
  }

  validateTest(test: MainsTest): boolean {
    // Validate question count
    if (test.questions.length !== test.totalQuestions) {
      return false
    }

    // Validate marks distribution
    const total10MarkQuestions = test.questions.filter(q => q.marks === 10).length
    const total15MarkQuestions = test.questions.filter(q => q.marks === 15).length
    
    if (total10MarkQuestions !== 10 || total15MarkQuestions !== 10) {
      return false
    }

    // Validate subject distribution for the paper
    const paper = test.paper
    const expectedDistribution = this.questionDistribution[paper]
    const actualDistribution = this.countBySubject(test.questions)
    
    for (const [subject, expectedCount] of Object.entries(expectedDistribution)) {
      const actualCount = actualDistribution[subject as SubjectArea] || 0
      if (Math.abs(actualCount - expectedCount) > 2) {
        return false
      }
    }

    return true
  }

  ensureQualityStandards(test: MainsTest): boolean {
    // Check word limit variety
    const wordLimits = new Set(test.questions.map(q => q.wordLimit))
    if (wordLimits.size < 2) {
      return false
    }

    // Check for analytical questions
    const analyticalQuestions = test.questions.filter(q => 
      q.question.toLowerCase().includes('analyze') ||
      q.question.toLowerCase().includes('evaluate') ||
      q.question.toLowerCase().includes('discuss')
    )
    
    if (analyticalQuestions.length < test.questions.length * 0.6) {
      return false
    }

    // Check model answer quality
    const incompleteModels = test.questions.filter(q => 
      !q.modelAnswerFramework.introduction ||
      q.modelAnswerFramework.mainPoints.length < 3 ||
      !q.modelAnswerFramework.conclusion
    )
    
    if (incompleteModels.length > 0) {
      return false
    }

    return true
  }

  private determinePaper(config: TestConfiguration): 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' {
    // Could be determined from config or randomly selected
    const papers: ('GS1' | 'GS2' | 'GS3' | 'GS4')[] = ['GS1', 'GS2', 'GS3', 'GS4']
    return papers[Math.floor(Math.random() * papers.length)]
  }

  private async generateMainsQuestions(
    paper: 'GS1' | 'GS2' | 'GS3' | 'GS4',
    config: TestConfiguration
  ): Promise<MainsQuestion[]> {
    const questions: MainsQuestion[] = []
    const distribution = this.questionDistribution[paper]
    
    let questionNumber = 1
    
    for (const [subject, count] of Object.entries(distribution)) {
      const subjectQuestions = await this.generateSubjectQuestions(
        subject as SubjectArea,
        count,
        questionNumber,
        paper
      )
      questions.push(...subjectQuestions)
      questionNumber += count
    }

    return questions
  }

  private async generateSubjectQuestions(
    subject: SubjectArea,
    count: number,
    startNumber: number,
    paper: string
  ): Promise<MainsQuestion[]> {
    const questions: MainsQuestion[] = []
    const topics = this.getSubjectTopics(subject, paper)
    
    for (let i = 0; i < count; i++) {
      const questionNumber = startNumber + i
      const marks = questionNumber <= 10 ? 10 : 15
      const wordLimit: WordLimit = marks === 10 ? 150 : 250
      
      const question = await this.createMainsQuestion(
        questionNumber,
        subject,
        topics[i % topics.length],
        marks,
        wordLimit,
        paper
      )
      
      questions.push(question)
    }

    return questions
  }

  private async createMainsQuestion(
    questionNumber: number,
    subject: SubjectArea,
    topic: string,
    marks: number,
    wordLimit: WordLimit,
    paper: string
  ): Promise<MainsQuestion> {
    const questionText = this.generateQuestionText(subject, topic, marks, paper)
    const modelFramework = await this.generateModelAnswerFramework(subject, topic, questionText)
    
    return {
      id: `mains-${paper.toLowerCase()}-q${questionNumber}`,
      questionNumber,
      question: questionText,
      marks,
      wordLimit,
      subject,
      topic,
      modelAnswerFramework: modelFramework,
      keywords: this.extractKeywords(questionText, subject),
      approachHint: this.generateApproachHint(questionText, marks)
    }
  }

  private generateQuestionText(
    subject: SubjectArea,
    topic: string,
    marks: number,
    paper: string
  ): string {
    const isAnalytical = marks === 15
    const templates = this.getQuestionTemplates(subject, paper, isAnalytical)
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    return template.replace('{topic}', topic)
  }

  private getQuestionTemplates(
    subject: SubjectArea,
    paper: string,
    isAnalytical: boolean
  ): string[] {
    const baseTemplates = {
      'History': [
        'Analyze the significance of {topic} in shaping modern India.',
        'Evaluate the impact of {topic} on Indian society and culture.',
        'Discuss the role of {topic} in India\'s freedom struggle.',
        'Examine the socio-economic implications of {topic}.'
      ],
      'Geography': [
        'Analyze the geographical factors influencing {topic}.',
        'Discuss the environmental implications of {topic}.',
        'Evaluate the role of {topic} in regional development.',
        'Examine the challenges and opportunities related to {topic}.'
      ],
      'Polity': [
        'Critically analyze the constitutional provisions related to {topic}.',
        'Discuss the challenges in implementing {topic} in India.',
        'Evaluate the effectiveness of {topic} in Indian democracy.',
        'Examine the role of {topic} in strengthening democratic institutions.'
      ],
      'Economy': [
        'Analyze the economic implications of {topic} for India.',
        'Discuss the challenges and opportunities in {topic}.',
        'Evaluate the government\'s policy on {topic}.',
        'Examine the impact of {topic} on inclusive growth.'
      ],
      'Environment': [
        'Analyze the environmental challenges related to {topic}.',
        'Discuss India\'s approach to {topic} in the context of sustainable development.',
        'Evaluate the effectiveness of policies on {topic}.',
        'Examine the global and national implications of {topic}.'
      ],
      'Ethics': [
        'Analyze the ethical dimensions of {topic}.',
        'Discuss the moral dilemmas involved in {topic}.',
        'Evaluate the role of {topic} in public administration.',
        'Examine the ethical frameworks applicable to {topic}.'
      ]
    }

    if (!isAnalytical) {
      // For 10-mark questions, use simpler templates
      return baseTemplates[subject]?.map(template => 
        template.replace('Analyze', 'Discuss')
               .replace('Critically analyze', 'Explain')
               .replace('Evaluate', 'Outline')
      ) || []
    }

    return baseTemplates[subject] || []
  }

  private async generateModelAnswerFramework(
    subject: SubjectArea,
    topic: string,
    question: string
  ): Promise<ModelAnswerFramework> {
    return {
      introduction: this.generateIntroduction(topic, subject),
      mainPoints: this.generateMainPoints(subject, topic),
      conclusion: this.generateConclusion(topic, subject),
      diagrams: this.suggestDiagrams(subject, topic),
      examples: this.generateExamples(subject, topic),
      currentAffairsLinks: this.generateCurrentAffairsLinks(subject, topic)
    }
  }

  private generateIntroduction(topic: string, subject: SubjectArea): string {
    const templates = {
      'History': `Provide brief historical context of ${topic} and its significance in Indian history.`,
      'Geography': `Define ${topic} and explain its geographical significance for India.`,
      'Polity': `Introduce ${topic} with constitutional/legal background and current relevance.`,
      'Economy': `Define ${topic} and explain its importance in India's economic development.`,
      'Environment': `Introduce ${topic} in the context of environmental challenges and sustainability.`,
      'Ethics': `Define the ethical concept of ${topic} and its relevance in governance.`
    }
    
    return templates[subject] || `Provide a comprehensive introduction to ${topic}.`
  }

  private generateMainPoints(subject: SubjectArea, topic: string): string[] {
    const commonStructures = {
      'History': [
        'Historical background and evolution',
        'Key events and personalities involved',
        'Socio-economic impact',
        'Political implications',
        'Cultural significance',
        'Legacy and contemporary relevance'
      ],
      'Geography': [
        'Physical characteristics',
        'Human geography aspects',
        'Economic geography implications',
        'Environmental considerations',
        'Regional variations',
        'Policy implications'
      ],
      'Polity': [
        'Constitutional provisions',
        'Legislative framework',
        'Implementation challenges',
        'Role of various institutions',
        'Recent developments',
        'Way forward'
      ],
      'Economy': [
        'Current status and trends',
        'Government policies and initiatives',
        'Challenges and constraints',
        'Opportunities and potential',
        'International perspective',
        'Recommendations'
      ],
      'Environment': [
        'Environmental significance',
        'Current challenges',
        'Government initiatives',
        'International cooperation',
        'Technological solutions',
        'Sustainable approaches'
      ],
      'Ethics': [
        'Theoretical foundation',
        'Practical applications',
        'Ethical dilemmas',
        'Case study analysis',
        'Best practices',
        'Implementation strategies'
      ]
    }

    return commonStructures[subject] || [
      'Key aspects of the topic',
      'Current scenario',
      'Challenges faced',
      'Opportunities available',
      'Government initiatives',
      'Way forward'
    ]
  }

  private generateConclusion(topic: string, subject: SubjectArea): string {
    const templates = {
      'History': `Summarize the lasting impact of ${topic} and its lessons for contemporary India.`,
      'Geography': `Conclude with the future prospects and strategic importance of ${topic} for India.`,
      'Polity': `Conclude with recommendations for strengthening ${topic} in Indian democracy.`,
      'Economy': `Conclude with policy recommendations for optimizing ${topic} for economic growth.`,
      'Environment': `Conclude with sustainable solutions and future roadmap for ${topic}.`,
      'Ethics': `Conclude with the importance of ${topic} in ethical governance and administration.`
    }
    
    return templates[subject] || `Provide a balanced conclusion highlighting the significance of ${topic}.`
  }

  private suggestDiagrams(subject: SubjectArea, topic: string): string[] {
    const diagramSuggestions = {
      'Geography': ['Maps', 'Flow charts', 'Cross-sections', 'Climate graphs'],
      'Economy': ['Flow charts', 'Trend graphs', 'Pie charts', 'Comparative tables'],
      'Polity': ['Organizational charts', 'Process diagrams', 'Constitutional framework'],
      'Environment': ['Ecosystem diagrams', 'Process flows', 'Cause-effect charts'],
      'History': ['Timeline charts', 'Maps', 'Family trees', 'Cultural diagrams'],
      'Ethics': ['Value frameworks', 'Decision trees', 'Case study flows']
    }

    return diagramSuggestions[subject] || ['Relevant diagrams if applicable']
  }

  private generateExamples(subject: SubjectArea, topic: string): string[] {
    // This would be more sophisticated in production
    return [
      `Contemporary example related to ${topic}`,
      `Historical precedent for ${topic}`,
      `International best practice in ${topic}`,
      `Government scheme/policy on ${topic}`,
      `Case study demonstrating ${topic}`
    ]
  }

  private generateCurrentAffairsLinks(subject: SubjectArea, topic: string): string[] {
    return [
      `Recent government initiatives on ${topic}`,
      `International developments in ${topic}`,
      `Economic survey references to ${topic}`,
      `Supreme Court judgments on ${topic}`,
      `Committee reports on ${topic}`
    ]
  }

  private extractKeywords(question: string, subject: SubjectArea): string[] {
    const subjectKeywords = {
      'History': ['historical', 'evolution', 'significance', 'impact', 'legacy'],
      'Geography': ['geographical', 'spatial', 'regional', 'distribution', 'pattern'],
      'Polity': ['constitutional', 'democratic', 'governance', 'institutional', 'legal'],
      'Economy': ['economic', 'growth', 'development', 'policy', 'financial'],
      'Environment': ['environmental', 'sustainable', 'conservation', 'ecological', 'green'],
      'Ethics': ['ethical', 'moral', 'values', 'integrity', 'accountability']
    }

    const questionKeywords = question.toLowerCase().split(' ')
      .filter(word => word.length > 4)
      .slice(0, 5)

    return [...(subjectKeywords[subject] || []), ...questionKeywords]
  }

  private generateApproachHint(question: string, marks: number): string {
    const questionLower = question.toLowerCase()
    
    if (questionLower.includes('analyze')) {
      return 'Break down the topic into components, examine relationships, and provide detailed analysis with examples.'
    } else if (questionLower.includes('evaluate')) {
      return 'Assess the merits and demerits, provide balanced judgment, and conclude with recommendations.'
    } else if (questionLower.includes('discuss')) {
      return 'Present different perspectives, provide comprehensive coverage, and maintain objectivity.'
    } else if (questionLower.includes('examine')) {
      return 'Investigate thoroughly, look into various dimensions, and provide detailed examination.'
    }

    if (marks === 10) {
      return 'Provide concise yet comprehensive answer with key points and brief examples.'
    } else {
      return 'Provide detailed analysis with multiple examples, current affairs linkages, and comprehensive coverage.'
    }
  }

  private getSubjectTopics(subject: SubjectArea, paper: string): string[] {
    const topicDatabase = {
      'GS1': {
        'History': [
          'Indian National Movement',
          'Post-Independence Consolidation',
          'Regional History',
          'World History',
          'Art and Culture',
          'Social Reform Movements',
          'Modern Indian History',
          'Ancient Indian Philosophy'
        ],
        'Geography': [
          'Physical Geography of India',
          'Climate and Weather',
          'Natural Resources',
          'Agriculture and Food Security',
          'Urbanization',
          'Population and Settlement'
        ],
        'Social Issues': [
          'Poverty and Development',
          'Women and Development',
          'Social Empowerment',
          'Communalism and Regionalism'
        ],
        'Art & Culture': [
          'Indian Heritage',
          'Literature and Philosophy'
        ]
      },
      'GS2': {
        'Polity': [
          'Constitutional Framework',
          'Separation of Powers',
          'Centre-State Relations',
          'Local Governance',
          'Judiciary',
          'Executive',
          'Legislature',
          'Electoral Reforms',
          'Transparency and Accountability',
          'Good Governance'
        ],
        'International Relations': [
          'India\'s Foreign Policy',
          'Bilateral Relations',
          'Regional Groupings',
          'International Organizations',
          'Global Issues',
          'Diaspora'
        ],
        'Social Issues': [
          'Health',
          'Education',
          'Human Resources',
          'Social Justice'
        ]
      },
      'GS3': {
        'Economy': [
          'Economic Development',
          'Government Budgeting',
          'Banking and Finance',
          'Agriculture',
          'Industry',
          'Services',
          'Investment Models',
          'Infrastructure'
        ],
        'Environment': [
          'Climate Change',
          'Biodiversity',
          'Environmental Pollution',
          'Environmental Impact Assessment',
          'Disaster Management',
          'Conservation'
        ],
        'Science & Technology': [
          'Developments in Science and Technology',
          'IT and Space',
          'Computers',
          'Robotics',
          'Nano-technology',
          'Biotechnology'
        ]
      },
      'GS4': {
        'Ethics': [
          'Ethics and Human Interface',
          'Attitude',
          'Aptitude',
          'Emotional Intelligence',
          'Public Service Values',
          'Probity in Governance',
          'Ethical Issues in International Relations',
          'Corporate Governance',
          'Case Studies on Ethics',
          'Philosophical Foundations of Ethics',
          'Information Sharing and Transparency',
          'Ethics in Public Administration',
          'Challenges of Corruption',
          'Civil Service Values',
          'Work Culture',
          'Quality of Service Delivery',
          'Utilization of Public Funds',
          'Challenges in Administration',
          'Citizen\'s Charter',
          'Whistleblowing'
        ]
      }
    }

    return topicDatabase[paper]?.[subject] || ['General Topics']
  }

  private async generateEssaySections(): Promise<EssaySection[]> {
    const themes = [
      {
        sectionName: 'Section A' as const,
        theme: 'Ethics and Human Values',
        topics: [
          'Truth and Non-violence',
          'Compassion and Empathy',
          'Justice and Fairness',
          'Courage and Determination'
        ]
      },
      {
        sectionName: 'Section B' as const,
        theme: 'Governance and Development',
        topics: [
          'Technology and Human Progress',
          'Sustainable Development',
          'Innovation and Creativity',
          'Leadership and Social Change'
        ]
      }
    ]

    return themes.map(theme => ({
      sectionName: theme.sectionName,
      theme: theme.theme,
      topics: theme.topics.map((topic, index) => ({
        id: `essay-${theme.sectionName.toLowerCase()}-${index + 1}`,
        topic,
        hints: this.generateEssayHints(topic),
        expectedApproach: this.generateEssayApproach(topic),
        keyPoints: this.generateEssayKeyPoints(topic),
        wordLimit: 1000,
        marks: 125
      }))
    }))
  }

  private generateEssayHints(topic: string): string[] {
    return [
      `Define and contextualize ${topic}`,
      'Provide relevant examples and case studies',
      'Discuss various dimensions and perspectives',
      'Connect with current affairs and contemporary issues',
      'Conclude with a forward-looking perspective'
    ]
  }

  private generateEssayApproach(topic: string): string {
    return `Start with a compelling introduction that defines ${topic}. Develop the essay by exploring multiple dimensions, providing concrete examples, and connecting with contemporary relevance. Maintain a balanced perspective throughout and conclude with insights for the future.`
  }

  private generateEssayKeyPoints(topic: string): string[] {
    return [
      `Conceptual understanding of ${topic}`,
      'Historical and philosophical perspectives',
      'Contemporary relevance and applications',
      'Challenges and opportunities',
      'Global and national context',
      'Future implications and way forward'
    ]
  }

  private generateEssayInstructions(): string[] {
    return [
      'Write essays on any four topics, selecting two from each section.',
      'Each essay should be approximately 1000 words.',
      'Credit will be given for originality in approach and expression.',
      'Use relevant examples and case studies.',
      'Maintain clarity of thought and expression.',
      'Time management is crucial - allocate 45 minutes per essay.',
      'Plan your essay structure before writing.',
      'Write legibly and maintain proper grammar.'
    ]
  }

  private createMainsTest(
    paper: 'GS1' | 'GS2' | 'GS3' | 'GS4',
    questions: MainsQuestion[],
    config: TestConfiguration
  ): MainsTest {
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

    return {
      id: `mains-${paper.toLowerCase()}-${Date.now()}`,
      title: `UPSC Mains ${paper} Mock Test`,
      paper,
      series: 'Complete Test Series',
      testNumber: 1,
      duration: 180,
      totalQuestions: questions.length,
      questions,
      totalMarks,
      createdAt: new Date(),
      instructions: this.generateMainsInstructions(paper)
    }
  }

  private generateMainsInstructions(paper: string): string[] {
    return [
      `This is ${paper} paper with 20 questions.`,
      'Questions 1-10 carry 10 marks each (150 words).',
      'Questions 11-20 carry 15 marks each (250 words).',
      'Total duration is 3 hours.',
      'All questions are compulsory.',
      'Write answers clearly and legibly.',
      'Use diagrams wherever necessary.',
      'Provide examples and case studies.',
      'Maintain word limits strictly.'
    ]
  }

  private countBySubject(questions: MainsQuestion[]): Record<SubjectArea, number> {
    const count: Partial<Record<SubjectArea, number>> = {}
    
    questions.forEach(q => {
      count[q.subject] = (count[q.subject] || 0) + 1
    })

    return count as Record<SubjectArea, number>
  }
}