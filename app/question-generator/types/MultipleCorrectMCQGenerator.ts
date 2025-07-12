import { BaseQuestionGenerator } from '../BaseQuestionGenerator'
import { 
  Question, 
  QuestionType, 
  QuestionGenerationConfig,
  BaseFact,
  DifficultyLevel,
  QuestionOption
} from '../types'

export class MultipleCorrectMCQGenerator extends BaseQuestionGenerator {
  protected supportedTypes: QuestionType[] = ['MultipleCorrectMCQ']
  protected generatorName = 'MultipleCorrectMCQGenerator'
  
  async generateQuestion(config: QuestionGenerationConfig): Promise<Question[]> {
    const questions: Question[] = []
    const { baseFact, difficulties, generateNegatives, includeVariations } = config
    
    for (const difficulty of difficulties) {
      // Generate main question
      const mainQuestion = await this.createMultipleCorrectMCQ(baseFact, difficulty)
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
  
  private async createMultipleCorrectMCQ(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const questionText = this.generateQuestionText(baseFact, difficulty)
    const { options, correctCount } = this.generateOptions(baseFact, difficulty)
    const explanation = this.generateDetailedExplanation(baseFact, options)
    
    return {
      id: this.generateQuestionId(),
      type: 'MultipleCorrectMCQ',
      questionText,
      data: {
        multipleCorrect: { options, correctCount }
      },
      difficulty,
      subject: baseFact.subject,
      topic: baseFact.topic,
      baseFact: baseFact.id,
      timeToSolve: this.determineTimeToSolve(difficulty, 'MultipleCorrectMCQ'),
      marks: this.determineMarks(difficulty, 'MultipleCorrectMCQ'),
      conceptsTested: [baseFact.content, ...baseFact.concepts],
      explanation,
      metadata: {
        created: new Date().toISOString(),
        qualityScore: 0,
        pyqSimilarity: 0,
        highYieldTopic: baseFact.importance === 'high',
        difficultyValidated: false,
        factuallyAccurate: true
      },
      tags: this.generateTags(baseFact, 'MultipleCorrectMCQ', difficulty)
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
      `Which of the following statements about "${fact}" are correct? (Select all that apply)`,
      `Select the correct statements regarding "${fact}" under ${source}:`,
      `Which of the following are true about the constitutional provision "${fact}"?`,
      `Identify the correct statements about ${fact}:`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateMediumQuestion(fact: string, source: string, concepts: string[]): string {
    const relatedConcept = concepts[0] || 'governance'
    const patterns = [
      `In the context of ${relatedConcept}, which statements about "${fact}" (${source}) are accurate?`,
      `Analyze the following statements about "${fact}" under ${source}. Which are correct?`,
      `Consider the constitutional framework of ${relatedConcept}. Which statements about "${fact}" hold true?`,
      `With reference to ${source}, identify the correct statements about "${fact}":`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateHardQuestion(fact: string, source: string, concepts: string[], relatedFacts: string[]): string {
    const relatedFact = relatedFacts[0] || 'constitutional framework'
    const concept = concepts[0] || 'constitutional law'
    
    const patterns = [
      `In the complex interplay between "${fact}" (${source}) and ${relatedFact}, which statements are constitutionally sound?`,
      `Evaluate these statements about "${fact}" in the contemporary context of ${concept}:`,
      `From a comparative constitutional perspective, which statements about "${fact}" (${source}) are accurate?`,
      `Critical analysis: Which statements correctly describe the evolution and implementation of "${fact}" under ${source}?`
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }
  
  private generateOptions(baseFact: BaseFact, difficulty: DifficultyLevel): { options: QuestionOption[], correctCount: number } {
    const options: QuestionOption[] = []
    const correctCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 2
    
    // Generate correct options
    const correctOptions = this.generateCorrectOptions(baseFact, difficulty, correctCount)
    options.push(...correctOptions)
    
    // Generate incorrect options
    const totalOptions = 4
    const incorrectCount = totalOptions - correctCount
    const incorrectOptions = this.generateIncorrectOptions(baseFact, difficulty, incorrectCount)
    options.push(...incorrectOptions)
    
    // Shuffle options
    return {
      options: this.shuffleOptions(options),
      correctCount
    }
  }
  
  private generateCorrectOptions(baseFact: BaseFact, difficulty: DifficultyLevel, count: number): QuestionOption[] {
    const correctOptions: QuestionOption[] = []
    
    const optionPatterns = this.getCorrectOptionPatterns(baseFact, difficulty)
    
    for (let i = 0; i < count && i < optionPatterns.length; i++) {
      correctOptions.push({
        id: `opt-${Date.now()}-correct-${i}`,
        text: optionPatterns[i].text,
        isCorrect: true,
        explanation: optionPatterns[i].explanation
      })
    }
    
    return correctOptions
  }
  
  private getCorrectOptionPatterns(baseFact: BaseFact, difficulty: DifficultyLevel): { text: string, explanation: string }[] {
    const patterns: { text: string, explanation: string }[] = []
    
    switch (difficulty) {
      case 'easy':
        patterns.push(
          {
            text: `${baseFact.source} establishes ${baseFact.content}`,
            explanation: `Correct. ${baseFact.source} specifically provides for ${baseFact.content}.`
          },
          {
            text: `${baseFact.content} is a constitutional provision`,
            explanation: `Correct. This is enshrined in the Constitution under ${baseFact.source}.`
          },
          {
            text: `The provision relates to ${baseFact.topic}`,
            explanation: `Correct. This falls under the constitutional framework of ${baseFact.topic}.`
          }
        )
        break
        
      case 'medium':
        patterns.push(
          {
            text: `${baseFact.source} ensures ${baseFact.content} with appropriate constitutional safeguards`,
            explanation: `Correct. The constitutional provision includes necessary safeguards and limitations.`
          },
          {
            text: `Implementation of ${baseFact.content} requires legislative framework`,
            explanation: `Correct. Most constitutional provisions require enabling legislation for effective implementation.`
          },
          {
            text: `${baseFact.content} has evolved through judicial interpretation`,
            explanation: `Correct. Constitutional provisions develop meaning through judicial precedents and interpretations.`
          },
          {
            text: `The provision balances individual rights with state obligations`,
            explanation: `Correct. Constitutional law maintains equilibrium between rights and responsibilities.`
          }
        )
        break
        
      case 'hard':
        patterns.push(
          {
            text: `${baseFact.content} represents a synthesis of liberal and social democratic principles`,
            explanation: `Correct. The Indian Constitution balances individual freedoms with social welfare objectives.`
          },
          {
            text: `Contemporary challenges have necessitated reinterpretation of ${baseFact.content}`,
            explanation: `Correct. Constitutional provisions must adapt to changing social and technological contexts.`
          },
          {
            text: `The provision reflects influence of comparative constitutional law`,
            explanation: `Correct. Indian constitutional framers drew from various constitutional traditions globally.`
          }
        )
        break
    }
    
    return patterns
  }
  
  private generateIncorrectOptions(baseFact: BaseFact, difficulty: DifficultyLevel, count: number): QuestionOption[] {
    const incorrectOptions: QuestionOption[] = []
    
    const incorrectPatterns = [
      this.generateConfusingFactDistractor(baseFact),
      this.generateOppositeDistractor(baseFact),
      this.generatePartiallyTrueDistractor(baseFact)
    ]
    
    for (let i = 0; i < count && i < incorrectPatterns.length; i++) {
      incorrectOptions.push({
        id: `opt-${Date.now()}-incorrect-${i}`,
        text: incorrectPatterns[i].text,
        isCorrect: false,
        explanation: incorrectPatterns[i].explanation
      })
    }
    
    return incorrectOptions
  }
  
  private generateConfusingFactDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    const sourceNum = parseInt(baseFact.source.replace('Article ', ''))
    const confusingSource = `Article ${sourceNum + 1}`
    
    return {
      text: `${confusingSource} is the primary source for ${baseFact.content}`,
      explanation: `Incorrect. ${baseFact.source}, not ${confusingSource}, deals with ${baseFact.content}.`
    }
  }
  
  private generateOppositeDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    return {
      text: `${baseFact.content} is not recognized by the Indian Constitution`,
      explanation: `Incorrect. ${baseFact.content} is explicitly provided for in ${baseFact.source}.`
    }
  }
  
  private generatePartiallyTrueDistractor(baseFact: BaseFact): { text: string, explanation: string } {
    return {
      text: `${baseFact.content} applies only to Indian citizens, not to foreigners`,
      explanation: `Incorrect. Many constitutional provisions apply to all persons within Indian territory, not just citizens.`
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
    const correctOptions = options.filter(opt => opt.isCorrect)
    const wrongOptions = options.filter(opt => !opt.isCorrect)
    
    return {
      correctAnswer: correctOptions.map(opt => opt.text).join('; '),
      whyCorrect: correctOptions.map(opt => opt.explanation).join(' '),
      whyOthersWrong: wrongOptions.map(opt => opt.explanation),
      conceptClarity: `${baseFact.content} under ${baseFact.source} involves multiple dimensions that require careful analysis. Understanding each aspect helps in comprehensive preparation.`,
      memoryTrick: this.generateMemoryTrick(baseFact.source.toLowerCase()),
      commonMistakes: this.generateCommonMistakes(baseFact.content.toLowerCase()),
      relatedPYQs: this.findRelatedPYQs(baseFact.content.toLowerCase())
    }
  }
  
  private async createNegativeVersion(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question> {
    const mainQuestion = await this.createMultipleCorrectMCQ(baseFact, difficulty)
    
    // Transform to negative
    mainQuestion.questionText = `Which of the following statements about ${baseFact.content} are INCORRECT?`
    mainQuestion.id = this.generateQuestionId()
    
    // Flip correct/incorrect options
    if (mainQuestion.data.multipleCorrect) {
      mainQuestion.data.multipleCorrect.options.forEach(option => {
        option.isCorrect = !option.isCorrect
      })
      // Update correct count
      mainQuestion.data.multipleCorrect.correctCount = 
        mainQuestion.data.multipleCorrect.options.filter(opt => opt.isCorrect).length
    }
    
    return mainQuestion
  }
  
  private async createVariations(baseFact: BaseFact, difficulty: DifficultyLevel): Promise<Question[]> {
    const variations: Question[] = []
    
    // Implementation-focused variation
    const implementationQuestion = await this.createMultipleCorrectMCQ(baseFact, difficulty)
    implementationQuestion.questionText = `Which statements about the implementation of ${baseFact.content} are accurate?`
    implementationQuestion.id = this.generateQuestionId()
    variations.push(implementationQuestion)
    
    return variations
  }
  
  protected async validateByType(question: Question, issues: string[], suggestions: string[]): Promise<void> {
    if (question.type !== 'MultipleCorrectMCQ') {
      issues.push('Question type mismatch')
      return
    }
    
    const data = question.data.multipleCorrect
    if (!data) {
      issues.push('Missing multiple correct MCQ data')
      return
    }
    
    if (data.options.length !== 4) {
      issues.push('Multiple correct MCQ must have exactly 4 options')
      suggestions.push('Adjust to exactly 4 options')
    }
    
    const correctOptions = data.options.filter(opt => opt.isCorrect)
    if (correctOptions.length < 2 || correctOptions.length > 3) {
      issues.push('Multiple correct MCQ should have 2-3 correct options')
      suggestions.push('Ensure 2-3 options are marked as correct')
    }
    
    if (data.correctCount !== correctOptions.length) {
      issues.push('Correct count mismatch with actual correct options')
      suggestions.push('Update correctCount to match actual correct options')
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