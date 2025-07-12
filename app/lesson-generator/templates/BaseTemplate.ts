import { 
  Lesson, 
  GeneratorConfig, 
  TemplateGenerator,
  SubjectArea,
  PracticeQuestion,
  PreviousYearQuestion,
  InteractiveElement
} from '../types'

export abstract class BaseTemplate implements TemplateGenerator {
  protected abstract templateName: string
  protected abstract supportedSubjects: SubjectArea[]
  
  abstract generateContent(config: GeneratorConfig): {
    introduction: string
    mainExplanation: string
    examples: string[]
    visualElements?: string[]
    interactiveElements: InteractiveElement[]
  }
  
  abstract generatePracticeQuestions(config: GeneratorConfig): PracticeQuestion[]
  
  abstract generatePreviousYearQuestion(config: GeneratorConfig): PreviousYearQuestion
  
  abstract generateSummary(config: GeneratorConfig): {
    keyTakeaways: string[]
    mnemonics?: string[]
    commonMistakes: string[]
    examTips: string[]
  }
  
  async generate(config: GeneratorConfig): Promise<Lesson> {
    if (!this.validateInput(config)) {
      throw new Error(`Invalid config for ${this.templateName}`)
    }
    
    const lesson: Lesson = {
      metadata: {
        id: this.generateId(config),
        title: this.generateTitle(config),
        subject: config.subject,
        topic: config.topic,
        difficulty: config.difficulty,
        template: config.template,
        duration: 5,
        prerequisites: config.prerequisites || [],
        tags: this.generateTags(config),
        examWeight: this.determineExamWeight(config),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      content: this.generateContent(config),
      practice: {
        questions: this.generatePracticeQuestions(config),
        previousYearQuestion: this.generatePreviousYearQuestion(config)
      },
      summary: this.generateSummary(config),
      connections: this.generateConnections(config)
    }
    
    return lesson
  }
  
  validateInput(config: GeneratorConfig): boolean {
    return this.supportedSubjects.includes(config.subject)
  }
  
  getSupportedSubjects(): SubjectArea[] {
    return this.supportedSubjects
  }
  
  protected generateId(config: GeneratorConfig): string {
    const subject = config.subject.toLowerCase().replace(/\s+/g, '-')
    const topic = config.topic.toLowerCase().replace(/\s+/g, '-')
    const timestamp = Date.now()
    return `${subject}-${topic}-${timestamp}`
  }
  
  protected generateTitle(config: GeneratorConfig): string {
    return `${config.topic} - ${config.subject}`
  }
  
  protected generateTags(config: GeneratorConfig): string[] {
    const tags = [config.subject, config.difficulty, config.template]
    // Add topic-specific tags
    const topicWords = config.topic.split(' ')
    tags.push(...topicWords.filter(word => word.length > 3))
    return tags
  }
  
  protected determineExamWeight(config: GeneratorConfig): 'high' | 'medium' | 'low' {
    // Default implementation - can be overridden
    const highWeightSubjects = ['Polity', 'Economy', 'Current Affairs']
    if (highWeightSubjects.includes(config.subject)) {
      return 'high'
    }
    return config.difficulty === 'advanced' ? 'high' : 'medium'
  }
  
  protected generateConnections(config: GeneratorConfig) {
    // Default implementation - can be overridden
    return {
      relatedTopics: this.findRelatedTopics(config),
      prerequisiteTopics: config.prerequisites || [],
      nextTopics: this.suggestNextTopics(config),
      crossSubjectLinks: this.findCrossSubjectLinks(config)
    }
  }
  
  protected findRelatedTopics(config: GeneratorConfig): string[] {
    // Default implementation
    return [`Advanced ${config.topic}`, `${config.topic} Case Studies`]
  }
  
  protected suggestNextTopics(config: GeneratorConfig): string[] {
    // Default implementation
    return [`${config.topic} - Practice Problems`, `${config.topic} - Current Developments`]
  }
  
  protected findCrossSubjectLinks(config: GeneratorConfig): string[] {
    // Default implementation
    return []
  }
  
  // Utility methods for content generation
  protected generateConceptDefinition(concept: string): string {
    return `${concept} is a fundamental concept that plays a crucial role in understanding the broader context of the subject.`
  }
  
  protected generateExample(topic: string, index: number): string {
    return `Example ${index + 1}: A practical application of ${topic} can be seen in...`
  }
  
  protected generateQuestionStem(topic: string, difficulty: string): string {
    const stems = {
      beginner: `Which of the following statements about ${topic} is correct?`,
      intermediate: `Consider the following statements regarding ${topic}:`,
      advanced: `Analyze the following scenario related to ${topic}:`
    }
    return stems[difficulty as keyof typeof stems] || stems.beginner
  }
}