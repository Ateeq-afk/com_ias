import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel,
  QuestionOption
} from '../types'

export class SingleCorrectMCQGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['SingleCorrectMCQ']
  protected generatorName = 'SingleCorrectMCQGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createSingleCorrectMCQ(baseFact, difficulty)
      questions.push(mainQuestion)
      
      // Generate negative version if requested
      if (generateNegatives) {
        const negativeQuestion = await this.createNegativeVersion(baseFact, difficulty)
        questions.push(negativeQuestion)
      }
      
      // Generate variations if requested
      if (includeVariations) {
        const variations = await this.createVariations(baseFact, difficulty)
        questions.push(...variations)
      }
    }
    
    return questions
  }
  
  private async createSingleCorrectMCQ(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const questionText = this.generateQuestionText(baseFact, difficulty)
    const options = this.generateOptions(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, options)
    
    return {
      id: this.generateQuestionId(),
      type: 'SingleCorrectMCQ',
      questionText,
      data: {
        singleCorrect: { options }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'SingleCorrectMCQ'),
      marks: this.determineMarks(difficulty, 'SingleCorrectMCQ'),
      conceptsTested: [baseFact.content, ...baseFact.concepts],
      explanation,
      metadata: {
        created: new Date().toISOString(),
        qualityScore: 0, // Will be calculated by validator
        pyqSimilarity: 0, // Will be calculated by pattern analyzer
        highYieldTopic: baseFact.importance === 'high',
        difficultyValidated: false,
        factuallyAccurate: true
      },
      tags: this.generateTags(baseFact, 'SingleCorrectMCQ', difficulty)
    }
  }
  
  private generateQuestionText(baseFact: BaseFact, difficulty: DifficultyLevel): string {
    const fact = baseFact.content
    const source = baseFact.source
    
    switch (difficulty) {
      case 'easy':
        return this.generateEasyQuestion(fact, source)
      case 'medium':
        return this.generateMediumQuestion(fact, source, baseFact.concepts)
      case 'hard':
        return this.generateHardQuestion(fact, source, baseFact.concepts, baseFact.relatedFacts)
      default:
        return this.generateEasyQuestion(fact, source)
    }
  }
  
  private generateEasyQuestion(fact: string, source: string): string {
    const patterns = [
      `Which ${source} of the Indian Constitution deals with "${fact}"?`,
      `"${fact}" is provided under which constitutional provision?`,
      `The constitutional provision "${fact}" is found in:`,
      `Which of the following is correct about ${fact}?`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateMediumQuestion(fact: string, source: string, concepts: string[]): string {
    const relatedConcept = concepts[0] || 'governance'
    const patterns = [
      `In the context of ${relatedConcept}, "${fact}" as mentioned in ${source}:`,
      `Consider the following about "${fact}" under ${source}. Which statement is most accurate?`,
      `The provision "${fact}" (${source}) is significant because it:`,
      `How does "${fact}" under ${source} relate to the broader framework of ${relatedConcept}?`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateHardQuestion(fact: string, source: string, concepts: string[], relatedFacts: string[]): string {
    const relatedFact = relatedFacts[0] || 'constitutional framework'
    const concept = concepts[0] || 'constitutional law'
    
    const patterns = [
      `Analyze the relationship between "${fact}" (${source}) and ${relatedFact} in the context of ${concept}. Which of the following best describes this relationship?`,
      `Critically examine: "${fact}" as enshrined in ${source} has evolved through judicial interpretation. Which statement most accurately reflects this evolution?`,
      `In a comparative analysis of constitutional provisions, "${fact}" (${source}) differs from similar provisions in other democracies primarily because:`,
      `The implementation of "${fact}" (${source}) faces challenges in contemporary India. Which factor is most significant?`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateOptions(baseFact: BaseFact, difficulty: DifficultyLevel): QuestionOption[] {
    const options: QuestionOption[] = []
    
    // Generate correct option
    const correctOption = this.generateCorrectOption(baseFact, difficulty)
    options.push(correctOption)
    
    // Generate distractors
    const distractors = this.generateDistractors(baseFact, difficulty, 3)
    options.push(...distractors)
    
    // Shuffle options
    return this.shuffleOptions(options)
  }
  
  private generateCorrectOption(baseFact: BaseFact, difficulty: DifficultyLevel): QuestionOption {
    let text: string
    
    switch (difficulty) {
      case 'easy':
        text = `${baseFact.source} - ${baseFact.content}`
        break
      case 'medium':
        text = `${baseFact.source} ensures ${baseFact.content} with reasonable restrictions as per constitutional mandate`
        break
      case 'hard':
        text = `${baseFact.source} establishes ${baseFact.content} as part of the constitutional framework, balanced with state obligations and individual responsibilities`
        break
      default:
        text = baseFact.content
    }
    
    return {
      id: `opt-${Date.now()}-correct`,
      text,
      isCorrect: true,
      explanation: `This is correct because ${baseFact.source} specifically provides for ${baseFact.content}. This provision is fundamental to the constitutional framework.`
    }
  }
  
  private generateDistractors(baseFact: BaseFact, difficulty: DifficultyLevel, count: number): QuestionOption[] {
    const distractors: QuestionOption[] = []
    
    // Common distractor patterns
    const distractorPatterns = [
      this.generateSimilarArticleDistractor(baseFact),
      this.generateRelatedConceptDistractor(baseFact),
      this.generateOppositeDistractor(baseFact)
    ]
    
    for (let i = 0; i < count && i < distractorPatterns.length; i++) {
      distractors.push({
        id: `opt-${Date.now()}-${i}`,
        text: distractorPatterns[i].text,
        isCorrect: false,
        explanation: distractorPatterns[i].explanation
      })
    }
    
    return distractors
  }
  
  private generateSimilarArticleDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    const sourceNum = parseInt(baseFact.source.replace('Article ', ''))
    const similarSource = `Article ${sourceNum + 1}`
    
    return {
      text: `${similarSource} - Similar but different provision`,
      explanation: `This is incorrect. ${similarSource} deals with a different aspect and should not be confused with ${baseFact.source}.`
    }
  }
  
  private generateRelatedConceptDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    const relatedConcepts = {
      'Right to Equality': 'Right to Freedom',
      'Right to Life': 'Right to Privacy',
      'Freedom of Religion': 'Freedom of Speech',
      'Constitutional Remedies': 'Judicial Review'
    }
    
    const related = relatedConcepts[baseFact.content] || 'Related constitutional provision'
    
    return {
      text: `Constitutional provision for ${related}`,
      explanation: `This is incorrect. While ${related} is constitutionally important, it is distinct from ${baseFact.content}.`
    }
  }
  
  private generateOppositeDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    return {
      text: `This provision does not exist in the Indian Constitution`,
      explanation: `This is incorrect. ${baseFact.source} clearly establishes ${baseFact.content} as a constitutional provision.`
    }
  }
  
  private shuffleOptions(options: QuestionOption[]): QuestionOption[] {
    const shuffled = [...options]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  
  private generateDetailedExplanation(baseFact: BaseFact, options: QuestionOption[]) {
    const correctOption = options.find(opt => opt.isCorrect)!
    const wrongOptions = options.filter(opt => !opt.isCorrect)
    
    return {
      correctAnswer: correctOption.text,
      whyCorrect: correctOption.explanation,
      whyOthersWrong: wrongOptions.map(opt => opt.explanation),
      conceptClarity: `${baseFact.content} is enshrined in ${baseFact.source} of the Indian Constitution. This provision is part of ${baseFact.topic} and plays a crucial role in the constitutional framework.`,
      memoryTrick: this.generateMemoryTrick(baseFact.source.toLowerCase()),
      commonMistakes: this.generateCommonMistakes(baseFact.content.toLowerCase()),
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private async createNegativeVersion(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const mainQuestion = await this.createSingleCorrectMCQ(baseFact, difficulty)
    
    // Transform to negative
    mainQuestion.questionText = `Which of the following is NOT related to ${baseFact.content}?`
    mainQuestion.id = this.generateQuestionId()
    
    // Flip correct/incorrect options
    if (mainQuestion.data.singleCorrect) {
      mainQuestion.data.singleCorrect.options.forEach(option => {
        option.isCorrect = !option.isCorrect
      })
    }
    
    return mainQuestion
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Application-based variation
    const applicationQuestion = await this.createSingleCorrectMCQ(baseFact, difficulty)
    applicationQuestion.questionText = `In which of the following scenarios would ${baseFact.content} be most applicable?`
    applicationQuestion.id = this.generateQuestionId()
    variations.push(applicationQuestion)
    
    // Constitutional significance variation
    const significanceQuestion = await this.createSingleCorrectMCQ(baseFact, difficulty)
    significanceQuestion.questionText = `The constitutional significance of ${baseFact.content} (${baseFact.source}) lies primarily in:`
    significanceQuestion.id = this.generateQuestionId()
    variations.push(significanceQuestion)
    
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'SingleCorrectMCQ') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.singleCorrect
    if (!data) {
      issues.push('Missing single correct MCQ data')
      return
    }
    
    if (data.options.length !== 4) {
      issues.push('Single correct MCQ must have exactly 4 options')
      suggestions.push('Add or remove options to make exactly 4')
    }
    
    const correctOptions = data.options.filter(opt => opt.isCorrect)
    if (correctOptions.length !== 1) {
      issues.push('Single correct MCQ must have exactly 1 correct option')
      suggestions.push('Ensure only one option is marked as correct')
    }
    
    // Check option quality
    data.options.forEach((option, index) => {
      if (!option.text || option.text.length < 5) {
        issues.push(`Option ${index + 1} is too short`)
      }
      if (!option.explanation) {
        issues.push(`Option ${index + 1} missing explanation`)
      }
    })
  }
}